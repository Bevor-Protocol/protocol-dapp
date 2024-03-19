import { Column, Row } from "@/components/Box";
import { UserProfile } from "../client";
import {
  getUserProfile,
  getUserAuditsAuditee,
  getUserAuditsAuditor,
  getUserStats,
} from "@/lib/actions/users";
import { AuditCard } from "@/components/pages/Audits/server";
import { H2, P, Span } from "@/components/Text";
import { HR, Loader } from "@/components/Common";
import { Suspense } from "react";

const UserData = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const [auditsAuditee, auditsAuditor, userStats] = await Promise.all([
    getUserAuditsAuditee(address),
    getUserAuditsAuditor(address),
    getUserStats(address),
  ]);

  const auditsAuditeeOpen = auditsAuditee.filter((audit) => audit.terms === null);
  const auditsAuditeePending = auditsAuditee.filter((audit) => !audit.terms);
  const auditsAuditeeClosed = auditsAuditee.filter((audit) => audit.terms);

  const auditsAuditorOpen = auditsAuditor.filter((audit) => audit.terms === null);
  const auditsAuditorPending = auditsAuditor.filter((audit) => !audit.terms);
  const auditsAuditorClosed = auditsAuditor.filter((audit) => audit.terms);

  return (
    <Column $gap="rem1" $align="flex-start">
      <Column $gap="rem1" $align="flex-start">
        <P>
          Potential Payout: <Span>{userStats.moneyPaid}</Span>
        </P>
        <P>
          Potential Earnings: <Span>{userStats.moneyEarned}</Span>
        </P>
      </Column>
      <HR />
      {auditsAuditee.length > 0 && <H2>Audits Created</H2>}
      {auditsAuditeeOpen.length > 0 && (
        <Column $gap="rem1" $align="flex-start">
          <P>Open:</P>
          <Row $width="100%" $justify="flex-start">
            {auditsAuditeeOpen.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} trimWidth={true} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditeeOpen.length > 0 && (
        <Column $gap="rem1" $align="flex-start">
          <P>Pending:</P>
          <Row $width="100%" $justify="flex-start">
            {auditsAuditeePending.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} trimWidth={true} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditeeClosed.length > 0 && (
        <Column $gap="rem1" $align="flex-start">
          <P>Closed:</P>
          <Row $width="100%" $justify="flex-start">
            {auditsAuditeeClosed.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} trimWidth={true} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditor.length > 0 && <H2>Audits Auditing</H2>}
      {auditsAuditorOpen.length > 0 && (
        <Column $gap="rem1" $align="flex-start">
          <P>Open:</P>
          <Row $width="100%" $justify="flex-start">
            {auditsAuditorOpen.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} trimWidth={true} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditorPending.length > 0 && (
        <Column $gap="rem1" $align="flex-start">
          <P>Pending:</P>
          <Row $width="100%" $justify="flex-start">
            {auditsAuditorPending.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} trimWidth={true} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditorClosed.length > 0 && (
        <Column $gap="rem1" $align="flex-start">
          <P>Closed:</P>
          <Row $width="100%" $justify="flex-start">
            {auditsAuditorClosed.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} trimWidth={true} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditee.length + auditsAuditor.length == 0 && <H2>No Active Audits</H2>}
    </Column>
  );
};

export const UserContent = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const user = await getUserProfile(address);

  if (!user) {
    return <h2>This is not a user of Bevor Protocol</h2>;
  }

  return (
    <Column $gap="rem2" $align="flex-start">
      <UserProfile user={user} />
      <HR />
      <Suspense fallback={<Loader $size="50px" />}>
        <UserData address={address} />
      </Suspense>
    </Column>
  );
};
