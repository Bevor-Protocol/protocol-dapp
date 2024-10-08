"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { auditAction } from "@/actions";
import { Info } from "@/assets";
import { Column, Row } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import AuditorAttest from "@/components/Modal/Content/auditorAttest";
import InitiateAudit from "@/components/Modal/Content/onchain/initiateAudit";
import ErrorToast from "@/components/Toast/Content/error";
import * as Tooltip from "@/components/Tooltip";
import { useModal, useToast } from "@/hooks/useContexts";
import { AuditStateI } from "@/utils/types";
import { AuditI } from "@/utils/types/prisma";

const OwnerEditAudit = ({ id, disabled }: { id: string; disabled: boolean }): JSX.Element => {
  return (
    <Row className="items-center gap-4">
      <DynamicLink href={`/audits/edit/${id}`} asButton className="flex-1" disabled={disabled}>
        <Row className="btn-outline">Edit Audit</Row>
      </DynamicLink>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              As the Owner, you can edit this audit. However, since it is in the locked period, this
              will reset all attestations. You can update terms or remove auditors.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const OwnerReopenAudit = ({
  id,
  disabled,
  setDisabled,
}: {
  id: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { show } = useToast();

  const { mutate } = useMutation({
    mutationFn: () => auditAction.owner.openAudit(id),
    onMutate: () => setDisabled(true),
    onSuccess: (response) => {
      if (response.success) {
        setDisabled(false);
      } else {
        show({
          content: <ErrorToast text={response.error.message} />,
          autoClose: true,
          autoCloseReady: true,
        });
      }
    },
  });

  return (
    <Row className="items-center gap-4">
      <Button disabled={disabled} onClick={() => mutate()} className="flex-1">
        Re-open Audit
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              As the Owner, you can re-open this audit and allow other auditors to request to join.
              All attestations will be undone.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const OwnerInitiateAudit = ({
  audit,
  disabled,
  setDisabled,
}: {
  audit: AuditI;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { show } = useModal();

  const handleSubmit = (): void => {
    setDisabled(true);
    show(<InitiateAudit audit={audit} setDisabled={setDisabled} />);
  };

  return (
    <Row className="items-center gap-4">
      <Button disabled={disabled} onClick={handleSubmit} className="flex-1">
        Kick Off Audit
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              As the Owner, once all parties attest and accept the terms, you can kick off the audit
              period. This requires posting data on-chain.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditorRemoveVerification = ({
  auditId,
  disabled,
  setDisabled,
}: {
  auditId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { show } = useToast();

  const { mutate } = useMutation({
    mutationFn: () => auditAction.auditor.leaveAudit(auditId),
    onMutate: () => setDisabled(true),
    onSuccess: (response) => {
      if (response.success) {
        setDisabled(false);
      } else {
        show({
          content: <ErrorToast text={response.error.message} />,
          autoClose: true,
          autoCloseReady: true,
        });
      }
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
              Even though the audit is locked, you can still leave if the process is going to slowly
              or you cannot come to agreement on the terms. This will reset attestations for other
              auditors as well.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditorAttestTerms = ({
  audit,
  disabled,
}: {
  audit: AuditI;
  disabled: boolean;
}): JSX.Element => {
  const { show } = useModal();

  const handleAttestModal = (): void => {
    show(<AuditorAttest audit={audit} />);
  };

  return (
    <Row className="items-center gap-4">
      <Button disabled={disabled} className="flex-1" onClick={handleAttestModal}>
        Attest to Terms
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              As an auditor, you can attest to the terms. This can mean accept or reject them. The
              audit will not begin until all Auditors take this action.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditLockedActions = ({
  audit,
  state,
}: {
  audit: AuditI;
  state: AuditStateI;
}): JSX.Element => {
  // I'll set a global disabled state for all mutations within children.
  const [disabled, setDisabled] = useState(false);

  if (state.isAuditOwner) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <OwnerEditAudit id={audit.id} disabled={disabled} />
        <OwnerReopenAudit id={audit.id} disabled={disabled} setDisabled={setDisabled} />
        <OwnerInitiateAudit
          audit={audit}
          disabled={!state.states.CAN_LOCK_AUDIT || disabled}
          setDisabled={setDisabled}
        />
      </Column>
    );
  }

  if (state.isAuditAuditor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorRemoveVerification
          auditId={audit.id}
          disabled={disabled}
          setDisabled={setDisabled}
        />
        <AuditorAttestTerms audit={audit} disabled={!state.states.CAN_ATTEST || disabled} />
      </Column>
    );
  }

  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      <Button disabled>Audit is Locked</Button>
    </Column>
  );
};

export default AuditLockedActions;
