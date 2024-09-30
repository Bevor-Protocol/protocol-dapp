import { handleErrors } from "@/utils/decorators";
import { HistoryI, ResponseI } from "@/utils/types";
import { HistoryView, Prisma } from "@prisma/client";
import { revalidateTag } from "next/cache";
import RoleService from "../roles/roles.service";
import HistoryService from "./history.service";

class HistoryController {
  constructor(
    private readonly historyService: typeof HistoryService,
    private readonly roleService: typeof RoleService,
  ) {}

  async getUserHistory(
    address: string,
    filter: Prisma.HistoryViewWhereInput = {},
  ): Promise<Record<string, { meta: string; history: HistoryI[] }>> {
    return this.historyService.getUserHistory(address, filter).then((views) => {
      return views.reduce((prev: Record<string, { meta: string; history: HistoryI[] }>, next) => {
        const { audit, ...rest } = next.history;
        if (!(audit.id in prev)) {
          prev[audit.id] = {
            meta: audit.title,
            history: [],
          };
        }
        prev[audit.id].history = prev[audit.id].history.concat(rest as HistoryI);
        return prev;
      }, {});
    });
  }

  async getUserHistoryAuditUnreadCount(address: string, auditId: string): Promise<number> {
    const data = await this.historyService.getUserHistoryAuditUnreadCount(address, auditId);

    revalidateTag(`HISTORY ${address} ${auditId}`);
    return data;
  }

  async getUserHistoryPerAudit(address: string): Promise<Record<string, boolean>> {
    const data = await this.historyService.getUserHistoryPerAudit(address);

    revalidateTag(`HISTORY ${address}`);
    return data;
  }

  @handleErrors
  async updateUserHistoryById(historyId: string): Promise<ResponseI<HistoryView>> {
    const user = await this.roleService.requireAuth();
    const data = await this.historyService.updateUserHistoryById(user.id, historyId);

    return { success: true, data };
  }

  @handleErrors
  async updateUserHistoryByAuditId(auditId: string): Promise<ResponseI<Prisma.BatchPayload>> {
    const user = await this.roleService.requireAuth();
    const data = await this.historyService.updateUserHistoryByAuditId(user.id, auditId);

    revalidateTag(`HISTORY ${user.address}`);
    revalidateTag(`HISTORY ${user.address} ${auditId}`);
    return { success: true, data };
  }
}

const historyController = new HistoryController(HistoryService, RoleService);
export default historyController;
