"use client";

import { useState } from "react";
import { Users } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { AuditI, AuditStateI } from "@/lib/types";
import { useModal } from "@/lib/hooks";
import { reopenAudit } from "@/actions/audits/auditee";
import { leaveAudit } from "@/actions/audits/auditor";
import { Row, Column } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import AuditorAttest from "@/components/Modal/Content/auditorAttest";
import InitiateAudit from "@/components/Modal/Content/onchain/initiateAudit";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";

const AuditeeEditAudit = ({ id, disabled }: { id: string; disabled: boolean }): JSX.Element => {
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
              As the Auditee, you can edit this audit. However, since it is in the locked period,
              this will reset all attestations. You can update terms or remove auditors.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditeeReopenAudit = ({
  id,
  disabled,
  setDisabled,
}: {
  id: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { mutate } = useMutation({
    mutationFn: () => reopenAudit(id),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      setDisabled(false);
      console.log(data);
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
              As the auditee, you can re-open this audit and allow other auditors to request to
              join. All attestations will be undone.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditeeInitiateAudit = ({
  audit,
  disabled,
  setDisabled,
}: {
  audit: AuditI;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleSubmit = (): void => {
    setDisabled(true);
    setContent(<InitiateAudit audit={audit} setDisabled={setDisabled} />);
    toggleOpen();
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
              As the Auditee, once all parties attest and accept the terms, you can kick off the
              audit period. This requires posting data on-chain.
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
    mutationFn: () => leaveAudit(auditId, userId),
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
  user,
  audit,
  disabled,
}: {
  user: Users;
  audit: AuditI;
  disabled: boolean;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleAttestModal = (): void => {
    setContent(<AuditorAttest audit={audit} user={user} />);
    toggleOpen();
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
  user,
  audit,
  actionData,
}: {
  user: Users;
  audit: AuditI;
  actionData: AuditStateI;
}): JSX.Element => {
  // I'll set a global disabled state for all mutations within children.
  const [disabled, setDisabled] = useState(false);

  if (actionData.isTheAuditee) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditeeEditAudit id={audit.id} disabled={disabled} />
        <AuditeeReopenAudit id={audit.id} disabled={disabled} setDisabled={setDisabled} />
        <AuditeeInitiateAudit
          audit={audit}
          disabled={!actionData.allAttested || disabled}
          setDisabled={setDisabled}
        />
      </Column>
    );
  }

  if (actionData.isAnAuditor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorRemoveVerification
          auditId={audit.id}
          userId={user.id}
          disabled={disabled}
          setDisabled={setDisabled}
        />
        <AuditorAttestTerms
          audit={audit}
          user={user}
          disabled={actionData.userAttested || disabled}
        />
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
