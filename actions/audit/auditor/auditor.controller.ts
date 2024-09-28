import BlobService from "@/actions/blob/blob.service";
import RoleService from "@/actions/roles/roles.service";
import { handleErrors } from "@/utils/decorators";
import { ValidationError } from "@/utils/error";
import { ResponseI } from "@/utils/types";
import { auditFindingsSchema, parseForm } from "@/utils/validations";
import { Auditor, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
  ) {}

  @handleErrors
  async attestToTerms(auditId: string, status: boolean, comment: string): Promise<ResponseI<User>> {
    const user = await this.roleService.requireAuth();
    await this.roleService.canAttest(user, auditId);

    const data = await this.auditorService.attestToTerms(auditId, user.id, status, comment);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async leaveAudit(auditId: string): Promise<ResponseI<User>> {
    const user = await this.roleService.requireAuth();
    const audit = await this.roleService.canLeave(user, auditId);

    const data = await this.auditorService.leaveAudit(audit.id, user.id, audit.status);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async addFinding(auditId: string, formData: FormData): Promise<ResponseI<User>> {
    const user = await this.roleService.requireAuth();
    await this.roleService.isAuditAuditor(user, auditId);

    const parsed = parseForm(formData, auditFindingsSchema) as z.infer<typeof auditFindingsSchema>;

    const blobData = await this.blobService.addBlob("audit-details", parsed);
    if (!blobData) {
      throw new ValidationError({
        image: "no file provided",
      });
    }

    const data = await this.auditorService.addFindings(auditId, user.id, blobData.url);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async addRequest(auditId: string): Promise<ResponseI<Auditor>> {
    const user = await this.roleService.requireAuth();
    await this.roleService.canRequest(user, auditId);

    const data = await this.auditorService.addRequest(auditId, user.id);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async deleteRequest(auditId: string): Promise<ResponseI<Auditor>> {
    const user = await this.roleService.requireAuth();
    await this.roleService.isAuditAuditor(user, auditId);

    const data = await this.auditorService.deleteRequest(auditId, user.id);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }
}

const auditorController = new AuditorController(RoleService, AuditorService, BlobService);
export default auditorController;
