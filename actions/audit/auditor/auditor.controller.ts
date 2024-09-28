import BlobService from "@/actions/blob/blob.service";
import RoleService from "@/actions/roles/roles.service";
import { handleErrors } from "@/utils/decorators";
import { RoleError, ValidationError } from "@/utils/error";
import { ValidationResponseI } from "@/utils/types";
import { auditFindingsSchema, parseForm } from "@/utils/validations";
import { Auditors, Audits } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import AuditorService from "./auditor.service";

/*
Mutations will return a Generic ValidationResponseI type object.

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
  async attestToTerms(
    auditId: string,
    status: boolean,
    comment: string,
  ): Promise<ValidationResponseI<Auditors>> {
    const user = await this.roleService.requireAuth();
    const { allowed } = await this.roleService.canAttest(user, auditId);
    if (!allowed) {
      throw new RoleError("cannot attest to terms");
    }
    const data = await this.auditorService.attestToTerms(auditId, user.id, status, comment);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async leaveAudit(auditId: string): Promise<ValidationResponseI<Audits>> {
    const user = await this.roleService.requireAuth();
    const { audit, allowed } = await this.roleService.canLeave(user, auditId);
    if (!allowed) {
      throw new RoleError("you cannot leave this audit");
    }
    const data = await this.auditorService.leaveAudit(audit, user);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async addFinding(auditId: string, formData: FormData): Promise<ValidationResponseI<Auditors>> {
    const user = await this.roleService.requireAuth();
    const { allowed } = await this.roleService.isAuditAuditor(user, auditId);
    if (!allowed) {
      throw new RoleError("you cannot add findings to this audit");
    }

    const parsed = parseForm(formData, auditFindingsSchema) as z.infer<typeof auditFindingsSchema>;

    const blobData = await this.blobService.addBlob("audit-details", parsed);
    if (!blobData) {
      throw new ValidationError("no file provided", {
        image: "no file provided",
      });
    }

    const data = await this.auditorService.addFindings(auditId, user.id, blobData.url);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async addRequest(auditId: string): Promise<ValidationResponseI<Auditors>> {
    const user = await this.roleService.requireAuth();
    const { allowed } = await this.roleService.canRequest(user, auditId);
    if (!allowed) {
      // make sure they are NOT an auditor on the audit, but that they have the auditor role.
      throw new RoleError("cannot add a request to this audit");
    }
    const data = await this.auditorService.addRequest(auditId, user.id);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async deleteRequest(auditId: string): Promise<ValidationResponseI<Auditors>> {
    const user = await this.roleService.requireAuth();
    const { allowed } = await this.roleService.isAuditAuditor(user, auditId);
    if (!allowed) {
      throw new RoleError("cannot delete request");
    }
    const data = await this.auditorService.deleteRequest(auditId, user.id);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }
}

const auditorController = new AuditorController(RoleService, AuditorService, BlobService);
export default auditorController;
