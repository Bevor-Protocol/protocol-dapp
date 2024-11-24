import { handleErrors } from "@/utils/decorators";
import { RoleError } from "@/utils/error";
import { ResponseI } from "@/utils/types/api";
import { AuditState, MarkdownAudits } from "@/utils/types/custom";
import { ActionEnum, AuditStatusEnum } from "@/utils/types/enum";
import {
  ActionWithMembership,
  AuditWithOwnerSecure,
  AuditWithUsersInsecure,
} from "@/utils/types/relations";
import { AuditInsert, User } from "@/utils/types/tables";
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

  async getAudit(id: string): Promise<AuditWithOwnerSecure | undefined> {
    return this.auditService.getAudit(id);
  }

  async getAuditActions(auditId: string): Promise<ActionWithMembership[]> {
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

    return { success: true, data };
  }

  getState(auditId: string, user: User): Promise<AuditState> {
    return this.auditService.getAuditState(auditId, user);
  }

  async safeMarkdown(auditId: string): Promise<MarkdownAudits> {
    const { address } = await this.authService.currentUser();
    const user = await this.userService.getProfile(address);

    return this.auditService.safeMarkdownDisplay(auditId, user);
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
