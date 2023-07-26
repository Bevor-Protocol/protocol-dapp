import AuditDashboard from "@/components/pages/AuditDashboard";
import { mockAuditInfo } from "@/utils/constants";

import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { AuditSection } from "@/components/pages/Audits";
import { Address } from "wagmi";
import { AuditDashI } from "@/utils/types";

const getData = (): AuditDashI => {
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

export default async ({ params }: { params: { slug: string } }): Promise<JSX.Element> => {
  const audit = await getData();
  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <AuditSection>
        <H2>Audit Dashboard {params.slug}</H2>
        <AuditDashboard audit={audit} />
      </AuditSection>
    </Section>
  );
};
