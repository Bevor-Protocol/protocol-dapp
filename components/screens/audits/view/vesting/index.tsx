import { contractAction } from "@/actions";
import { AvailableTokens } from "@/constants/web3";
import { AuditStatusEnum } from "@/utils/types/enum";
import { AuditI } from "@/utils/types/prisma";
import { Address } from "viem";
import VestingDisplay from "./display";

const Vesting = async ({
  audit,
  isAuditor,
  address,
}: {
  audit: AuditI;
  isAuditor: boolean;
  address: string | undefined;
}): Promise<JSX.Element> => {
  if (
    audit.status !== AuditStatusEnum.CHALLENGEABLE &&
    audit.status !== AuditStatusEnum.FINALIZED
  ) {
    return <></>;
  }

  if (!audit.onchainAuditInfoId) {
    return <></>;
  }

  const auditView = await contractAction.getAudit(BigInt(audit.onchainAuditInfoId));

  if (!auditView) {
    return <></>;
  }

  const tokenUse = AvailableTokens.Localhost.find((t) => t.address == audit.token);

  let vestingScheduleInfo = {
    vestingScheduleId: null as bigint | null,
    releasable: null as string | null,
    withdrawn: null as string | null,
  };
  if (isAuditor && address) {
    vestingScheduleInfo = await contractAction.getAuditorVestingSchedule(
      BigInt(audit.onchainAuditInfoId),
      address as Address,
      audit.token as Address,
    );
  }

  const state = {
    startTime: Number(auditView.start),
    duration: Number(auditView.duration),
    cliff: Number(auditView.cliff),
    tokenSymbol: tokenUse?.symbol,
    ...vestingScheduleInfo,
  };

  return <VestingDisplay initialState={{ ...state }} isAuditor={isAuditor} />;
};

export default Vesting;
