"use client";

import { Auditors, AuditStatus } from "@prisma/client";

import { AuditViewDetailedI } from "@/lib/types";
import { useUser } from "@/lib/hooks";
import { Column } from "@/components/Box";
import { Skeleton } from "@/components/Loader";
import AuditOpenActions from "./open";
import AuditLockedActions from "./locked";
import AuditOngoingActions from "./ongoing";
import AuditFinalActions from "./final";

const AuditDashboardActions = ({
  audit,
  verifiedAuditors,
  rejectedAuditors,
  requestedAuditors,
}: {
  audit: AuditViewDetailedI;
  verifiedAuditors: Auditors[];
  rejectedAuditors: Auditors[];
  requestedAuditors: Auditors[];
}): JSX.Element => {
  const { user, isFetchedAfterMount } = useUser();

  if (!isFetchedAfterMount) {
    return (
      <Column className="gap-2 items-end">
        <Skeleton className="h-9 w-20 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </Column>
    );
  }

  if (!user) return <></>;

  if (audit.status === AuditStatus.OPEN) {
    return (
      <AuditOpenActions
        user={user}
        audit={audit}
        verifiedAuditors={verifiedAuditors}
        rejectedAuditors={rejectedAuditors}
        requestedAuditors={requestedAuditors}
      />
    );
  }

  if (audit.status === AuditStatus.ATTESTATION) {
    return <AuditLockedActions user={user} audit={audit} verifiedAuditors={verifiedAuditors} />;
  }

  if (audit.status === AuditStatus.ONGOING) {
    return (
      <AuditOngoingActions
        auditId={audit.id}
        userId={user.id}
        verifiedAuditors={verifiedAuditors}
      />
    );
  }

  return <AuditFinalActions />;
};

export default AuditDashboardActions;
