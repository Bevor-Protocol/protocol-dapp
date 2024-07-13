import RoleService from "@/actions/roles/roles.service";
import AuditorService from "./auditor.service";
import { handleValidationErrorReturn, RoleError, ValidationError } from "@/utils/error";
import { Auditors, Audits } from "@prisma/client";
import { auditFindingsSchema, parseForm } from "@/utils/validations";
import { z } from "zod";
import BlobService from "@/actions/blob/blob.service";
import { ValidationResponseI } from "@/utils/types";
import { revalidatePath } from "next/cache";

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

  async attestToTerms(
    id: string,
    userId: string,
    status: boolean,
    comment: string,
  ): Promise<ValidationResponseI<Auditors>> {
    try {
      const { allowed } = await this.roleService.canAttest(id);
      if (!allowed) {
        throw new RoleError("cannot attest to terms");
      }
      const data = await this.auditorService.attestToTerms(id, userId, status, comment);

      revalidatePath(`/audits/view/${id}`, "page");
      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async leaveAudit(id: string): Promise<ValidationResponseI<Audits>> {
    try {
      const { audit, user, allowed } = await this.roleService.canLeave(id);
      if (!allowed) {
        throw new RoleError("you cannot leave this audit");
      }
      const data = await this.auditorService.leaveAudit(audit, user);

      revalidatePath(`/audits/view/${id}`, "page");
      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async addFinding(id: string, formData: FormData): Promise<ValidationResponseI<Auditors>> {
    try {
      const { user, allowed } = await this.roleService.isAuditAuditor(id);
      if (!allowed) {
        throw new RoleError("you cannot add findings to this audit");
      }

      const parsed = parseForm(formData, auditFindingsSchema) as z.infer<
        typeof auditFindingsSchema
      >;

      const blobData = await this.blobService.addBlob("audit-details", parsed);
      if (!blobData) {
        throw new ValidationError("no file provided", {
          image: "no file provided",
        });
      }

      const data = await this.auditorService.addFindings(id, user.id, blobData.url);

      revalidatePath(`/audits/view/${id}`, "page");
      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async addRequest(id: string): Promise<ValidationResponseI<Auditors>> {
    try {
      const { user, allowed } = await this.roleService.canRequest(id);
      if (!allowed) {
        // make sure they are NOT an auditor on the audit, but that they have the auditor role.
        throw new RoleError("cannot add a request to this audit");
      }
      const data = await this.auditorService.addRequest(id, user.id);
      revalidatePath(`/audits/view/${id}`, "page");
      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async deleteRequest(id: string): Promise<ValidationResponseI<Auditors>> {
    try {
      const { user, allowed } = await this.roleService.isAuditAuditor(id);
      if (!allowed) {
        throw new RoleError("cannot delete request");
      }
      const data = await this.auditorService.deleteRequest(id, user.id);
      // throw new RoleError("testing this out");
      revalidatePath(`/audits/view/${id}`, "page");
      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }
}

const auditorController = new AuditorController(RoleService, AuditorService, BlobService);
export default auditorController;
