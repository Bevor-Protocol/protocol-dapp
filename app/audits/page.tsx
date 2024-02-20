import { redirect } from "next/navigation";

import Audit, { AuditHolder } from "@/components/pages/Audits";
import { audits } from "@/lib/constants";
import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { AuditSSRI } from "@/lib/types";

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
    <Section $padCommon $centerH>
      <AuditHolder $gap="rem1" $padding="2rem 0" $justify="flex-start">
        <H2>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Audits</H2>
        <Audit arr={auditShow} current={status} />
      </AuditHolder>
    </Section>
  );
};
