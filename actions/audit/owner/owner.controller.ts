import BlobService from "@/actions/blob/blob.service";
import RoleService from "@/actions/roles/roles.service";
import { handleErrors } from "@/utils/decorators";
import { ValidationResponseI } from "@/utils/types";
import { auditFormSchema, parseForm } from "@/utils/validations";
import { Audit, AuditorStatus, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import OwnerService from "./owner.service";

/*
Mutations will return a Generic ValidationResponseI type object.

We can't send 4xx/5xx responses in server actions, so we destructure
responses to handle { success: boolean, data: T}, which we can handle client side.

Most mutations will require revalidation of cache.
*/

class OwnerController {
  constructor(
    private readonly ownerService: typeof OwnerService,
    private readonly blobService: typeof BlobService,
    private readonly roleService: typeof RoleService,
  ) {}

  @handleErrors
  async createAudit(formData: FormData, auditors: User[]): Promise<ValidationResponseI<Audit>> {
    const user = await this.roleService.requireAuth();
    const parsed = parseForm(formData, auditFormSchema) as z.infer<typeof auditFormSchema>;

    const { details, ...rest } = parsed;
    const dataPass: Omit<typeof parsed, "details"> & { details?: string } = {
      ...rest,
    };

    const blobData = await this.blobService.addBlob("audit-details", details);
    if (blobData) {
      dataPass.details = blobData.url;
    }

    const data = await this.ownerService.createAudit(user.id, dataPass, auditors);

    return { success: true, data };
  }

  @handleErrors
  async updateAudit(
    auditId: string,
    formData: FormData,
    auditors: User[],
  ): Promise<ValidationResponseI<Audit>> {
    const user = await this.roleService.requireAuth();
    const audit = await this.roleService.canEdit(user, auditId);

    const parsed = parseForm(formData, auditFormSchema) as z.infer<typeof auditFormSchema>;

    const { details, ...rest } = parsed;
    const dataPass: Omit<typeof parsed, "details"> & { details?: string } = { ...rest };

    const blobData = await BlobService.addBlob("audit-details", details);
    if (blobData) {
      dataPass.details = blobData.url;
    }

    const currentAuditors = audit!.auditors.map((auditor) => auditor.user.id);
    const passedAuditors = auditors.map((auditor) => auditor.id);

    const auditorsCreate = passedAuditors.filter((auditor) => !currentAuditors.includes(auditor));
    const auditorsRemove = currentAuditors.filter((auditor) => !passedAuditors.includes(auditor));

    const data = await this.ownerService.updateAudit(
      user.id,
      auditId,
      dataPass,
      auditorsCreate,
      auditorsRemove,
    );

    return { success: true, data };
  }

  @handleErrors
  async lockAudit(auditId: string): Promise<ValidationResponseI<Audit>> {
    const user = await this.roleService.requireAuth();
    await this.roleService.canLock(user, auditId);

    const data = await this.ownerService.lockAudit(user.id, auditId);
    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async openAudit(auditId: string): Promise<ValidationResponseI<Audit>> {
    const user = await this.roleService.requireAuth();
    await this.roleService.canOpen(user, auditId);

    const data = await this.ownerService.openAudit(user.id, auditId);
    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async updateRequestors(
    auditId: string,
    auditorsApprove: string[],
    auditorsReject: string[],
  ): Promise<ValidationResponseI<{ rejected: number; verified: number }>> {
    const user = await this.roleService.requireAuth();
    await this.roleService.canEdit(user, auditId);

    const promises = [
      this.ownerService.updateRequestors(auditId, auditorsReject, AuditorStatus.REJECTED),
      this.ownerService.updateRequestors(auditId, auditorsApprove, AuditorStatus.VERIFIED),
    ];

    const data = await Promise.all(promises);

    revalidatePath(`/audits/view/${auditId}`, "page");

    return {
      success: true,
      data: {
        rejected: data[0].count,
        verified: data[1].count,
      },
    };
  }
}

const ownerController = new OwnerController(OwnerService, BlobService, RoleService);
export default ownerController;
