import { Suspense } from "react";
import AuditEdit from "@/components/screens/audits/edit";
import { AuditDetailedSkeleton } from "@/components/Loader";

const EditAudit = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center px-content-limit">
      <Suspense fallback={<AuditDetailedSkeleton />}>
        <AuditEdit auditId={params.slug} />
      </Suspense>
    </section>
  );
};

export default EditAudit;
