import { UserProfileData, UserOnboard } from "../client";
import {
  getUserProfile,
  getUserAuditsAuditee,
  getUserAuditsAuditor,
  getUserStats,
} from "@/lib/actions/users";
import { AuditCard } from "@/components/pages/Audits/server";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { Column, Row } from "@/components/Box";

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
    <Column className="items-start gap-4 w-full">
      <Column className="items-start gap-4">
        <p>
          Potential Payout: <span>{userStats.moneyPaid}</span>
        </p>
        <p>
          Potential Earnings: <span>{userStats.moneyEarned}</span>
        </p>
      </Column>
      <hr className="w-full h-[1px] border-gray-200/20" />
      {auditsAuditee.length > 0 && <h2>Audits Created</h2>}
      {auditsAuditeeOpen.length > 0 && (
        <Column className="items-start gap-4">
          <p>Open:</p>
          <Row className="w-full justify-start">
            {auditsAuditeeOpen.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditeeOpen.length > 0 && (
        <Column className="items-start gap-4">
          <p>Pending:</p>
          <Row className="w-full justify-start">
            {auditsAuditeePending.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditeeClosed.length > 0 && (
        <Column className="items-start gap-4">
          <p>Pending:</p>
          <Row className="w-full justify-start">
            {auditsAuditeeClosed.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditor.length > 0 && <h2>Audits Auditing</h2>}
      {auditsAuditorOpen.length > 0 && (
        <Column className="items-start gap-4">
          <p>Pending:</p>
          <Row className="w-full justify-start">
            {auditsAuditorOpen.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditorPending.length > 0 && (
        <Column className="items-start gap-4">
          <p>Pending:</p>
          <Row className="w-full justify-start">
            {auditsAuditorPending.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditorClosed.length > 0 && (
        <Column className="items-start gap-4">
          <p>Pending:</p>
          <Row className="w-full justify-start">
            {auditsAuditorClosed.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </Row>
        </Column>
      )}
      {auditsAuditee.length + auditsAuditor.length == 0 && <h2>No Active Audits</h2>}
    </Column>
  );
};

export const UserContent = async ({ address }: { address: string }): Promise<JSX.Element> => {
  /* 
  User does not exist:
    If not connected:
      Display that this isn't a user of Bevor
    If connected:
      If address == connected address:
        Allow for onboarding flow
      Else:
        Display that this isn't a user of Bevor
  Else:
    Show user profile. If owner, allow for edit.
  */
  const user = await getUserProfile(address);

  if (!user) {
    return <UserOnboard address={address} />;
  }

  return (
    <Column className="items-start gap-8 w-full">
      <UserProfileData user={user} />
      <hr className="w-full h-[1px] border-gray-200/20" />
      <Suspense fallback={<Loader className="h-12" />}>
        <UserData address={address} />
      </Suspense>
    </Column>
  );
};
