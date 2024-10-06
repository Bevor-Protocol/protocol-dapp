import { handleErrors } from "@/utils/decorators";
import { RoleError } from "@/utils/error";
import { AuditStateI, MarkdownAuditsI, ResponseI } from "@/utils/types";
import { ActionI, AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";
import { ActionType, Audit, AuditStatusType, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import NotificationService from "../notification/notification.service";
import UserService from "../user/user.service";
import AuditService from "./audit.service";

/*
Mutations will return a Generic ResponseI type object.

We can't send 4xx/5xx responses in server actions, so we destructure
responses to handle { success: boolean, data: T}, which we can handle client side.

Most mutations will require revalidation of cache.
*/

class AuditController {
  constructor(
    private readonly auditService: typeof AuditService,
    private readonly userService: typeof UserService,
    private readonly notificationService: typeof NotificationService,
  ) {}

  async getAudit(id: string): Promise<AuditI | null> {
    return this.auditService.getAudit(id);
  }

  async getAuditActions(auditId: string): Promise<ActionI[]> {
    return this.auditService.getAuditActions(auditId);
  }

  async getAuditsDetailed(status?: AuditStatusType): Promise<AuditDetailedI[]> {
    return this.auditService.getAuditsDetailed(status);
  }

  @handleErrors
  async addAuditInfo(auditId: string, infoId: string): Promise<ResponseI<Audit>> {
    const membership = await this.auditService.getAuditOwnerMembership(auditId);
    if (!membership) {
      throw new RoleError();
    }

    const data = await this.auditService.addAuditInfo(auditId, infoId);

    await this.notificationService.createAndBroadcastAction(membership, ActionType.OWNER_FINALIZED);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async addNftInfo(auditId: string, nftId: string): Promise<ResponseI<Audit>> {
    const membership = await this.auditService.getAuditOwnerMembership(auditId);
    if (!membership) {
      throw new RoleError();
    }

    const data = await this.auditService.addNftInfo(auditId, nftId);

    await this.notificationService.createAndBroadcastAction(membership, ActionType.OWNER_REVEALED);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  getState(audit: AuditI, user: User): AuditStateI {
    return this.auditService.getAuditState(audit, user);
  }

  async safeMarkdown(audit: AuditI): Promise<MarkdownAuditsI> {
    const { user } = await this.userService.currentUser();

    return this.auditService.safeMarkdownDisplay(audit, user);
  }

  async getAuditFindings(id: string): Promise<AuditFindingsI | null> {
    return this.auditService.getAuditFindings(id);
  }
}

const auditController = new AuditController(AuditService, UserService, NotificationService);
export default auditController;
