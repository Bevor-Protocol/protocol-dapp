import { getUserAuditsAuditee, getUserAuditsVerifiedAuditor } from "@/actions/users";
import { AuditCard } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { AuditStatus } from "@prisma/client";

const UserAudits = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const [auditsAuditee, auditsAuditor] = await Promise.all([
    getUserAuditsAuditee(address),
    getUserAuditsVerifiedAuditor(address),
  ]);
  const audits = {
    auditor: {
      open: auditsAuditor.filter((audit) => audit.status === AuditStatus.OPEN),
      locked: auditsAuditor.filter((audit) => audit.status === AuditStatus.ATTESTATION),
      ongoing: auditsAuditor.filter((audit) => audit.status === AuditStatus.ONGOING),
      final: auditsAuditor.filter((audit) => audit.status === AuditStatus.FINAL),
    },
    auditee: {
      open: auditsAuditee.filter((audit) => audit.status === AuditStatus.OPEN),
      locked: auditsAuditee.filter((audit) => audit.status === AuditStatus.ATTESTATION),
      ongoing: auditsAuditee.filter((audit) => audit.status === AuditStatus.ONGOING),
      final: auditsAuditee.filter((audit) => audit.status === AuditStatus.FINAL),
    },
  };

  return (
    <Column className="gap-8 w-full items-stretch">
      {auditsAuditee.length > 0 && (
        <Column className="gap-2">
          <h2 className="text-lg">Audits Created</h2>
          {audits.auditee.open.length > 0 && (
            <div className="w-full">
              <p className="my-2">Open:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditee.open.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditee.locked.length > 0 && (
            <div className="w-full">
              <p className="my-2">Locked:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditee.locked.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditee.ongoing.length > 0 && (
            <div className="w-full">
              <p className="my-2">Ongoing:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditee.ongoing.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditee.final.length > 0 && (
            <div className="w-full">
              <p className="my-2">Closed:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditee.final.map((audit, ind) => (
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
          {audits.auditor.open.length > 0 && (
            <div className="w-full">
              <p className="my-2">Open:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditor.open.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditor.locked.length > 0 && (
            <div className="w-full">
              <p className="my-2">Locked:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditor.locked.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditor.ongoing.length > 0 && (
            <div className="w-full">
              <p className="my-2">Ongoing:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditor.ongoing.map((audit, ind) => (
                  <AuditCard key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditor.final.length > 0 && (
            <div className="w-full">
              <p className="my-2">Closed:</p>
              <Row className="w-full justify-start flex-wrap gap-4">
                {audits.auditor.final.map((audit, ind) => (
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
