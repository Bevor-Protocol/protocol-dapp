import { AuditContractView } from "@/utils/types";
import ContractService from "./contract.service";
import { Address } from "viem";

class ContractController {
  constructor(private readonly contractService: typeof ContractService) {}

  async getBalance(address: string): Promise<number> {
    return ContractService.getBalance(address);
  }

  async getAudit(auditId: bigint): Promise<AuditContractView | null> {
    return ContractService.getAudit(auditId);
  }

  async getAuditorVestingSchedule(
    auditId: bigint,
    user: Address,
    token: Address,
  ): Promise<{
    vestingScheduleId: bigint | null;
    releasable: string | null;
    withdrawn: string | null;
  }> {
    return ContractService.getAuditorVestingSchedule(auditId, user, token);
  }
}

const contractController = new ContractController(ContractService);
export default contractController;
