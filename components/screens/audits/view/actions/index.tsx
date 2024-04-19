"use client";

import { useQuery } from "@tanstack/react-query";
import { AuditStatus } from "@prisma/client";

import { AuditI } from "@/lib/types";
import { useUser } from "@/lib/hooks";
import { Column } from "@/components/Box";
import { Skeleton } from "@/components/Loader";
import AuditOpenActions from "./open";
import AuditLockedActions from "./locked";
import AuditOngoingActions from "./ongoing";
import AuditFinalActions from "./final";
import { getAuditState } from "@/actions/audits/general";

const AuditDashboardActions = ({ audit }: { audit: AuditI }): JSX.Element => {
  const { user, isFetchedAfterMount } = useUser();

  const { data, isPending } = useQuery({
    queryKey: ["actions", audit.id, user?.id ?? ""],
    queryFn: () => getAuditState(audit.id, user?.id),
    refetchOnWindowFocus: false,
  });

  if (!isFetchedAfterMount || isPending || !data) {
    return (
      <Column className="gap-2 items-end">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </Column>
    );
  }

  if (!user) return <></>;

  if (audit.status === AuditStatus.DISCOVERY) {
    return <AuditOpenActions user={user} audit={audit} actionData={data} />;
  }

  if (audit.status === AuditStatus.ATTESTATION) {
    return <AuditLockedActions user={user} audit={audit} actionData={data} />;
  }

  if (audit.status === AuditStatus.AUDITING) {
    return <AuditOngoingActions auditId={audit.id} userId={user.id} actionData={data} />;
  }

  return <AuditFinalActions />;
};

export default AuditDashboardActions;
