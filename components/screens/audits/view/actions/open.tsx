"use client";

import { useMutation } from "@tanstack/react-query";

import { AuditI } from "@/utils/types/prisma";
import { AuditStateI } from "@/utils/types";
import { useModal } from "@/hooks/useContexts";
import { auditController } from "@/actions";
import { Row, Column } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import RequestsEdit from "@/components/Modal/Content/requestsEdit";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";
import { useState } from "react";
import { Users } from "@prisma/client";
import { useToast } from "@/hooks/useContexts";
import ErrorToast from "@/components/Toast/Content/error";

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
  audit: AuditI;
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
  disabled,
  setDisabled,
}: {
  auditId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { setContent, toggleOpen } = useToast();

  const { mutate } = useMutation({
    mutationFn: () => auditController.auditor.deleteRequest(auditId),
    onMutate: () => setDisabled(true),
    onError: (error) => console.log(error),
    onSuccess: (d) => console.log(d),
    onSettled: (data) => {
      console.log(data);
      if (data?.success) {
        setDisabled(false);
      } else {
        console.log("HITS");
        setContent(<ErrorToast text={data?.error ?? "Something went wrong, try again later"} />);
        toggleOpen();
      }
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
  disabled,
  setDisabled,
}: {
  auditId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { setContent, toggleOpen } = useToast();
  const { mutate } = useMutation({
    mutationFn: () => auditController.auditor.addRequest(auditId),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      if (data?.success) {
        setDisabled(false);
      } else {
        setContent(<ErrorToast text={data?.error || "Something went wrong, try again later"} />);
        toggleOpen();
        toggleOpen();
      }
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
  disabled,
  setDisabled,
}: {
  auditId: string;
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { setContent, toggleOpen, setReadyAutoClose } = useToast({
    autoClose: true,
  });

  const { mutate } = useMutation({
    mutationFn: () => auditController.auditor.deleteRequest(auditId),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      if (data?.success) {
        setDisabled(false);
      } else {
        setContent(<ErrorToast text={data?.error ?? "Something went wrong, try again later"} />);
        toggleOpen();
        setReadyAutoClose(true);
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
  const { setContent, toggleOpen } = useToast();

  const { mutate } = useMutation({
    mutationFn: () => auditController.owner.lockAudit(auditId),
    onMutate: () => setDisabled(true),
    onSettled: (data) => {
      if (data?.success) {
        setDisabled(false);
      } else {
        setContent(<ErrorToast text={data?.error || "Something went wrong, try again later"} />);
        toggleOpen();
        toggleOpen();
      }
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
  actionData,
}: {
  user: Users;
  audit: AuditI;
  actionData: AuditStateI;
}): JSX.Element => {
  // All of the possible audit actions to take for OPEN audits.

  // I'll set a global disabled state for all mutations within children.
  const [disabled, setDisabled] = useState(false);

  if (actionData.isTheAuditee) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditeeEditAudit id={audit.id} />
        <AuditeeManageRequest
          audit={audit}
          disabled={!actionData.auditeeCanManageAuditors || disabled}
        />
        <AuditeeLockAudit
          auditId={audit.id}
          disabled={!actionData.auditeeCanLock || disabled}
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
          disabled={disabled}
          setDisabled={setDisabled}
        />
      </Column>
    );
  }

  if (actionData.userIsRequested) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorRemoveRequest auditId={audit.id} disabled={disabled} setDisabled={setDisabled} />
      </Column>
    );
  }

  if (actionData.userIsRejected) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorRejected />
      </Column>
    );
  }

  if (user.auditorRole) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorAddRequest auditId={audit.id} disabled={disabled} setDisabled={setDisabled} />
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
