import { AuditorStatus, Audits, Users } from "@prisma/client";
import { auditFormSchema, parseForm } from "@/utils/validations";
import { handleValidationErrorReturn, RoleError } from "@/utils/error";
import { z } from "zod";
import RoleService from "@/actions/roles/roles.service";
import OwnerService from "./owner.service";
import BlobService from "@/actions/blob/blob.service";
import { ValidationResponseI } from "@/utils/types";
import { revalidatePath } from "next/cache";

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

  async createAudit(
    id: string,
    formData: FormData,
    auditors: Users[],
  ): Promise<ValidationResponseI<Audits>> {
    try {
      const parsed = parseForm(formData, auditFormSchema) as z.infer<typeof auditFormSchema>;

      const { details, ...rest } = parsed;
      const dataPass: Omit<typeof parsed, "details"> & { details?: string } = {
        ...rest,
      };

      const blobData = await this.blobService.addBlob("audit-details", details);
      if (blobData) {
        dataPass.details = blobData.url;
      }

      const data = await this.ownerService.createAudit(id, dataPass, auditors);

      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async updateAudit(
    id: string,
    formData: FormData,
    auditors: Users[],
  ): Promise<ValidationResponseI<Audits>> {
    try {
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

      const data = await this.ownerService.updateAudit(
        id,
        dataPass,
        auditorsCreate,
        auditorsRemove,
      );

      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async lockAudit(id: string): Promise<ValidationResponseI<Audits>> {
    try {
      const { allowed } = await this.roleService.canLock(id);
      if (!allowed) {
        throw new RoleError("you cannot open this audit");
      }

      const data = await this.ownerService.lockAudit(id);
      revalidatePath(`/audits/view/${id}`, "page");
      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async openAudit(id: string): Promise<ValidationResponseI<Audits>> {
    try {
      const { allowed } = await this.roleService.canOpen(id);
      if (!allowed) {
        throw new RoleError("you cannot open this audit");
      }

      const data = await this.ownerService.openAudit(id);
      revalidatePath(`/audits/view/${id}`, "page");
      return { success: true, data };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }

  async updateRequestors(
    id: string,
    auditorsApprove: string[],
    auditorsReject: string[],
  ): Promise<ValidationResponseI<{ rejected: number; verified: number }>> {
    try {
      const { allowed } = await this.roleService.canEdit(id);
      if (!allowed) {
        throw new RoleError("you cannot edit this audit");
      }

      const promises = [
        this.ownerService.updateRequestors(id, auditorsReject, AuditorStatus.REJECTED),
        this.ownerService.updateRequestors(id, auditorsApprove, AuditorStatus.VERIFIED),
      ];

      const data = await Promise.all(promises);

      revalidatePath(`/audits/view/${id}`, "page");

      return {
        success: true,
        data: {
          rejected: data[0].count,
          verified: data[1].count,
        },
      };
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  }
}

const ownerController = new OwnerController(OwnerService, BlobService, RoleService);
export default ownerController;
