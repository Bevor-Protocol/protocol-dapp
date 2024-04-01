import { getAudits } from "@/lib/actions/audits";
import { Column } from "@/components/Box";
import { AuditCard } from "@/components/Audit";

const Audits = async ({ current }: { current: string }): Promise<JSX.Element> => {
  const audits = await getAudits(current);

  return (
    <Column className="gap-4 justify-center items-center w-full">
      {audits.length == 0 && <p>Currently no {current} audits</p>}
      {audits.map((audit, ind) => (
        <AuditCard audit={audit} key={ind} />
      ))}
    </Column>
  );
};

export default Audits;
