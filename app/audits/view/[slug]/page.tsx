import { Suspense } from "react";

import AuditPage from "@/components/screens/audits/view";
import AuditMarkdown from "@/components/screens/audits/view/markdown";
import { getAudit } from "@/actions/audits/general";
import { MarkdownAuditsI } from "@/lib/types";
import { LoaderFill } from "@/components/Loader";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  // Parsed this into 3 separate requests.
  // One is general
  // Two are specific to the user.
  const audit = await getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  const markdownObject: MarkdownAuditsI = {
    details: "",
    findings: {},
  };

  // will likely push this client side to be dependent on userId.
  // if (audit.details) {
  //   markdownObject.details = await getMarkdown(audit.details);
  // }

  // if (audit.status === AuditStatus.CHALLENGEABLE || audit.status === AuditStatus.FINALIZED) {
  //   for (const auditor of audit.auditors) {
  //     if (auditor.status === AuditorStatus.VERIFIED && "findings" in auditor) {
  //       const user = auditor.user;
  //       let markdown = "";
  //       if (auditor.findings) {
  //         markdown = await getMarkdown(auditor.findings);
  //       }
  //       markdownObject.findings[auditor.user.address] = {
  //         user,
  //         markdown,
  //       };
  //     }
  //   }
  // }
  return (
    <div className="w-full max-w-[1000px] py-8">
      <AuditPage audit={audit} />
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <AuditMarkdown
        markdownObject={markdownObject}
        // showFindings={
        //   audit.status === AuditStatus.CHALLENGEABLE || audit.status === AuditStatus.FINALIZED
        // }
        showFindings={false}
      />
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
