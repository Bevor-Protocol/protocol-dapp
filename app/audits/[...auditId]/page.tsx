import AuditDashboard, { AuditSection } from "@/components/pages/AuditDashboard";
import { mockAuditInfo } from "@/utils/constants";

import { Section } from "@/components/Common";
import { Column } from "@/components/Box";
import { H2 } from "@/components/Text";
import { Address } from "wagmi";

type PropsI = {
  // beneficiary of tokens after they are released
  auditor: Address;
  // beneficiary of tokens after they are released
  auditee: Address;
  // cliff period in seconds
  cliff: number;
  // start time of the vesting period
  start: number;
  // duration of the vesting period in seconds
  duration: number;
  // duration of a slice period for the vesting in seconds
  slicePeriodSeconds: number;
  // whether the vesting is revocable
  withdrawlPaused: boolean;
  // total amount of tokens to be released at the end of the vesting
  amountTotal: number;
  // amount of tokens withdrawn
  withdrawn: number;
  // amount of tokens in escrow for payment
  auditInvalidated: boolean;
  // address of the ERC20 token vesting
  token: Address;
  // address of the ERC721 audit NFT
  tokenId: number;
};

const getData = (): PropsI => {
  const auditor = mockAuditInfo.auditors[0] as Address;
  const auditee = mockAuditInfo.auditee as Address;
  const cliff = mockAuditInfo.cliff;
  const start = mockAuditInfo.start;
  const duration = mockAuditInfo.duration;
  const slicePeriodSeconds = mockAuditInfo.slicePeriodSeconds;
  const withdrawlPaused = mockAuditInfo.withdrawlPaused;
  const amountTotal = mockAuditInfo.amountTotal;
  const withdrawn = mockAuditInfo.withdrawn;
  const auditInvalidated = mockAuditInfo.auditInvalidated;
  const token = mockAuditInfo.token as Address;
  const tokenId = mockAuditInfo.tokenId;

  return {
    auditor,
    auditee,
    cliff,
    start,
    duration,
    slicePeriodSeconds,
    withdrawlPaused,
    amountTotal,
    withdrawn,
    auditInvalidated,
    token,
    tokenId,
  };
};

export default async (): Promise<JSX.Element> => {
  const audit = await getData();
  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <AuditSection>
        <H2>[Audit Name]</H2>
        <AuditDashboard audit={audit} />
      </AuditSection>
    </Section>
  );
};
