import { Suspense } from "react";

import { auditAction, notificationAction, userAction } from "@/actions";
import { Loader, LoaderFill } from "@/components/Loader";
import AuditPage from "@/components/screens/audits/view";
import AuditHistory from "@/components/screens/audits/view/history";
import AuditMarkdown from "@/components/screens/audits/view/markdown";
import Vesting from "@/components/screens/audits/view/vesting";
import { MembershipStatusEnum, RoleTypeEnum } from "@/utils/types/enum";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  // Parsed this into 3 separate requests.
  // One is general
  // Two are specific to the user.
  const audit = await auditAction.getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  const actions = await auditAction.getAuditActions(auditId);

  const { address, user } = await userAction.getCurrentUser();

  let isMemberOfAudit = false;
  let isAuditorOfAudit = false;
  let hasPendingNotifications = false;
  if (user) {
    const isOwner = audit.owner.id === user.id;
    const isAuditor = audit.memberships.some(
      (member) =>
        member.userId === user.id &&
        member.role === RoleTypeEnum.AUDITOR &&
        member.isActive &&
        member.status === MembershipStatusEnum.VERIFIED,
    );

    isMemberOfAudit = isOwner || isAuditor;
    isAuditorOfAudit = isAuditor;

    if (isMemberOfAudit) {
      const pendingNotificationsCount = await notificationAction.getUserHistoryCountByAuditId(
        user.id,
        auditId,
      );
      hasPendingNotifications = pendingNotificationsCount > 0;
    }
  }

  return (
    <div className="w-full max-w-[1000px]">
      <AuditHistory
        auditId={auditId}
        actions={actions}
        hasPendingNotifications={hasPendingNotifications}
      />
      <AuditPage audit={audit} user={user} />
      <Suspense fallback={<Loader className="h-4 w-4" />}>
        <Vesting audit={audit} isAuditor={isAuditorOfAudit} address={address} />
      </Suspense>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <AuditMarkdown audit={audit} userId={user?.id} />
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
