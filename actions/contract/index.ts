"use server";

import { AuditContractView } from "@/utils/types";
import { Address } from "viem";

import contractController from "./contract.controller";

const getBalance = async (address: string): Promise<number> => {
  return contractController.getBalance(address);
};

const getAudit = async (auditId: bigint): Promise<AuditContractView | null> => {
  return contractController.getAudit(auditId);
};

const getAuditorVestingSchedule = async (
  auditId: bigint,
  user: Address,
  token: Address,
): Promise<{
  vestingScheduleId: bigint | null;
  releasable: string | null;
  withdrawn: string | null;
}> => {
  return contractController.getAuditorVestingSchedule(auditId, user, token);
};

export { getBalance, getAudit, getAuditorVestingSchedule };
