import { handleErrors } from "@/utils/decorators";
import { AuditStateI, MarkdownAuditsI, ResponseI } from "@/utils/types";
import { AuditDetailedI, AuditFindingsI, AuditI } from "@/utils/types/prisma";
import { Audit, AuditStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
  ) {}

  async getAudit(id: string): Promise<AuditI | null> {
    return this.auditService.getAudit(id);
  }

  async getAuditsDetailed(status?: AuditStatus): Promise<AuditDetailedI[]> {
    return this.auditService.getAuditsDetailed(status);
  }

  @handleErrors
  async addAuditInfo(id: string, infoId: string): Promise<ResponseI<Audit>> {
    const data = await this.auditService.addAuditInfo(id, infoId);

    revalidatePath(`/audits/view/${id}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async addNftInfo(id: string, nftId: string): Promise<ResponseI<Audit>> {
    const data = await this.auditService.addNftInfo(id, nftId);

    revalidatePath(`/audits/view/${id}`, "page");
    return { success: true, data };
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
