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
    return this.statService.getProtocolNumAudits().catch((error) => {
      console.log(error);
      return 0;
    });
  }

  async getProtocolFunds(): Promise<number> {
    return this.statService.getProtocolDataFunds().catch((error) => {
      console.log(error);
      return 0;
    });
  }

  async getProtocolVulnerabilities(): Promise<number> {
    return this.statService.getProtocolDataVulnerabilities().catch((error) => {
      console.log(error);
      return 0;
    });
  }

  async getProtocolNumAuditors(): Promise<number> {
    return this.statService.getProtocolDataAuditors().catch((error) => {
      console.log(error);
      return 0;
    });
  }
}

const statController = new StatController(StatService);
export default statController;
