"use client";

import { Auditors, Users } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { AuditViewI } from "@/lib/types";
import { useModal } from "@/lib/hooks";
import { auditAddRequest, auditDeleteRequest } from "@/actions/audits/user";
import { lockAudit } from "@/actions/audits/auditee";
import { Row, Column } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import RequestsEdit from "@/components/Modal/Content/requestsEdit";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";
import { useState } from "react";

const AuditeeEditAudit = ({ id }: { id: string }): JSX.Element => {
  return (
    <Row className="items-center gap-4">
      <DynamicLink href={`/audits/edit/${id}`} asButton className="flex-1">
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
  );
};

const AuditeeManageRequest = ({
  audit,
  disabled,
}: {
  audit: AuditViewI;
  disabled: boolean;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleRequestsModal = (): void => {
    setContent(<RequestsEdit audit={audit} />);
    toggleOpen();
  };

  return (
    <Row className="items-center gap-4">
      <Button disabled={disabled} onClick={handleRequestsModal} className="flex-1">
        Manage Requests
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              If there are auditors you have rejected, or auditors who have requested, you can
              manage these requests.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditorRemoveRequest = ({
  auditId,
  userId,
  disabled,
  setDisabled,
}: {
  auditId: string;
  userId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { mutate } = useMutation({
    mutationFn: () => auditDeleteRequest(auditId, userId),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      setDisabled(false);
      console.log(data);
    },
  });

  return (
    <Row className="items-center gap-4">
      <Button onClick={() => mutate()} disabled={disabled} className="flex-1">
        Remove Request to Audit
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              Delete your request to conduct this audit. The auditee may still add you themselves.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditorAddRequest = ({
  auditId,
  userId,
  disabled,
  setDisabled,
}: {
  auditId: string;
  userId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { mutate } = useMutation({
    mutationFn: () => auditAddRequest(auditId, userId),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      setDisabled(false);
      console.log(data);
    },
  });

  return (
    <Row className="items-center gap-4">
      <Button onClick={() => mutate()} disabled={disabled} className="flex-1">
        Request to Audit
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              As an Auditor, you can request to conduct this audit. The auditee may reject or accept
              you. If they reject you, you cannot request again.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditorRemoveVerification = ({
  auditId,
  userId,
  disabled,
  setDisabled,
}: {
  auditId: string;
  userId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { mutate } = useMutation({
    mutationFn: () => auditDeleteRequest(auditId, userId),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      setDisabled(false);
      console.log(data);
    },
  });

  return (
    <Row className="items-center gap-4">
      <Button onClick={() => mutate()} disabled={disabled} className="flex-1">
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
  );
};

export const AuditorRejected = (): JSX.Element => {
  return (
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
              The Auditee rejected you. You cannot take further actions, but it is possible that the
              Auditee changes their mind and re-verifies you as an Auditor.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditeeLockAudit = ({
  auditId,
  disabled,
  setDisabled,
}: {
  auditId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { mutate } = useMutation({
    mutationFn: () => lockAudit(auditId),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      setDisabled(false);
      console.log(data);
    },
  });

  return (
    <Row className="items-center gap-4">
      <Button disabled={disabled} onClick={() => mutate()} className="flex-1">
        Lock Audit
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end" className="w-60">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              If you have submitted the Audit details, and there is at least 1 verified auditor, you
              can lock this audit. This moves the audit into the Attestation period, and means that
              no one can request to join the audit, and you cannot add additional auditors. This is
              reversible, however all Auditors who were previously rejected can now re-request to
              join.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditOpenActions = ({
  user,
  audit,
  verifiedAuditors,
  rejectedAuditors,
  requestedAuditors,
}: {
  user: Users;
  audit: AuditViewI;
  verifiedAuditors: Auditors[];
  rejectedAuditors: Auditors[];
  requestedAuditors: Auditors[];
}): JSX.Element => {
  // All of the possible audit actions to take for OPEN audits.

  // I'll set a global disabled state for all mutations within children.
  const [disabled, setDisabled] = useState(false);

  const isTheAuditee = audit.auditeeId === user.id;
  const isAnAuditor = verifiedAuditors.findIndex((auditor) => auditor.userId == user.id) > -1;
  const isRequestor = requestedAuditors.findIndex((auditor) => auditor.userId == user.id) > -1;
  const isRejected = rejectedAuditors.findIndex((auditor) => auditor.userId == user.id) > -1;
  const canManage = requestedAuditors.length > 0 || rejectedAuditors.length > 0;
  const canLock = verifiedAuditors.length > 0 && !!audit.details;

  if (isTheAuditee) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditeeEditAudit id={audit.id} />
        <AuditeeManageRequest audit={audit} disabled={!canManage || disabled} />
        <AuditeeLockAudit
          auditId={audit.id}
          disabled={!canLock || disabled}
          setDisabled={setDisabled}
        />
      </Column>
    );
  }

  if (isAnAuditor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorRemoveVerification
          auditId={audit.id}
          userId={user.id}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      </Column>
    );
  }

  if (isRequestor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorRemoveRequest
          auditId={audit.id}
          userId={user.id}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      </Column>
    );
  }

  if (isRejected) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorRejected />
      </Column>
    );
  }

  if (user.auditorRole) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorAddRequest
          auditId={audit.id}
          userId={user.id}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      </Column>
    );
  }

  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      <Button disabled>Audit is Open</Button>
    </Column>
  );
};

export default AuditOpenActions;
