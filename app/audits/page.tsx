import { redirect } from "next/navigation";

import Audit, { AuditSection, AuditHolder } from "@/components/pages/Audits";
import { audits } from "@/utils/constants";
import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { AuditSSRI } from "@/utils/types";

const getData = (status: string): AuditSSRI => {
  if (!["open", "pending", "closed"].includes(status)) {
    redirect("/audits?status=open");
  }
  const auditShow = audits.filter((audit) => audit.status == status);
  return {
    auditShow,
  };
};

export default async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}): Promise<JSX.Element> => {
  let { status } = searchParams;
  status = status || "open";
  const { auditShow } = getData(status);
  return (
    <Section $fillHeight $padCommon $centerH>
      <AuditHolder $gap="rem3" $padding="2rem 0">
        <AuditSection>
          <H2>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Audits</H2>
          <Audit arr={auditShow} current={status} />
        </AuditSection>
      </AuditHolder>
    </Section>
  );
};
