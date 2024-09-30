import { Suspense } from "react";

import { auditAction, historyAction, userAction } from "@/actions";
import { Loader, LoaderFill } from "@/components/Loader";
import AuditPage from "@/components/screens/audits/view";
import AuditHistory from "@/components/screens/audits/view/history";
import AuditMarkdown from "@/components/screens/audits/view/markdown";
import Vesting from "@/components/screens/audits/view/vesting";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  // Parsed this into 3 separate requests.
  // One is general
  // Two are specific to the user.
  const audit = await auditAction.getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  const { user } = await userAction.currentUser();

  let isMemberOfAudit = false;
  let isAuditorOfAudit = false;
  let hasPendingNotifications = false;
  if (user) {
    if (user.address == audit.auditee.address) {
      isMemberOfAudit = true;
    } else {
      const isAuditor = audit.auditors.some((auditor) => auditor.user.address === user.address);
      if (isAuditor) {
        isMemberOfAudit = true;
        isAuditorOfAudit = true;
      }
    }
  }

  if (isMemberOfAudit && user) {
    const pendingNotificationsCount = await historyAction.getUserHistoryAuditUnreadCount(
      user.address,
      auditId,
    );
    hasPendingNotifications = pendingNotificationsCount > 0;
  }

  return (
    <div className="w-full max-w-[1000px]">
      <AuditHistory
        auditId={auditId}
        history={audit.history}
        hasPendingNotifications={hasPendingNotifications}
      />
      <AuditPage audit={audit} user={user} />
      <Suspense fallback={<Loader className="h-4 w-4" />}>
        <Vesting audit={audit} isAuditor={isAuditorOfAudit} address={user?.address} />
      </Suspense>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <AuditMarkdown auditId={audit.id} user={user} />
    </div>
  );
};

const AuditDashboardPage = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<LoaderFill />}>
        <Fetcher auditId={params.slug} />
      </Suspense>
    </section>
  );
};

export default AuditDashboardPage;
