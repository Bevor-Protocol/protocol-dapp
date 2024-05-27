import { Suspense } from "react";

import AuditPage from "@/components/screens/audits/view";
import AuditMarkdown from "@/components/screens/audits/view/markdown";
import { getAudit } from "@/actions/audits/general";
import { Loader, LoaderFill } from "@/components/Loader";
import AuditHistory from "@/components/screens/audits/view/history";
import { getCurrentUser } from "@/actions/users";
import Vesting from "@/components/screens/audits/view/vesting";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  // Parsed this into 3 separate requests.
  // One is general
  // Two are specific to the user.
  const audit = await getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  const { user } = await getCurrentUser();

  let isMemberOfAudit = false;
  let isAuditorOfAudit = false;
  if (user) {
    if (user.address == audit.auditee.address) {
      isMemberOfAudit = true;
    } else {
      const auditors = audit.auditors.map((auditor) => auditor.user.address);
      if (auditors.includes(user.address)) {
        isMemberOfAudit = true;
        isAuditorOfAudit = true;
      }
    }
  }

  return (
    <div className="w-full max-w-[1000px] py-8 relative">
      <AuditPage audit={audit} user={user} />
      <AuditHistory
        history={audit.history}
        auditId={audit.id}
        address={user?.address}
        displayNotification={isMemberOfAudit}
      />
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
