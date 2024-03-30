import { getMarkdown } from "@/lib/actions/audits";
import { AuditDetailed } from "@/components/Audit";
import { getAudit } from "@/lib/actions/audits";
import { Column } from "@/components/Box";

export const AuditMarkdown = async ({ display }: { display: string }): Promise<JSX.Element> => {
  const content = await getMarkdown(display);
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: content }} />;
};

export const AuditPage = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  return (
    <Column className="gap-4">
      <AuditDetailed audit={audit} />
      <Column className="w-full gap-2 py-4 items-center">
        <p className="text-white/60">Vesting Progress</p>
        <div className="h-4 bg-dark-primary-20 rounded-xl border-2 border-gray-200/20 w-full max-w-sm">
          <div className="h-full w-[20%] grad-light rounded-[inherit]" />
        </div>
        <p className="text-white/60">200 / 1000 ETH Vested</p>
      </Column>
    </Column>
  );
};
