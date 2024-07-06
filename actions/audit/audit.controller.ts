import { Audits } from "@prisma/client";
import AuditService from "./audit.service";
import UserService from "../user/user.service";
import OwnerController from "./owner/owner.controller";
import AuditorController from "./auditor/auditor.controller";
import {
  AuditStateI,
  MarkdownAuditsI,
  ValidationResponseI,
  ValidationSuccessI,
} from "@/utils/types";
import { revalidatePath } from "next/cache";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";
import { handleValidationErrorReturn } from "@/utils/error";

class AuditController {
  auditor: typeof AuditorController;

  owner: typeof OwnerController;

  constructor(
    private readonly auditService: typeof AuditService,
    private readonly userService: typeof UserService,
  ) {
    this.auditor = AuditorController;
    this.owner = OwnerController;
  }

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
        revalidatePath(`/audits/view/${id}`);
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
        revalidatePath(`/audits/view/${id}`);
        return { success: true, data };
      })
      .catch((error) => {
        return handleValidationErrorReturn(error);
      });
  }

  async getState(id: string): Promise<AuditStateI> {
    const { user } = await this.userService.currentUser();

    return AuditService.getAuditState(id, user?.id);
  }

  async safeMarkdown(id: string): Promise<MarkdownAuditsI> {
    const { user } = await this.userService.currentUser();

    return AuditService.safeMarkdownDisplay(id, user?.id);
  }

  async getAuditFindings(id: string): Promise<AuditFindingsI | null> {
    return AuditService.getAuditFindings(id);
  }
}

const auditController = new AuditController(AuditService, UserService);
export default auditController;
