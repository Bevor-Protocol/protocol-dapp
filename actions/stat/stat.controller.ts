import { UserStats } from "@/utils/types";
import StatService from "./stat.service";

class StatController {
  constructor(private readonly statService: typeof StatService) {}

  async getUserStats(address: string): Promise<UserStats> {
    const [moneyPaid, moneyEarned, numAuditsCreated, numAuditsAudited, numWishlist] =
      await Promise.all([
        StatService.getUserMoneyPaid(address),
        StatService.getUserMoneyEarned(address),
        StatService.getUserNumAuditsOwner(address),
        StatService.getUserNumAuditsAuditor(address),
        StatService.getUserNumWishlistReciever(address),
      ]);

    return {
      moneyPaid,
      moneyEarned,
      numAuditsCreated,
      numAuditsAudited,
      numWishlist,
    };
  }

  async getProtocolNumAudits(): Promise<number> {
    return StatService.getProtocolNumAudits();
  }

  async getProtocolFunds(): Promise<number> {
    return StatService.getProtocolDataFunds();
  }

  async getProtocolVulnerabilities(): Promise<number> {
    return StatService.getProtocolDataVulnerabilities();
  }

  async getProtocolNumAuditors(): Promise<number> {
    return StatService.getProtocolDataAuditors();
  }
}

const statController = new StatController(StatService);
export default statController;
