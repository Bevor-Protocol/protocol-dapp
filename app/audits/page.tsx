import Audit, { AuditSection } from "@/components/pages/Audits";
import { audits } from "@/utils/constants";

import { Section } from "@/components/Common";
import { Column } from "@/components/Box";
import { H2 } from "@/components/Text";
import { AuditSSRI } from "@/utils/types";

const getData = (): AuditSSRI => {
  const open = audits.filter((audit) => audit.status === "open");
  const soon = audits.filter((audit) => audit.status === "soon");
  const closed = audits.filter((audit) => audit.status === "closed");

  return {
    open,
    soon,
    closed,
  };
};

export default async (): Promise<JSX.Element> => {
  const { open, soon, closed } = await getData();
  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <Column $gap="rem2">
        <AuditSection>
          <H2>Open Audits</H2>
          <Audit arr={open} />
        </AuditSection>
        <AuditSection>
          <H2>Pending Audits</H2>
          <Audit arr={soon} />
        </AuditSection>
        <AuditSection>
          <H2>Closed Audits</H2>
          <Audit arr={closed} />
        </AuditSection>
      </Column>
    </Section>
  );
};
