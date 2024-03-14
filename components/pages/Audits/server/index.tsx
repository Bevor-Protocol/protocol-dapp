/* eslint-disable @next/next/no-img-element */
import { P, Span, Strong } from "@/components/Text";
import { Column, Row, Card } from "@/components/Box";
import { Loader } from "@/components/Common";
import { FallbackIcon } from "@/components/Icon";
import DynamicLink, { UnstyledNextLink } from "@/components/Link";
import ProgressBar from "@/components/ProgressBar";
import { Markdown } from "@/components/Markdown";
import { AuditFooter, AuditorWrapper, AuditDescription } from "../styled";
import { AuditAuditor, AuditDashboardBtn, AuditDashboardHeader } from "../client";
import { getAudits, getAudit, getMarkdown } from "@/lib/actions/audits";

export const Audits = async ({ current }: { current: string }): Promise<JSX.Element> => {
  const audits = await getAudits(current);

  return (
    <Column $gap="rem1">
      {audits.length == 0 && <P>Currently no {current} audits</P>}
      {audits.map((audit, ind) => (
        <Card key={ind} $hover $width="100%" $padding="0px">
          <Row $align="stretch" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
            <UnstyledNextLink href={`/user/${audit.auditee.address}`}>
              <FallbackIcon
                image={audit.auditee.profile?.image}
                address={audit.auditee.address}
                size="lg"
              />
            </UnstyledNextLink>
            <Column $justify="flex-start" $align="flex-start">
              <Row $justify="space-between" $width="100%">
                <P>
                  <Strong $large>{audit.title}</Strong>
                </P>
                <div>${audit.terms?.price.toLocaleString() || 0}</div>
              </Row>
              <P>{audit.description}</P>
            </Column>
          </Row>
          <AuditFooter $justify="space-between" $gap="rem2" $padding="0.5rem 1rem" $width="100%">
            <AuditorWrapper>
              <Span $secondary>auditors:</Span>
              {audit.auditors.length > 0 ? (
                audit.auditors.map((auditor, ind2) => (
                  <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={auditor} />
                ))
              ) : (
                <Span>TBD</Span>
              )}
            </AuditorWrapper>
            <DynamicLink href={`/audits/${audit.id}`} disabled={current !== "closed"}>
              <Span>View Audit</Span>
            </DynamicLink>
          </AuditFooter>
        </Card>
      ))}
    </Column>
  );
};

export const AuditDashboard = async ({
  auditId,
  display,
}: {
  auditId: string;
  display: string;
}): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);
  const content = await getMarkdown(display);
  return (
    <Column $gap="md">
      <Card $width="100%" $padding="0px">
        <Row $align="flex-start" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
          <FallbackIcon
            image={audit.auditee.profile?.image}
            address={audit.auditee.address}
            size="lg"
          />
          <Column $justify="flex-start" $align="flex-start">
            <Row $justify="space-between" $width="100%">
              <P>
                <Strong $large>{audit.title}</Strong>
              </P>
              <div>${audit.terms?.price.toLocaleString()}</div>
            </Row>
            <P>{audit.description}</P>
            <P>Months: {audit.terms?.duration}</P>
            <P>Created: {new Date(audit.createdAt).toLocaleDateString()}</P>
          </Column>
        </Row>
        <ProgressBar />
        <AuditDescription $align="flex-start" $gap="lg">
          <AuditDashboardHeader display={display} />
          <Markdown dangerouslySetInnerHTML={{ __html: content }} />
        </AuditDescription>
        <AuditFooter $justify="space-between" $gap="rem2" $padding="0.5rem 1rem" $width="100%">
          <AuditorWrapper>
            <Span>auditors:</Span>
            {audit.auditors.map((auditor, ind: number) => (
              <AuditAuditor position={`-${ind * 12.5}px`} key={ind} auditor={auditor} />
            ))}
          </AuditorWrapper>
          <AuditDashboardBtn auditors={audit.auditors} />
        </AuditFooter>
      </Card>
    </Column>
  );
};

export const AuditsSkeleton = (): JSX.Element => {
  return (
    <Column $padding="4rem">
      <Loader $size="40px" />
    </Column>
  );
};
