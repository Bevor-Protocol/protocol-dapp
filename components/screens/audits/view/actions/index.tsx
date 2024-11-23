import { auditAction } from "@/actions";
import { AuditStatusEnum } from "@/utils/types/enum";
import { AuditWithOwnerSecure } from "@/utils/types/relations";
import { User } from "@/utils/types/tables";
import AuditChallengeableActions from "./challengeable";
import AuditLockedActions from "./locked";
import AuditOngoingActions from "./ongoing";
import AuditOpenActions from "./open";

const AuditDashboardActions = async ({
  audit,
  user,
}: {
  audit: AuditWithOwnerSecure;
  user: User;
}): Promise<JSX.Element> => {
  const state = await auditAction.getState(audit.id, user);

  if (audit.status === AuditStatusEnum.DISCOVERY) {
    return <AuditOpenActions user={user} audit={audit} state={state} />;
  }

  if (audit.status === AuditStatusEnum.ATTESTATION) {
    return <AuditLockedActions audit={audit} state={state} />;
  }

  if (audit.status === AuditStatusEnum.AUDITING) {
    return <AuditOngoingActions audit={audit} user={user} state={state} />;
  }

  if (audit.status === AuditStatusEnum.CHALLENGEABLE) {
    return <AuditChallengeableActions />;
  }

  return <></>;
};

export default AuditDashboardActions;
