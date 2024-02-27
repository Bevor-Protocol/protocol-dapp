import AuditWrapper, { AuditHolder } from "@/components/pages/Audits";
import { Section } from "@/components/Common";
import { H2 } from "@/components/Text";
import { getAudits } from "@/lib/actions/audits";

const Audits = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}): Promise<JSX.Element> => {
  const status = searchParams.status ?? "open";
  const audits = await getAudits(status);

  console.log(audits[0].auditors);

  return (
    <Section $padCommon $centerH>
      <AuditHolder $gap="rem1" $padding="2rem 0" $justify="flex-start">
        <H2>{status.charAt(0).toUpperCase() + status.substring(1).toLowerCase()} Audits</H2>
        <AuditWrapper arr={audits} current={status} />
      </AuditHolder>
    </Section>
  );
};

export default Audits;
