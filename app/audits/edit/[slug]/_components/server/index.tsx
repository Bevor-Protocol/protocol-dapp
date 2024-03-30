import { getAudit } from "@/lib/actions/audits";
import { AuditEditWrapper } from "../client";

export const AuditEdit = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);

  if (!audit) return <h2>This audit does not exist</h2>;

  return <AuditEditWrapper audit={audit} />;
};
