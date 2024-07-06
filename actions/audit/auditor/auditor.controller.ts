import RoleService from "@/actions/roles/roles.service";
import AuditorService from "./auditor.service";
import { RoleError, ValidationError } from "@/utils/error";
import { Auditors, Audits } from "@prisma/client";
import { auditFindingsSchema, parseForm } from "@/utils/validations";
import { z } from "zod";
import BlobService from "@/actions/blob/blob.service";

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
  ): Promise<Auditors> {
    const { allowed } = await this.roleService.canAttest(id);
    if (!allowed) {
      throw new RoleError("cannot attest to terms");
    }
    return this.auditorService.attestToTerms(id, userId, status, comment);
  }

  async leaveAudit(id: string): Promise<Audits> {
    const { audit, user, allowed } = await this.roleService.canLeave(id);
    if (!allowed) {
      throw new RoleError("you cannot leave this audit");
    }
    return this.auditorService.leaveAudit(audit, user);
  }

  async addFinding(id: string, formData: FormData): Promise<Auditors> {
    const { user, allowed } = await this.roleService.isAuditAuditor(id);
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

    return this.auditorService.addFindings(id, user.id, blobData.url);
  }

  async addRequest(id: string): Promise<Auditors> {
    const { user, allowed } = await this.roleService.canRequest(id);
    if (!allowed) {
      // make sure they are NOT an auditor on the audit, but that they have the auditor role.
      throw new RoleError("cannot add a request to this audit");
    }
    return this.auditorService.addRequest(id, user.id);
  }

  async deleteRequest(id: string): Promise<Auditors> {
    const { user, allowed } = await this.roleService.isAuditAuditor(id);
    if (!allowed) {
      throw new RoleError("cannot delete request");
    }

    return this.auditorService.deleteRequest(id, user.id);
  }
}

const auditorController = new AuditorController(RoleService, AuditorService, BlobService);
export default auditorController;
