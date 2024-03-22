import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import { AuditDashboard } from "@/components/pages/Audits/server";

const AuditDashboardPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}): JSX.Element => {
  const display = searchParams.display ?? "details";

  return (
    <section className="flex flex-col h-full items-center px-screen">
      <div className="flex flex-col w-full max-w-[1000px] gap-8 py-8 justify-start items-center h-full">
        <h2 className="text-4xl font-extrabold leading-[normal]">Audit Dashboard</h2>
        <Suspense fallback={<Loader className="h-12" />}>
          <AuditDashboard auditId={params.slug} display={display} />
        </Suspense>
      </div>
    </section>
  );
};

export default AuditDashboardPage;
