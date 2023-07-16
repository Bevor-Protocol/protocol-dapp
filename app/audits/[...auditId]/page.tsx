import AuditDashboard, { AuditSection } from "@/components/pages/AuditDashboard";
import { audits } from "@/utils/constants";

import { Section } from "@/components/Common";
import { Column } from "@/components/Box";
import { H2 } from "@/components/Text";
import { Address } from "wagmi";

type ArrI = {
  auditor: string;
  auditee: string[];
  money: number;
  description: string;
  status: string;
};

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
  const auditor = audits.filter((audit) => audit.status === "open");
  const auditee = audits.filter((audit) => audit.status === "soon");
  const cliff = audits.filter((audit) => audit.status === "closed");
  const start;
  const duration;
  const slicePeriodSeconds;
  const withdrawlPaused;
  const amountTotal;
  const withdrawn;
  const auditInvalidated;
  const token;
  const tokenId;

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
    tokenId
  };
};

export default async (): Promise<JSX.Element> => {
  const { open, soon, closed } = await getData();
  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <Column $gap="rem2">
        <AuditSection>
          <H2>[Audit Name]</H2>
          <AuditDashboard arr={open} />
        </AuditSection>
      </Column>
    </Section>
  );
};
