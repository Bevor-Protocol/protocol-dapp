import { getUserAuditsAuditee, getUserAuditsVerifiedAuditor } from "@/actions/users";
import { AuditCardTruncated } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { AuditStatus } from "@prisma/client";

const UserAudits = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const [auditsAuditee, auditsAuditor] = await Promise.all([
    getUserAuditsAuditee(address),
    getUserAuditsVerifiedAuditor(address),
  ]);
  const audits = {
    auditor: {
      open: auditsAuditor.filter((audit) => audit.status === AuditStatus.DISCOVERY),
      locked: auditsAuditor.filter((audit) => audit.status === AuditStatus.ATTESTATION),
      ongoing: auditsAuditor.filter((audit) => audit.status === AuditStatus.AUDITING),
      challengeable: auditsAuditor.filter((audit) => audit.status === AuditStatus.CHALLENGEABLE),
      completed: auditsAuditor.filter((audit) => audit.status === AuditStatus.FINALIZED),
    },
    auditee: {
      open: auditsAuditee.filter((audit) => audit.status === AuditStatus.DISCOVERY),
      locked: auditsAuditee.filter((audit) => audit.status === AuditStatus.ATTESTATION),
      ongoing: auditsAuditee.filter((audit) => audit.status === AuditStatus.AUDITING),
      challengeable: auditsAuditee.filter((audit) => audit.status === AuditStatus.CHALLENGEABLE),
      completed: auditsAuditee.filter((audit) => audit.status === AuditStatus.FINALIZED),
    },
  };

  return (
    <Column className="gap-8 w-full items-stretch">
      {auditsAuditee.length > 0 && (
        <Column className="gap-2">
          <h2 className="text-lg">As Auditee:</h2>
          {audits.auditee.open.length > 0 && (
            <div className="w-full">
              <p className="my-2">Open:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditee.open.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditee.locked.length > 0 && (
            <div className="w-full">
              <p className="my-2">Locked:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditee.locked.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditee.ongoing.length > 0 && (
            <div className="w-full">
              <p className="my-2">Ongoing:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditee.ongoing.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditee.challengeable.length > 0 && (
            <div className="w-full">
              <p className="my-2">Challengeable:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditee.challengeable.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditee.completed.length > 0 && (
            <div className="w-full">
              <p className="my-2">Closed:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditee.completed.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
        </Column>
      )}
      {auditsAuditor.length > 0 && (
        <Column className="gap-2">
          <h2 className="text-lg">As Auditor:</h2>
          {audits.auditor.open.length > 0 && (
            <div className="w-full">
              <p className="my-2">Open:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditor.open.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditor.locked.length > 0 && (
            <div className="w-full">
              <p className="my-2">Locked:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditor.locked.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditor.ongoing.length > 0 && (
            <div className="w-full">
              <p className="my-2">Ongoing:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditor.ongoing.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditor.challengeable.length > 0 && (
            <div className="w-full">
              <p className="my-2">Challengeable:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditor.challengeable.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
                ))}
              </Row>
            </div>
          )}
          {audits.auditor.completed.length > 0 && (
            <div className="w-full">
              <p className="my-2">Closed:</p>
              <Row className="w-full justify-start flex-wrap">
                {audits.auditor.completed.map((audit, ind) => (
                  <AuditCardTruncated key={ind} audit={audit} />
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
