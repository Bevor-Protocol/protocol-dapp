import { Suspense } from "react";

import { LoaderFill } from "@/components/Loader";
import AuditEditWrapper from "@/components/screens/audits/edit";
import { getAudit } from "@/actions/audits";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  return <AuditEditWrapper audit={audit} />;
};

const EditAudit = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<LoaderFill />}>
        <Fetcher auditId={params.slug} />
      </Suspense>
    </section>
  );
};

export default EditAudit;
