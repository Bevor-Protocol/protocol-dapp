import { Audits } from "@prisma/client";
import AuditService from "./audit.service";
import UserService from "../user/user.service";
import { AuditStateI, MarkdownAuditsI } from "@/utils/types";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";

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

  async addAuditInfo(id: string, infoId: string): Promise<Audits> {
    return this.auditService.addAuditInfo(id, infoId);
  }

  async addNftInfo(id: string, nftId: string): Promise<Audits> {
    return this.auditService.addNftInfo(id, nftId);
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
