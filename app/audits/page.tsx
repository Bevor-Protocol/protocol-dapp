import { AuditHolder } from "@/components/pages/Audits/styled";
import { AuditHeader } from "@/components/pages/Audits/client";
import { Audits, AuditsSkeleton } from "@/components/pages/Audits/server";
import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { Suspense } from "react";

const Audit = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}): JSX.Element => {
  const status = searchParams.status ?? "open";

  return (
    <Section $padCommon $centerH>
      <AuditHolder $gap="rem1" $padding="2rem 0" $justify="flex-start">
        <H2>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Audits</H2>
        <AuditHeader current={status} />
        <Suspense fallback={<AuditsSkeleton />}>
          <Audits current={status} />
        </Suspense>
      </AuditHolder>
    </Section>
  );
};

export default Audit;
