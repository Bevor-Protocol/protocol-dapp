"use client";

import { Auditors } from "@prisma/client";

import { Row, Column } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";
import { useModal } from "@/lib/hooks";
import UploadFindings from "@/components/Modal/Content/uploadFindings";

const AuditorSubmitFindings = ({
  auditId,
  userId,
}: {
  auditId: string;
  userId: string;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleUploadModal = (): void => {
    setContent(<UploadFindings auditId={auditId} userId={userId} />);
    toggleOpen();
  };
  return (
    <Row className="items-center gap-4">
      <Button className="flex-1" onClick={handleUploadModal}>
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

const AuditorUpdateFindings = ({
  auditId,
  userId,
}: {
  auditId: string;
  userId: string;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleUploadModal = (): void => {
    setContent(<UploadFindings auditId={auditId} userId={userId} initial />);
    toggleOpen();
  };
  return (
    <Row className="items-center gap-4">
      <Button className="flex-1" onClick={handleUploadModal}>
        Update Findings
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

const AuditOngoingActions = ({
  auditId,
  userId,
  verifiedAuditors,
}: {
  auditId: string;
  userId: string;
  verifiedAuditors: Auditors[];
}): JSX.Element => {
  const isAnAuditor = verifiedAuditors.findIndex((auditor) => auditor.userId == userId) > -1;
  const auditorSubmitted =
    verifiedAuditors.findIndex((auditor) => auditor.userId == userId && !!auditor.findings) > -1;
  const auditorNotSubmitted =
    verifiedAuditors.findIndex((auditor) => auditor.userId == userId && !auditor.findings) > -1;

  if (isAnAuditor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        {auditorNotSubmitted && <AuditorSubmitFindings auditId={auditId} userId={userId} />}
        {auditorSubmitted && <AuditorUpdateFindings auditId={auditId} userId={userId} />}
      </Column>
    );
  }

  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      <AuditeePendingFindings />
    </Column>
  );
};

export default AuditOngoingActions;
