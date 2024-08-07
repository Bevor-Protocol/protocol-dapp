"use client";

import { Users } from "@prisma/client";

import { Row, Column } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";
import { useModal } from "@/hooks/useContexts";
import UploadFindings from "@/components/Modal/Content/uploadFindings";
import { AuditI } from "@/utils/types/prisma";
import { AuditStateI } from "@/utils/types";

import RevealAudit from "@/components/Modal/Content/onchain/revealAudit";

const AuditorSubmitFindings = ({
  auditId,
  disabled,
}: {
  auditId: string;
  disabled: boolean;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleUploadModal = (): void => {
    setContent(<UploadFindings auditId={auditId} />);
    toggleOpen();
  };
  return (
    <Row className="items-center gap-4">
      <Button className="flex-1" onClick={handleUploadModal} disabled={disabled}>
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
  );
};

const AuditeePendingFindings = (): JSX.Element => {
  return (
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
              This audit is still pending the submission of the audit findings from all auditors.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditeeLockStake = ({
  audit,
  user,
  // disabled,
  // setDisabled,
}: {
  audit: AuditI;
  user: Users;
  // disabled: boolean;
  // setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleSubmit = (): void => {
    setContent(<RevealAudit audit={audit} user={user} />);
    toggleOpen();
  };

  return (
    <Row className="items-center gap-4">
      <Button onClick={handleSubmit} className="flex-1">
        Unlock Findings
      </Button>
      <Tooltip.Reference>
        <Tooltip.Trigger>
          <Info height="1rem" width="1rem" />
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="end">
          <div className="bg-dark shadow rounded-lg cursor-default min-w-48">
            <div className="p-2">
              All auditors have submitted their audit. In order to view them, you must put up your
              stake. You will have a period of time to implement the findings before the findings
              become visible to everyone. Do NOT share the findings with anyone, this will only put
              your protocol at risk.
            </div>
          </div>
        </Tooltip.Content>
      </Tooltip.Reference>
    </Row>
  );
};

const AuditOngoingActions = ({
  user,
  audit,
  actionData,
}: {
  user: Users;
  audit: AuditI;
  actionData: AuditStateI;
}): JSX.Element => {
  if (actionData.isAnAuditor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorSubmitFindings auditId={audit.id} disabled={actionData.userSubmitted} />
      </Column>
    );
  }

  if (actionData.isTheAuditee) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        {!actionData.allSubmitted && <AuditeePendingFindings />}
        {actionData.allSubmitted && <AuditeeLockStake user={user} audit={audit} />}
      </Column>
    );
  }

  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      <Button disabled>Ongoing Audit</Button>
    </Column>
  );
};

export default AuditOngoingActions;
