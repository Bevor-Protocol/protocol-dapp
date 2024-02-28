/* eslint-disable @next/next/no-img-element */
import { P, Span, Strong } from "@/components/Text";
import { Column, Row, Card } from "@/components/Box";
import { Loader } from "@/components/Common";
import { Avatar, Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { AuditFooter, AuditorWrapper } from "../styled";
import { AuditAuditor } from "../client";
import { getAudits } from "@/lib/actions/audits";

export const Audits = async ({ current }: { current: string }): Promise<JSX.Element> => {
  const audits = await getAudits(current);

  return (
    <Column $gap="rem1">
      {audits.length == 0 && <P>Currently no {current} audits</P>}
      {audits.map((audit, ind) => (
        <Card key={ind} $hover $width="100%" $padding="0px">
          <Row $align="stretch" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
            {audit.auditee.profile?.image ? (
              <Icon $size="lg">
                <img src={audit.auditee.profile.image} alt="user icon" />
              </Icon>
            ) : (
              <Avatar $size="lg" $seed={audit.auditee.address.replace(/\s/g, "")} />
            )}
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

export const AuditsSkeleton = (): JSX.Element => {
  return (
    <Column $padding="4rem">
      <Loader $size="40px" />
    </Column>
  );
};
