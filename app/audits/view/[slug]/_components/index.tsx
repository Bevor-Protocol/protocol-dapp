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
    </Column>
  );
};
