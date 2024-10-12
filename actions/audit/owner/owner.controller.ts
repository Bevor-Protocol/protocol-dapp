import BlobService from "@/actions/blob/blob.service";
import NotificationService from "@/actions/notification/notification.service";
import RoleService from "@/actions/roles/roles.service";
import { handleErrors } from "@/utils/decorators";
import { ResponseI } from "@/utils/types";
import { auditFormSchema, parseForm } from "@/utils/validations";
import { ActionType, Audit, AuditStatusType, RoleType, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import AuditService from "../audit.service";
import AuditorService from "../auditor/auditor.service";
import OwnerService from "./owner.service";

/*
Mutations will return a Generic ResponseI type object.

We can't send 4xx/5xx responses in server actions, so we destructure
responses to handle { success: boolean, data: T}, which we can handle client side.

Most mutations will require revalidation of cache.
*/

class OwnerController {
  constructor(
    private readonly ownerService: typeof OwnerService,
    private readonly blobService: typeof BlobService,
    private readonly roleService: typeof RoleService,
    private readonly notificationService: typeof NotificationService,
    private readonly auditService: typeof AuditService,
    private readonly auditorService: typeof AuditorService,
  ) {}

  @handleErrors
  async createAudit(formData: FormData, auditors: User[]): Promise<ResponseI<Audit>> {
    const parsed = parseForm(formData, auditFormSchema) as z.infer<typeof auditFormSchema>;

    const { details, ...rest } = parsed;
    const dataPass: Omit<typeof parsed, "details"> & { details?: string } = {
      ...rest,
    };

    const user = await this.roleService.requireRole(RoleType.OWNER);

    const blobData = await this.blobService.addBlob("audit-details", details);
    if (blobData) {
      dataPass.details = blobData.url;
    }

    const data = await this.ownerService.createAudit(user.id, dataPass, auditors);

    return { success: true, data };
  }

  /**
   * Updates audit metadata, and whitelists or removes auditors.
   * Performs a check of current auditors, and decides which ones to remove + add.
   *
   * If currently locked, it'll reset all attestations for auditors as well
   * as broadcast an event to users.
   *
   * Due to the nature of the call, the entirety of metadata of an audit is passed
   * per request, so we can evaluate if an update is required.
   *
   * @param {string} auditId - The ID of the audit to update.
   * @param {string[]} formData - A FormData object of the updated audit metadata.
   * @param {string[]} auditors - A array of users to whitelist.
   * @returns {Promise<ResponseI<boolean>>} - A promise that resolves to a response object
   * indicating the success or failure of the operation.
   */
  @handleErrors
  async updateAudit(
    auditId: string,
    formData: FormData,
    auditors: User[],
  ): Promise<ResponseI<boolean>> {
    const parsed = parseForm(formData, auditFormSchema) as z.infer<typeof auditFormSchema>;

    const { details, ...rest } = parsed;
    const dataPass: Omit<typeof parsed, "details"> & { details?: string } = { ...rest };

    const { id } = await this.roleService.requireAccount();
    const membership = await this.roleService.canEdit(id, auditId);

    const blobData = await BlobService.addBlob("audit-details", details);
    if (blobData) {
      dataPass.details = blobData.url;
    }

    const currentMembers = await this.auditService.getAuditAuditors(auditId);
    const { requiresUpdate, activate, deactivate, create } = this.ownerService.requiresAuditUpdate(
      membership.audit,
      dataPass,
      auditors,
      currentMembers,
    );

    if (!requiresUpdate) {
      return { success: true, data: true };
    }

    await this.ownerService.updateAudit(auditId, dataPass, activate, deactivate, create);

    if (membership.audit.status === AuditStatusType.ATTESTATION) {
      await this.auditorService.resetAttestations(auditId);
      this.notificationService.createAndBroadcastAction(membership, ActionType.OWNER_EDITED);
    }

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data: true };
  }

  /**
   * Locks the specified audit, changing its status to ATTESTATION and deactivating
   * any memberships that are not verified. This function also creates a
   * notification action for the lock event.
   *
   * @param {string} auditId - The ID of the audit to lock.
   * @returns {Promise<ResponseI<boolean>>} - A promise that resolves to a response object
   * indicating the success or failure of the operation.
   */
  @handleErrors
  async lockAudit(auditId: string): Promise<ResponseI<boolean>> {
    const { id } = await this.roleService.requireAccount();
    const membership = await this.roleService.canLock(id, auditId);

    await this.ownerService.lockAudit(membership.auditId);

    this.notificationService.createAndBroadcastAction(membership, ActionType.OWNER_LOCKED);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data: true };
  }

  /**
   * Opens the specified audit, changing its status to DISCOVERY. This function also
   * resets attestation info and creates a notification action for the open event.
   *
   * @param {string} auditId - The ID of the audit to lock.
   * @returns {Promise<ResponseI<boolean>>} - A promise that resolves to a response object
   * indicating the success or failure of the operation.
   */
  @handleErrors
  async openAudit(auditId: string): Promise<ResponseI<boolean>> {
    const { id } = await this.roleService.requireAccount();
    const membership = await this.roleService.canOpen(id, auditId);

    await this.ownerService.openAudit(auditId);

    this.notificationService.createAndBroadcastAction(membership, ActionType.OWNER_OPENED);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data: true };
  }

  @handleErrors
  async updateRequestors(
    auditId: string,
    auditorsApprove: string[],
    auditorsReject: string[],
  ): Promise<ResponseI<boolean>> {
    const { id } = await this.roleService.requireAccount();
    const membership = await this.roleService.canEdit(id, auditId);

    await this.ownerService.updateAudit(auditId, {}, auditorsApprove, auditorsReject, []);

    if (auditorsApprove.length > 0) {
      this.notificationService.createAndBroadcastAction(membership, ActionType.OWNER_APPROVED);
    }

    revalidatePath(`/audits/view/${auditId}`, "page");

    return {
      success: true,
      data: true,
    };
  }
}

const ownerController = new OwnerController(
  OwnerService,
  BlobService,
  RoleService,
  NotificationService,
  AuditService,
  AuditorService,
);
export default ownerController;
