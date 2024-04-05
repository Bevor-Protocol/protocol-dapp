import Link from "next/link";
import { Suspense } from "react";

import { AuditDetailedSkeleton } from "@/components/Loader";
import { AuditPage, AuditMarkdown } from "@/components/screens/audits/view";
import { Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";

const AuditDashboardPage = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: "details" | "audit" | undefined };
}): JSX.Element => {
  const display = searchParams.display ?? "details";

  return (
    <section className="flex flex-col h-full items-center">
      <div className="w-full max-w-[1000px] py-8">
        <Suspense fallback={<AuditDetailedSkeleton />}>
          <AuditPage auditId={params.slug} />
        </Suspense>
        <hr className="w-full h-[1px] border-gray-200/20 my-4" />
        <Row className="gap-4 justify-start">
          <Link
            href={`/audits/view/${params.slug}?display=details`}
            className="outline-none"
            scroll={false}
          >
            <Toggle active={display === "details"} title={"details"} />
          </Link>
          <Link
            href={`/audits/view/${params.slug}?display=audit`}
            className="outline-none"
            scroll={false}
          >
            <Toggle active={display === "audit"} title={"audit"} />
          </Link>
        </Row>
        <Suspense fallback={<p>Loading...</p>}>
          <AuditMarkdown display={display} />
        </Suspense>
      </div>
    </section>
  );
};

export default AuditDashboardPage;
