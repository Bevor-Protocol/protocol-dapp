import { AuditorStatus, Audits, Prisma, Users } from "@prisma/client";
import { auditFormSchema, parseForm } from "@/utils/validations";
import { RoleError } from "@/utils/error";
import { z } from "zod";
import RoleService from "@/actions/roles/roles.service";
import OwnerService from "./owner.service";
import BlobService from "@/actions/blob/blob.service";

class OwnerController {
  constructor(
    private readonly ownerService: typeof OwnerService,
    private readonly blobService: typeof BlobService,
    private readonly roleService: typeof RoleService,
  ) {}

  async createAudit(id: string, formData: FormData, auditors: Users[]): Promise<Audits> {
    const parsed = parseForm(formData, auditFormSchema) as z.infer<typeof auditFormSchema>;

    const { details, ...rest } = parsed;
    const dataPass: Omit<typeof parsed, "details"> & { details?: string } = {
      ...rest,
    };

    const blobData = await this.blobService.addBlob("audit-details", details);
    if (blobData) {
      dataPass.details = blobData.url;
    }

    return this.ownerService.createAudit(id, dataPass, auditors);
  }

  async updateAudit(id: string, formData: FormData, auditors: Users[]): Promise<Audits> {
    const { audit, allowed } = await this.roleService.canEdit(id);
    if (!allowed) {
      throw new RoleError("you cannot update this audit");
    }

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

    return this.ownerService.updateAudit(id, dataPass, auditorsCreate, auditorsRemove);
  }

  async lockAudit(id: string): Promise<Audits> {
    const { allowed } = await this.roleService.canLock(id);
    if (!allowed) {
      throw new RoleError("you cannot open this audit");
    }

    return this.ownerService.lockAudit(id);
  }

  async openAudit(id: string): Promise<Audits> {
    const { allowed } = await this.roleService.canOpen(id);
    if (!allowed) {
      throw new RoleError("you cannot open this audit");
    }

    return this.ownerService.openAudit(id);
  }

  async updateRequestors(
    id: string,
    auditorsApprove: string[],
    auditorsReject: string[],
  ): Promise<Prisma.BatchPayload[]> {
    const { allowed } = await this.roleService.canEdit(id);
    if (!allowed) {
      throw new RoleError("you cannot edit this audit");
    }

    const promises = [
      this.ownerService.updateRequestors(id, auditorsReject, AuditorStatus.REJECTED),
      this.ownerService.updateRequestors(id, auditorsApprove, AuditorStatus.VERIFIED),
    ];

    return Promise.all(promises);
  }
}

const ownerController = new OwnerController(OwnerService, BlobService, RoleService);
export default ownerController;
