import { AuditStatusType, User } from "@prisma/client";

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
  const state = await auditAction.getState(audit, user);

  if (audit.status === AuditStatusType.DISCOVERY) {
    return <AuditOpenActions user={user} audit={audit} state={state} />;
  }

  if (audit.status === AuditStatusType.ATTESTATION) {
    return <AuditLockedActions audit={audit} state={state} />;
  }

  if (audit.status === AuditStatusType.AUDITING) {
    return <AuditOngoingActions audit={audit} user={user} state={state} />;
  }

  if (audit.status === AuditStatusType.CHALLENGEABLE) {
    return <AuditChallengeableActions />;
  }

  return <></>;
};

export default AuditDashboardActions;
