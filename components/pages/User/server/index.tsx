import { UserProfileData } from "../client";
import {
  getUserProfile,
  getUserAuditsAuditee,
  getUserAuditsAuditor,
  getUserStats,
} from "@/lib/actions/users";
import { AuditCard } from "@/components/pages/Audits/server";
import { Loader } from "@/components/Loader";
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
    <div className="flex flex-col items-start gap-4 w-full">
      <div className="flex flex-col items-start gap-4">
        <p>
          Potential Payout: <span>{userStats.moneyPaid}</span>
        </p>
        <p>
          Potential Earnings: <span>{userStats.moneyEarned}</span>
        </p>
      </div>
      <hr className="w-full h-[1px] border-gray-200/20" />
      {auditsAuditee.length > 0 && <h2>Audits Created</h2>}
      {auditsAuditeeOpen.length > 0 && (
        <div className="flex flex-col items-start gap-4">
          <p>Open:</p>
          <div className="flex flex-row w-full justify-start">
            {auditsAuditeeOpen.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </div>
        </div>
      )}
      {auditsAuditeeOpen.length > 0 && (
        <div className="flex flex-col items-start gap-4">
          <p>Pending:</p>
          <div className="flex flex-row w-full justify-start">
            {auditsAuditeePending.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </div>
        </div>
      )}
      {auditsAuditeeClosed.length > 0 && (
        <div className="flex flex-col items-start gap-4">
          <p>Pending:</p>
          <div className="flex flex-row w-full justify-start">
            {auditsAuditeeClosed.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </div>
        </div>
      )}
      {auditsAuditor.length > 0 && <h2>Audits Auditing</h2>}
      {auditsAuditorOpen.length > 0 && (
        <div className="flex flex-col items-start gap-4">
          <p>Pending:</p>
          <div className="flex flex-row w-full justify-start">
            {auditsAuditorOpen.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </div>
        </div>
      )}
      {auditsAuditorPending.length > 0 && (
        <div className="flex flex-col items-start gap-4">
          <p>Pending:</p>
          <div className="flex flex-row w-full justify-start">
            {auditsAuditorPending.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </div>
        </div>
      )}
      {auditsAuditorClosed.length > 0 && (
        <div className="flex flex-col items-start gap-4">
          <p>Pending:</p>
          <div className="flex flex-row w-full justify-start">
            {auditsAuditorClosed.map((audit, ind) => (
              <AuditCard key={ind} audit={audit} disabled={false} />
            ))}
          </div>
        </div>
      )}
      {auditsAuditee.length + auditsAuditor.length == 0 && <h2>No Active Audits</h2>}
    </div>
  );
};

export const UserContent = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const user = await getUserProfile(address);

  if (!user) {
    return <h2>This is not a user of Bevor Protocol</h2>;
  }

  return (
    <div className="flex flex-col items-start gap-8 w-full">
      <UserProfileData user={user} />
      <hr className="w-full h-[1px] border-gray-200/20" />
      <Suspense fallback={<Loader className="h-12" />}>
        <UserData address={address} />
      </Suspense>
    </div>
  );
};
