import { AuditI } from "@/utils/types/prisma";
import { AuditStatus } from "@prisma/client";
import { contractController } from "@/actions";
import VestingDisplay from "./display";
import { Address } from "viem";
import { AvailableTokens } from "@/constants/web3";

const Vesting = async ({
  audit,
  isAuditor,
  address,
}: {
  audit: AuditI;
  isAuditor: boolean;
  address: string | undefined;
}): Promise<JSX.Element> => {
  if (audit.status !== AuditStatus.CHALLENGEABLE && audit.status !== AuditStatus.FINALIZED) {
    return <></>;
  }

  if (!audit.onchainAuditInfoId) {
    return <></>;
  }

  const auditView = await contractController.getAudit(BigInt(audit.onchainAuditInfoId));

  if (!auditView) {
    return <></>;
  }

  const tokenUse = AvailableTokens.localhost.find((t) => t.address == audit.token);

  let vestingScheduleInfo = {
    vestingScheduleId: null as bigint | null,
    releasable: null as string | null,
    withdrawn: null as string | null,
  };
  if (isAuditor && address) {
    vestingScheduleInfo = await contractController.getAuditorVestingSchedule(
      BigInt(audit.onchainAuditInfoId),
      address as Address,
      audit.token as Address,
    );
  }

  const state = {
    startTime: Number(auditView[5]),
    duration: Number(auditView[3]),
    cliff: Number(auditView[4]),
    tokenSymbol: tokenUse?.symbol,
    ...vestingScheduleInfo,
  };

  return <VestingDisplay initialState={{ ...state }} isAuditor={isAuditor} />;
};

export default Vesting;
