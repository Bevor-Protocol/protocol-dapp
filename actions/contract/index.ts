"use server";

import { AuditContractView } from "@/utils/types";
import * as ContractService from "./contract.service";
import { Address } from "viem";

export const getBalance = async (address: string): Promise<number> => {
  return await ContractService.getBalance(address);
};

export const getAudit = async (auditId: bigint): Promise<AuditContractView | null> => {
  return await ContractService.getAudit(auditId);
};

export const getAuditorVestingSchedule = async (
  auditId: bigint,
  user: Address,
  token: Address,
): Promise<{
  vestingScheduleId: bigint | null;
  releasable: string | null;
  withdrawn: string | null;
}> => {
  return await ContractService.getAuditorVestingSchedule(auditId, user, token);
};
