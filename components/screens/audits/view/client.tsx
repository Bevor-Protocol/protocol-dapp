"use client";

import { Auditors, AuditStatus, Users } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { AuditViewDetailedI } from "@/lib/types/actions";
import { useUser } from "@/hooks/contexts";
import DynamicLink from "@/components/Link";
import { auditAddRequest, auditDeleteRequest, lockAudit, reopenAudit } from "@/lib/actions/audits";
import { useModal } from "@/hooks/contexts";
import RequestsEdit from "@/components/Modal/Content/requestsEdit";
import AuditorAttest from "@/components/Modal/Content/auditorAttest";
import { Skeleton } from "@/components/Loader";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";

export const AuditOpenActions = ({
  user,
  audit,
  verifiedAuditors,
  rejectedAuditors,
  requestedAuditors,
}: {
  user: Users;
  audit: AuditViewDetailedI;
  verifiedAuditors: Auditors[];
  rejectedAuditors: Auditors[];
  requestedAuditors: Auditors[];
}): JSX.Element => {
  // All of the possible audit actions to take for OPEN audits.
  const { toggleOpen, setContent } = useModal();

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { fctType: string; auditId: string; userId: string }) => {
      if (variables.fctType == "add") {
        return auditAddRequest(variables.auditId, variables.userId);
      } else if (variables.fctType == "remove") {
        return auditDeleteRequest(variables.auditId, variables.userId);
      } else {
        return lockAudit(variables.auditId);
      }
    },
    onSettled: (data) => {
      console.log(data);
    },
  });

  const isTheAuditee = audit.auditeeId === user.id;
  const isAnAuditor = verifiedAuditors.filter((auditor) => auditor.userId == user.id).length > 0;
  const isRequestor = requestedAuditors.filter((auditor) => auditor.userId == user.id).length > 0;
  const isRejected = rejectedAuditors.filter((auditor) => auditor.userId == user.id).length > 0;

  const handleRequestsModal = (): void => {
    setContent(<RequestsEdit audit={audit} />);
    toggleOpen();
  };

  return (
    <>
      {isTheAuditee && (
        <Row className="items-center gap-4">
          <DynamicLink href={`/audits/edit/${audit.id}`} asButton className="flex-1">
            <Row className="btn-outline">Edit Audit</Row>
          </DynamicLink>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">As the Auditee, you can edit this audit</div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isTheAuditee && (requestedAuditors.length > 0 || rejectedAuditors.length > 0) && (
        <Row className="items-center gap-4">
          <Button disabled={isPending} onClick={handleRequestsModal} className="flex-1">
            Manage Requests
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  As the Auditee, you can verify or reject the auditors requesting to conduct this
                  audit
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isRequestor && (
        <Row className="items-center gap-4">
          <Button
            onClick={() => mutate({ fctType: "remove", auditId: audit.id, userId: user.id })}
            disabled={isPending}
            className="flex-1"
          >
            Remove Request to Audit
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  Delete your request to conduct this audit. The auditee may still add you
                  themselves.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {!isRequestor && !isRejected && !isAnAuditor && user.auditorRole && !isTheAuditee && (
        <Row className="items-center gap-4">
          <Button
            onClick={() => mutate({ fctType: "add", auditId: audit.id, userId: user.id })}
            disabled={isPending}
            className="flex-1"
          >
            Request to Audit
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  As an Auditor, you can request to conduct this audit. The auditee may reject or
                  accept you. If they reject you, you cannot request again.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isAnAuditor && (
        <Row className="items-center gap-4">
          <Button
            disabled={isPending}
            onClick={() => mutate({ fctType: "remove", auditId: audit.id, userId: user.id })}
            className="flex-1"
          >
            Remove me as Auditor
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  You can remove yourself as an Auditor. You can still request to audit after this
                  action is taken, and the Auditee might still add you to audit on their own.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isRejected && (
        <Row className="items-center gap-4">
          <Button disabled={true} className="flex-1">
            Rejected from Audit
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  The Auditee rejected you. You cannot take further actions, but it is possible that
                  the Auditee changes their mind and re-verifies you as an Auditor.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isTheAuditee && verifiedAuditors.length > 0 && (
        <Row className="items-center gap-4">
          <Button
            disabled={isPending}
            onClick={() => mutate({ fctType: "lock", auditId: audit.id, userId: user.id })}
            className="flex-1"
          >
            Lock Audit
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  As the Auditee, you can move this audit to Locked, meaning that no one can request
                  to join the audit, and you cannot add additional auditors. This moves the audit
                  into the Attestation period. This is reversible, however all Auditors who were
                  previously rejected can now re-request to join.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
    </>
  );
};

export const AuditLockedActions = ({
  user,
  audit,
  verifiedAuditors,
}: {
  user: Users;
  audit: AuditViewDetailedI;
  verifiedAuditors: Auditors[];
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();
  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { fctType: string; auditId: string; userId: string }) => {
      if (variables.fctType == "add") {
        return auditAddRequest(variables.auditId, variables.userId);
      } else if (variables.fctType == "remove") {
        return auditDeleteRequest(variables.auditId, variables.userId);
      } else {
        return reopenAudit(variables.auditId);
      }
    },
    onSettled: (data) => {
      console.log(data);
    },
  });

  const handleAttestModal = (): void => {
    setContent(<AuditorAttest audit={audit} user={user} />);
    toggleOpen();
  };

  const isTheAuditee = audit.auditeeId === user.id;
  const isAnAuditor = verifiedAuditors.filter((auditor) => auditor.userId == user.id).length > 0;
  const hasAttested =
    verifiedAuditors.filter((auditor) => {
      if (auditor.userId == user.id) {
        if (auditor.attestedTerms) {
          return true;
        }
      }
      return false;
    }).length > 0;

  return (
    <>
      {!isTheAuditee && !isAnAuditor && <Button disabled>Audit is Locked</Button>}
      {isTheAuditee && (
        <Row className="items-center gap-4">
          <DynamicLink href={`/audits/edit/${audit.id}`} asButton className="flex-1">
            <Row className="btn-outline">Edit Audit</Row>
          </DynamicLink>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  As the Auditee, you can edit this audit. However, since it is in the locked
                  period, this will reset all attestations. You can update terms or remove auditors.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isAnAuditor && (
        <Row className="items-center gap-4">
          <Button
            disabled={isPending}
            onClick={() => mutate({ fctType: "remove", auditId: audit.id, userId: user.id })}
            className="flex-1"
          >
            Remove me as Auditor
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  Even though the audit is locked, you can still leave if the process is going to
                  slowly or you cannot come to agreement on the terms. This will reset attestations
                  for other auditors as well.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isTheAuditee && (
        <Row className="items-center gap-4">
          <Button
            disabled={isPending}
            onClick={() => mutate({ fctType: "reopen", auditId: audit.id, userId: user.id })}
            className="flex-1"
          >
            Re-open Audit
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  As the auditee, you can re-open this audit and allow other auditors to request to
                  join. All attestations will be undone.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isAnAuditor && !hasAttested && (
        <Row className="items-center gap-4">
          <Button disabled={isPending} className="flex-1" onClick={handleAttestModal}>
            Attest to Terms
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  As an auditor, you can attest to the terms. This can mean accept or reject them.
                  The audit will not begin until all Auditors take this action.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
    </>
  );
};

export const AuditOngoingActions = ({
  user,
  audit,
  verifiedAuditors,
}: {
  user: Users;
  audit: AuditViewDetailedI;
  verifiedAuditors: Auditors[];
}): JSX.Element => {
  const isTheAuditee = audit.auditeeId === user.id;
  const isAnAuditor = verifiedAuditors.filter((auditor) => auditor.userId == user.id).length > 0;

  return (
    <>
      {isAnAuditor && (
        <Row className="items-center gap-4">
          <Button disabled={true} className="flex-1">
            Submit Findings
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  Submit your findings. The Auditee will not be able to see these yet until the
                  selective disclosure period.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
      {isTheAuditee && (
        <Row className="items-center gap-4">
          <Button disabled={true} className="flex-1">
            Pending Findings
          </Button>
          <Tooltip.Reference>
            <Tooltip.Trigger>
              <Info height="1rem" width="1rem" />
            </Tooltip.Trigger>
            <Tooltip.Content side="top" align="end">
              <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
                <div className="p-2">
                  This audit is still pending the submission of the audit findings from all
                  auditors.
                </div>
              </div>
            </Tooltip.Content>
          </Tooltip.Reference>
        </Row>
      )}
    </>
  );
};

export const AuditFinalActions = (): JSX.Element => {
  return <Button>View Findings</Button>;
};

export const AuditDashboardActions = ({
  audit,
  verifiedAuditors,
  rejectedAuditors,
  requestedAuditors,
}: {
  audit: AuditViewDetailedI;
  verifiedAuditors: Auditors[];
  rejectedAuditors: Auditors[];
  requestedAuditors: Auditors[];
}): JSX.Element => {
  const { user, isFetchedAfterMount } = useUser();

  if (!isFetchedAfterMount) {
    return (
      <Column className="gap-2 items-end">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </Column>
    );
  }

  if (!user) return <></>;

  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      {audit.status === AuditStatus.OPEN && (
        <AuditOpenActions
          user={user}
          audit={audit}
          verifiedAuditors={verifiedAuditors}
          requestedAuditors={requestedAuditors}
          rejectedAuditors={rejectedAuditors}
        />
      )}
      {audit.status === AuditStatus.ATTESTATION && (
        <AuditLockedActions user={user} audit={audit} verifiedAuditors={verifiedAuditors} />
      )}
      {audit.status === AuditStatus.ONGOING && (
        <AuditOngoingActions user={user} audit={audit} verifiedAuditors={verifiedAuditors} />
      )}
      {audit.status === AuditStatus.FINAL && <AuditFinalActions />}
    </Column>
  );
};
