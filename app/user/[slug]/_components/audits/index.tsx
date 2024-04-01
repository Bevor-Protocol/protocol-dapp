import { getUserAuditsAuditee, getUserAuditsAuditor } from "@/lib/actions/users";
import { AuditCard } from "@/components/Audit";
import { Column, Row } from "@/components/Box";

const UserAudits = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const [auditsAuditee, auditsAuditor] = await Promise.all([
    getUserAuditsAuditee(address),
    getUserAuditsAuditor(address),
  ]);

  const auditsAuditeeOpen = auditsAuditee.filter((audit) => !audit.isLocked);
  const auditsAuditeePending = auditsAuditee.filter((audit) => audit.isLocked && !audit.isFinal);
  const auditsAuditeeClosed = auditsAuditee.filter((audit) => audit.isFinal);

  const auditsAuditorOpen = auditsAuditor.filter((audit) => !audit.isLocked);
  const auditsAuditorPending = auditsAuditor.filter((audit) => audit.isLocked && !audit.isFinal);
  const auditsAuditorClosed = auditsAuditor.filter((audit) => audit.isFinal);

  return (
    <Column className="gap-8 w-full items-stretch">
      {auditsAuditee.length > 0 && (
        <Column className="gap-2">
          <h2 className="text-lg">Audits Created</h2>
          {auditsAuditeeOpen.length > 0 && (
            <div className="w-full">
              <p className="my-2">Open:</p>
              <Row className="w-full justify-start flex-wrap gap-2">
                {auditsAuditeeOpen.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {auditsAuditeePending.length > 0 && (
            <div className="w-full">
              <p className="my-2">Pending:</p>
              <Row className="w-full justify-start flex-wrap gap-2">
                {auditsAuditeePending.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {auditsAuditeeClosed.length > 0 && (
            <div className="w-full">
              <p className="my-2">Closed:</p>
              <Row className="w-full justify-start flex-wrap gap-2">
                {auditsAuditeeClosed.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
        </Column>
      )}
      {auditsAuditor.length > 0 && (
        <Column className="gap-2">
          <h2 className="text-lg">Audits Auditing</h2>
          {auditsAuditorOpen.length > 0 && (
            <div className="w-full">
              <p className="my-2">Open:</p>
              <Row className="w-full justify-start flex-wrap gap-2">
                {auditsAuditorOpen.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {auditsAuditorPending.length > 0 && (
            <div className="w-full">
              <p className="my-2">Pending:</p>
              <Row className="w-full justify-start flex-wrap gap-2">
                {auditsAuditorPending.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {auditsAuditorClosed.length > 0 && (
            <div className="w-full">
              <p className="my-2">Closed:</p>
              <Row className="w-full justify-start flex-wrap gap-2 *:flex-1">
                {auditsAuditorClosed.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
        </Column>
      )}
      {auditsAuditee.length + auditsAuditor.length == 0 && <h2>No Active Audits</h2>}
    </Column>
  );
};

export default UserAudits;
