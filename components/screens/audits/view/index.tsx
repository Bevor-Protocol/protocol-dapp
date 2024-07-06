import { AuditorStatus, AuditStatus, Users } from "@prisma/client";

import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { trimAddress } from "@/utils/formatters";
import { Icon } from "@/components/Icon";
import { AuditAuditor } from "@/components/Audit/client";
import { AuditI } from "@/utils/types/prisma";
import AuditDashboardActions from "./actions";
import { Suspense } from "react";
import { Loader } from "@/components/Loader";
import { AvailableTokens } from "@/constants/web3";

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

  const token = AvailableTokens.localhost.find((t) => t.address == audit.token);

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
          <Row className="gap-4">
            <div className="inline-block w-36 text-right">Prize Pool: </div>
            <div className="flex-1 text-right">
              {audit.price.toLocaleString()} {token?.symbol}
            </div>
          </Row>
          <Row className="gap-4 text-sm text-white/60">
            <div className="inline-block w-36 text-right">Vesting Duration: </div>
            <div className="flex-1 text-right">{audit.duration.toLocaleString() || "TBD"} days</div>
          </Row>
          <Row className="gap-4 text-sm text-white/60">
            <div className="inline-block w-36 text-right">Vesting Cliff: </div>
            <div className="flex-1 text-right">{audit.cliff.toLocaleString() || "TBD"} days</div>
          </Row>
          <Row className="gap-4 text-sm text-white/60">
            <div className="inline-block w-36 text-right">Created: </div>
            <div className="flex-1 text-right">
              {new Date(audit.createdAt).toLocaleDateString()}
            </div>
          </Row>
        </div>
        {user && (
          <Suspense fallback={<Loader className="h-4 w-4" />}>
            <AuditDashboardActions audit={audit} user={user} />
          </Suspense>
        )}
      </Column>
    </Row>
  );
};

export default AuditPage;
