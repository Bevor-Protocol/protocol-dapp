import { AuditStatus, Users } from "@prisma/client";

import { AuditI } from "@/utils/types/prisma";
import AuditOpenActions from "./open";
import AuditLockedActions from "./locked";
import AuditOngoingActions from "./ongoing";
import AuditChallengeableActions from "./challengeable";
import { auditController } from "@/actions";

const AuditDashboardActions = async ({
  audit,
  user,
}: {
  audit: AuditI;
  user: Users;
}): Promise<JSX.Element> => {
  const data = await auditController.getState(audit.id);

  if (audit.status === AuditStatus.DISCOVERY) {
    return <AuditOpenActions user={user} audit={audit} actionData={data} />;
  }

  if (audit.status === AuditStatus.ATTESTATION) {
    return <AuditLockedActions user={user} audit={audit} actionData={data} />;
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
