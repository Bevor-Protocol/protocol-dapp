import { Audits } from "@prisma/client";
import AuditService from "./audit.service";
import UserService from "../user/user.service";
import {
  AuditStateI,
  MarkdownAuditsI,
  ValidationResponseI,
  ValidationSuccessI,
} from "@/utils/types";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";
import { revalidatePath } from "next/cache";
import { handleValidationErrorReturn } from "@/utils/error";

/*
Mutations will return a Generic ValidationResponseI type object.

We can't send 4xx/5xx responses in server actions, so we destructure
responses to handle { success: boolean, data: T}, which we can handle client side.

Most mutations will require revalidation of cache.
*/

class AuditController {
  constructor(
    private readonly auditService: typeof AuditService,
    private readonly userService: typeof UserService,
  ) {}

  async getAudit(id: string): Promise<AuditI | null> {
    return this.auditService.getAudit(id);
  }

  async getAuditsDetailed(status?: string): Promise<AuditDetailedI[]> {
    return this.auditService.getAuditsDetailed(status);
  }

  async addAuditInfo(id: string, infoId: string): Promise<ValidationResponseI<Audits>> {
    return this.auditService
      .addAuditInfo(id, infoId)
      .then((data): ValidationSuccessI<Audits> => {
        revalidatePath(`/audits/view/${id}`, "page");
        return { success: true, data };
      })
      .catch((error) => {
        return handleValidationErrorReturn(error);
      });
  }

  async addNftInfo(id: string, nftId: string): Promise<ValidationResponseI<Audits>> {
    return this.auditService
      .addNftInfo(id, nftId)
      .then((data): ValidationSuccessI<Audits> => {
        revalidatePath(`/audits/view/${id}`, "page");
        return { success: true, data };
      })
      .catch((error) => {
        return handleValidationErrorReturn(error);
      });
  }

  async getState(id: string): Promise<AuditStateI> {
    const { user } = await this.userService.currentUser();

    return this.auditService.getAuditState(id, user?.id);
  }

  async safeMarkdown(id: string): Promise<MarkdownAuditsI> {
    const { user } = await this.userService.currentUser();

    return this.auditService.safeMarkdownDisplay(id, user?.id);
  }

  async getAuditFindings(id: string): Promise<AuditFindingsI | null> {
    return this.auditService.getAuditFindings(id);
  }
}

const auditController = new AuditController(AuditService, UserService);
export default auditController;
