"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditStatus, Users } from "@prisma/client";

import { AuditI } from "@/lib/types";
import AuditOpenActions from "./open";
import AuditLockedActions from "./locked";
import AuditOngoingActions from "./ongoing";
import AuditChallengeableActions from "./challengeable";
import { getAuditState } from "@/actions/audits/general";

const AuditDashboardActions = ({ audit, user }: { audit: AuditI; user: Users }): JSX.Element => {
  const { data, isFetched } = useQuery({
    queryKey: ["actions", audit.id, user.id],
    queryFn: () => getAuditState(audit.id, user?.id),
    refetchOnWindowFocus: false,
  });

  if (!isFetched || !data) return <></>;

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
