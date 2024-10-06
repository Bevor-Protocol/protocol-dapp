import { AuditContractStructuredI } from "@/utils/types/contracts";
import { Address } from "viem";
import ContractService from "./contract.service";

class ContractController {
  constructor(private readonly contractService: typeof ContractService) {}

  async getBalance(address: string): Promise<number> {
    return this.contractService.getBalance(address);
  }

  async getAudit(auditId: bigint): Promise<AuditContractStructuredI | null> {
    return this.contractService.getAudit(auditId);
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
    return this.contractService.getAuditorVestingSchedule(auditId, user, token);
  }
}

const contractController = new ContractController(ContractService);
export default contractController;
