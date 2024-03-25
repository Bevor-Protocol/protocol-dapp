import Link from "next/link";
import { Suspense } from "react";

import { AuditDetailedSkeleton } from "@/components/Loader";
import { AuditDetailed, AuditMarkdown } from "@/components/pages/Audits/server";
import { Column, Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";

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
        <Column className="w-full gap-4">
          <Suspense fallback={<AuditDetailedSkeleton />}>
            <AuditDetailed auditId={params.slug} />
          </Suspense>
          <Column className="p-4">
            <Row className="gap-4">
              <Link
                href={`/audits/${params.slug}?display=details`}
                className="outline-none"
                scroll={false}
              >
                <Toggle active={display === "details"} title={"details"} />
              </Link>
              <Link
                href={`/audits/${params.slug}?display=audit`}
                className="outline-none"
                scroll={false}
              >
                <Toggle active={display === "audit"} title={"audit"} />
              </Link>
            </Row>
            <Suspense fallback={<p>Loading...</p>}>
              <AuditMarkdown display={display} />
            </Suspense>
          </Column>
        </Column>
      </div>
    </section>
  );
};

export default AuditDashboardPage;
