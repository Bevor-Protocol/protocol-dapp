import { AuditorStatus, AuditStatus } from "@prisma/client";

import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { trimAddress } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { AuditAuditor } from "@/components/Audit/client";
import { AuditI } from "@/lib/types";
import AuditDashboardActions from "./actions";
import Withdraw from "./actions/withdraw";
import HistoryDiv from "./history";

const AuditPage = ({ audit }: { audit: AuditI }): JSX.Element => {
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
                    {verifiedAuditors.map(({ user }, ind2) => (
                      <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
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
                    {requestedAuditors.map(({ user }, ind2) => (
                      <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
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
                    {rejectedAuditors.map(({ user }, ind2) => (
                      <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
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
                    {attestationPending.map(({ user }, ind2) => (
                      <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
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
                    {attestationAccepted.map(({ user }, ind2) => (
                      <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
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
                    {attestationRejected.map(({ user }, ind2) => (
                      <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
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
                  {verifiedAuditors.map(({ user }, ind2) => (
                    <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={user} />
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
        <div className="w-[105%]">
          <p className="text-right text-lg">
            Audit is <span className="uppercase">{audit.status}</span>
          </p>
          <p>
            <span className="inline-block w-36 text-right mr-4">Prize Pool: </span>
            <span className="float-right">${audit.price.toLocaleString()}</span>
          </p>
          <p>
            <span className="inline-block w-36 text-right mr-4">Vesting Duration: </span>
            <span className="float-right">{audit.duration || "TBD"} month(s)</span>
          </p>
          <p>
            <span className="inline-block w-36 text-right mr-4">Created: </span>
            <span className="float-right">{new Date(audit.createdAt).toLocaleDateString()}</span>
          </p>
        </div>
        {(audit.status == AuditStatus.CHALLENGEABLE || audit.status == AuditStatus.FINALIZED) && (
          <Withdraw />
        )}
        <AuditDashboardActions audit={audit} />
      </Column>
      <HistoryDiv audit={audit} />
    </Row>
  );
};

export default AuditPage;
