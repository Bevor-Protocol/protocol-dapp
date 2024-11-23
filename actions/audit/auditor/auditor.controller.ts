import BlobService from "@/actions/blob/blob.service";
import NotificationService from "@/actions/notification/notification.service";
import RoleService from "@/actions/roles/roles.service";
import { handleErrors } from "@/utils/decorators";
import { ValidationError } from "@/utils/error";
import { ResponseI } from "@/utils/types/api";
import { ActionEnum, AuditStatusEnum } from "@/utils/types/enum";
import { AuditMembershipInsert } from "@/utils/types/tables";
import { auditFindingsSchema, parseForm } from "@/utils/validations";
import { z } from "zod";
import AuditorService from "./auditor.service";

/*
Mutations will return a Generic ResponseI type object.

We can't send 4xx/5xx responses in server actions, so we destructure
responses to handle { success: boolean, data: T}, which we can handle client side.

Most mutations will require revalidation of cache.
*/

class AuditorController {
  constructor(
    private readonly roleService: typeof RoleService,
    private readonly auditorService: typeof AuditorService,
    private readonly blobService: typeof BlobService,
    private readonly notificationService: typeof NotificationService,
  ) {}

  @handleErrors
  async attestToTerms(
    auditId: string,
    status: boolean,
    comment: string,
  ): Promise<ResponseI<AuditMembershipInsert>> {
    const { id } = await this.roleService.requireAccount();
    const membership = await this.roleService.canAttest(id, auditId);

    const data = await this.auditorService.attestToTerms(membership.id, status);

    this.notificationService.createAndBroadcastAction(
      membership,
      status ? ActionEnum.AUDITOR_TERMS_APPROVED : ActionEnum.AUDITOR_TERMS_REJECTED,
      comment,
    );

    return { success: true, data };
  }

  @handleErrors
  async leaveAudit(auditId: string): Promise<ResponseI<AuditMembershipInsert>> {
    const { id } = await this.roleService.requireAccount();
    const membership = await this.roleService.canLeave(id, auditId);

    const data = await this.auditorService.leaveAudit(membership.id);

    if (membership.audit.status === AuditStatusEnum.AUDITING) {
      await this.auditorService.resetAttestations(membership.audit_id);
      this.notificationService.createAndBroadcastAction(membership, ActionEnum.AUDITOR_LEFT);
    }

    return { success: true, data };
  }

  @handleErrors
  async addFinding(auditId: string, formData: FormData): Promise<ResponseI<AuditMembershipInsert>> {
    const { id } = await this.roleService.requireAccount();
    const membership = await this.roleService.canAddFindings(id, auditId);

    const parsed = parseForm(formData, auditFindingsSchema) as z.infer<typeof auditFindingsSchema>;

    const blobData = await this.blobService.addBlob("audit-details", parsed);
    if (!blobData) {
      throw new ValidationError({
        image: "no file provided",
      });
    }

    const data = await this.auditorService.addFindings(membership.id, blobData!.url);

    this.notificationService.createAndBroadcastAction(membership, ActionEnum.AUDITOR_FINDINGS);

    return { success: true, data };
  }

  @handleErrors
  async addRequest(auditId: string): Promise<ResponseI<AuditMembershipInsert>> {
    const { id } = await this.roleService.requireAccount();
    await this.roleService.canRequest(id, auditId);

    const data = await this.auditorService.addRequest(auditId, id);

    return { success: true, data };
  }
}

const auditorController = new AuditorController(
  RoleService,
  AuditorService,
  BlobService,
  NotificationService,
);
export default auditorController;
