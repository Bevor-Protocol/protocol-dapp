import { Suspense } from "react";

import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { AuditHolder } from "@/components/pages/Audits/styled";
import { Loader } from "@/components/Common";
import { AuditDashboard } from "@/components/pages/Audits/server";

const AuditDashboardPage = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}): Promise<JSX.Element> => {
  const display = searchParams.display ?? "details";

  return (
    <Section $padCommon $centerH $centerV>
      <AuditHolder $gap="rem2">
        <H2>Audit Dashboard</H2>
        <Suspense fallback={<Loader $size="50px" />}>
          <AuditDashboard auditId={params.slug} display={display} />
        </Suspense>
      </AuditHolder>
    </Section>
  );
};

export default AuditDashboardPage;
