import { handleErrors } from "@/utils/decorators";
import { RoleError } from "@/utils/error";
import { AuditStateI, MarkdownAuditsI, ResponseI } from "@/utils/types";
import { ActionEnum, AuditStatusEnum } from "@/utils/types/enum";
import {
  AuditWithOwnerInsecure,
  AuditWithOwnerSecure,
  AuditWithUsersInsecure,
  AuditWithUsersSecure,
} from "@/utils/types/relations";
import { AuditInsert, User } from "@/utils/types/tables";
import { revalidatePath } from "next/cache";
import AuthService from "../auth/auth.service";
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
    private readonly authService: typeof AuthService,
  ) {}

  async getAudit(id: string): Promise<AuditWithUsersSecure | undefined> {
    return this.auditService.getAudit(id);
  }

  async getAuditActions(auditId: string): Promise<AuditWithUsersSecure[]> {
    return this.auditService.getAuditActions(auditId);
  }

  async getAuditsDetailed(status?: AuditStatusEnum): Promise<AuditWithOwnerSecure[]> {
    return this.auditService.getAuditsDetailed(status);
  }

  @handleErrors
  async addAuditInfo(auditId: string, infoId: string): Promise<ResponseI<AuditInsert>> {
    const membership = await this.auditService.getAuditOwnerMembership(auditId);
    if (!membership) {
      throw new RoleError();
    }

    const data = await this.auditService.addAuditInfo(auditId, infoId);

    await this.notificationService.createAndBroadcastAction(membership, ActionEnum.OWNER_FINALIZED);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async addNftInfo(auditId: string, nftId: string): Promise<ResponseI<AuditInsert>> {
    const membership = await this.auditService.getAuditOwnerMembership(auditId);
    if (!membership) {
      throw new RoleError();
    }

    const data = await this.auditService.addNftInfo(auditId, nftId);

    await this.notificationService.createAndBroadcastAction(membership, ActionEnum.OWNER_REVEALED);

    revalidatePath(`/audits/view/${auditId}`, "page");
    return { success: true, data };
  }

  getState(audit: AuditWithOwnerInsecure, user: User): AuditStateI {
    return this.auditService.getAuditState(audit, user);
  }

  async safeMarkdown(audit: AuditWithOwnerInsecure): Promise<MarkdownAuditsI> {
    const { address } = await this.authService.currentUser();
    const user = await this.userService.getProfile(address);

    return this.auditService.safeMarkdownDisplay(audit, user);
  }

  async getAuditFindings(id: string): Promise<AuditWithUsersInsecure | undefined> {
    return this.auditService.getAuditFindings(id);
  }
}

const auditController = new AuditController(
  AuditService,
  UserService,
  NotificationService,
  AuthService,
);
export default auditController;
