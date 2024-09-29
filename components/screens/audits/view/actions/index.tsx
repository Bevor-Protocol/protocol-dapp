import { AuditStatus, User } from "@prisma/client";

import { auditAction } from "@/actions";
import { AuditI } from "@/utils/types/prisma";
import AuditChallengeableActions from "./challengeable";
import AuditLockedActions from "./locked";
import AuditOngoingActions from "./ongoing";
import AuditOpenActions from "./open";

const AuditDashboardActions = async ({
  audit,
  user,
}: {
  audit: AuditI;
  user: User;
}): Promise<JSX.Element> => {
  const data = await auditAction.getState(audit.id);

  if (audit.status === AuditStatus.DISCOVERY) {
    return <AuditOpenActions user={user} audit={audit} actionData={data} />;
  }

  if (audit.status === AuditStatus.ATTESTATION) {
    return <AuditLockedActions audit={audit} actionData={data} />;
  }

  if (audit.status === AuditStatus.AUDITING) {
    return <AuditOngoingActions audit={audit} user={user} actionData={data} />;
  }

  if (audit.status === AuditStatus.CHALLENGEABLE) {
    return <AuditChallengeableActions />;
  }

  return <></>;
};

export default AuditDashboardActions;
