import { AuditI } from "@/lib/types";
import { AuditStatus } from "@prisma/client";
import { getAudit, getAuditorVestingSchedule } from "@/actions/contractRead";
import VestingDisplay from "./display";
import { Address } from "viem";

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

  const auditView = await getAudit(BigInt(audit.onchainAuditInfoId));

  if (!auditView) {
    return <></>;
  }

  let vestingScheduleInfo = {
    vestingScheduleId: null as bigint | null,
    releasable: null as string | null,
    withdrawn: null as string | null,
  };
  if (isAuditor && address) {
    vestingScheduleInfo = await getAuditorVestingSchedule(
      BigInt(audit.onchainAuditInfoId),
      address as Address,
    );
  }

  const state = {
    startTime: Number(auditView[5]),
    duration: Number(auditView[3]),
    cliff: Number(auditView[4]),
    ...vestingScheduleInfo,
  };

  return <VestingDisplay initialState={{ ...state }} isAuditor={isAuditor} />;
};

export default Vesting;
