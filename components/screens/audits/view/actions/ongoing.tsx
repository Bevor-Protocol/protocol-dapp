"use client";

import { Auditors, Users } from "@prisma/client";

import { Row, Column } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Tooltip from "@/components/Tooltip";
import { Info } from "@/assets";

const AuditorSubmitFindings = (): JSX.Element => {
  return (
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
  user,
  verifiedAuditors,
}: {
  user: Users;
  verifiedAuditors: Auditors[];
}): JSX.Element => {
  const isAnAuditor = verifiedAuditors.filter((auditor) => auditor.userId == user.id).length > 0;

  if (isAnAuditor) {
    return (
      <Column className="gap-2 items-end w-fit *:w-full">
        <AuditorSubmitFindings />
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
