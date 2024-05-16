import { AuditorStatus, AuditStatus, Users } from "@prisma/client";

import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { trimAddress } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { AuditAuditor } from "@/components/Audit/client";
import { AuditI } from "@/lib/types";
import AuditDashboardActions from "./actions";
import Withdraw from "./actions/withdraw";

const AuditPage = ({ audit, user }: { audit: AuditI; user: Users | null }): JSX.Element => {
  const verifiedAuditors = audit.auditors.filter(
    (auditor) => auditor.status == AuditorStatus.VERIFIED,
  );
  const requestedAuditors = audit.auditors.filter(
    (auditor) => auditor.status == AuditorStatus.REQUESTED,
  );
  const rejectedAuditors = audit.auditors.filter(
    (auditor) => auditor.status == AuditorStatus.REJECTED,
  );

  const attestationPending = audit.auditors.filter((auditor) => !auditor.attestedTerms);
  const attestationAccepted = audit.auditors.filter((auditor) => auditor.acceptedTerms);
  const attestationRejected = audit.auditors.filter(
    (auditor) => auditor.attestedTerms && !auditor.acceptedTerms,
  );

  return (
    <Row className="justify-between items-stretch relative">
      <Column className="items-stretch gap-4">
        <div>
          <DynamicLink href={`/user/${audit.auditee.address}`}>
            <Icon image={audit.auditee.image} seed={audit.auditee.address} size="xxl" />
          </DynamicLink>
          <p className="text-sm mt-4 mb-1">
            {audit.auditee.name && <span>{audit.auditee.name} | </span>}
            <span>{trimAddress(audit.auditee.address)}</span>
          </p>
        </div>
        <div>
          <p className="text-lg font-bold">{audit.title}</p>
          <p className="text-base my-2">{audit.description}</p>
        </div>
        <div>
          {audit.status === AuditStatus.DISCOVERY && (
            <>
              <Row className="items-center gap-4 h-[32px] md:h-[27px]">
                <p className="w-40">Verified to Audit:</p>
                {verifiedAuditors.length > 0 ? (
                  <Row>
                    {verifiedAuditors.map((auditor, ind2) => (
                      <AuditAuditor
                        position={`-${ind2 * 12.5}px`}
                        key={ind2}
                        auditor={auditor.user}
                      />
                    ))}
                  </Row>
                ) : (
                  <span className="text-white/60">TBD</span>
                )}
              </Row>
              <Row className="items-center gap-4 h-[32px] md:h-[27px]">
                <p className="w-40">Requested to Audit:</p>
                {requestedAuditors.length > 0 ? (
                  <Row>
                    {requestedAuditors.map((auditor, ind2) => (
                      <AuditAuditor
                        position={`-${ind2 * 12.5}px`}
                        key={ind2}
                        auditor={auditor.user}
                      />
                    ))}
                  </Row>
                ) : (
                  <span className="text-white/60">TBD</span>
                )}
              </Row>
              <Row className="items-center gap-4 h-[32px] md:h-[27px]">
                <p className="w-40">Rejected to Audit:</p>
                {rejectedAuditors.length > 0 ? (
                  <Row>
                    {rejectedAuditors.map((auditor, ind2) => (
                      <AuditAuditor
                        position={`-${ind2 * 12.5}px`}
                        key={ind2}
                        auditor={auditor.user}
                      />
                    ))}
                  </Row>
                ) : (
                  <span className="text-white/60">TBD</span>
                )}
              </Row>
            </>
          )}
          {audit.status === AuditStatus.ATTESTATION && (
            <>
              <Row className="items-center gap-4 h-[32px] md:h-[27px]">
                <p className="w-44">Pending Attestation:</p>
                {attestationPending.length > 0 ? (
                  <Row>
                    {attestationPending.map((auditor, ind2) => (
                      <AuditAuditor
                        position={`-${ind2 * 12.5}px`}
                        key={ind2}
                        auditor={auditor.user}
                      />
                    ))}
                  </Row>
                ) : (
                  <span className="text-white/60">TBD</span>
                )}
              </Row>
              <Row className="items-center gap-4 h-[32px] md:h-[27px]">
                <p className="w-44">Attested + Accepted:</p>
                {attestationAccepted.length > 0 ? (
                  <Row>
                    {attestationAccepted.map((auditor, ind2) => (
                      <AuditAuditor
                        position={`-${ind2 * 12.5}px`}
                        key={ind2}
                        auditor={auditor.user}
                      />
                    ))}
                  </Row>
                ) : (
                  <span className="text-white/60">TBD</span>
                )}
              </Row>
              <Row className="items-center gap-4 h-[32px] md:h-[27px]">
                <p className="w-44">Attested + Rejected:</p>
                {attestationRejected.length > 0 ? (
                  <Row>
                    {attestationRejected.map((auditor, ind2) => (
                      <AuditAuditor
                        position={`-${ind2 * 12.5}px`}
                        key={ind2}
                        auditor={auditor.user}
                      />
                    ))}
                  </Row>
                ) : (
                  <span className="text-white/60">TBD</span>
                )}
              </Row>
            </>
          )}
          {audit.status !== AuditStatus.DISCOVERY && audit.status !== AuditStatus.ATTESTATION && (
            <Row className="items-center gap-4 h-[32px] md:h-[27px]">
              <p className="w-40">Auditors:</p>
              {verifiedAuditors.length > 0 ? (
                <Row>
                  {verifiedAuditors.map((auditor, ind2) => (
                    <AuditAuditor
                      position={`-${ind2 * 12.5}px`}
                      key={ind2}
                      auditor={auditor.user}
                    />
                  ))}
                </Row>
              ) : (
                <span className="text-white/60">TBD</span>
              )}
            </Row>
          )}
        </div>
      </Column>
      <Column className="gap-6 justify-between items-end">
        <div>
          <p className="text-right text-lg">
            Audit is <span className="uppercase">{audit.status}</span>
          </p>
          <Row className="gap-4">
            <div className="inline-block w-36 text-right">Prize Pool: </div>
            <div className="flex-1 text-right">${audit.price.toLocaleString()}</div>
          </Row>
          <Row className="gap-4">
            <div className="inline-block w-36 text-right">Vesting Duration: </div>
            <div className="flex-1 text-right">{audit.duration || "TBD"} days</div>
          </Row>
          <Row className="gap-4">
            <div className="inline-block w-36 text-right">Created: </div>
            <div className="flex-1 text-right">
              {new Date(audit.createdAt).toLocaleDateString()}
            </div>
          </Row>
        </div>
        {(audit.status == AuditStatus.CHALLENGEABLE || audit.status == AuditStatus.FINALIZED) && (
          <Withdraw audit={audit} />
        )}
        {user && <AuditDashboardActions audit={audit} user={user} />}
      </Column>
    </Row>
  );
};

export default AuditPage;
