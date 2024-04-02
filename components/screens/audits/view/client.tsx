"use client";

import { useRouter, usePathname } from "next/navigation";
import { AuditorStatus, AuditStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/Button";
import { AuditViewDetailedI } from "@/lib/types/actions";
import { useUser } from "@/hooks/contexts";
import DynamicLink from "@/components/Link";
import { auditAddRequest, auditRemoveRequest } from "@/lib/actions/audits";

export const AuditDashboardHeader = ({ display }: { display: string }): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMarkdownChange = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { name } = event.currentTarget.dataset;
    if (name == display) return;
    const path = `${pathname}?display=${name}`;
    router.replace(path, { scroll: false });
  };

  return (
    <Row className="gap-4 justify-start">
      <Toggle onClick={handleMarkdownChange} active={display === "details"} title={"details"} />
      <Toggle onClick={handleMarkdownChange} active={display === "audit"} title={"audit"} />
    </Row>
  );
};

export const AuditDashboardAction = ({ audit }: { audit: AuditViewDetailedI }): JSX.Element => {
  const { user } = useUser();

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { fctType: string; auditId: string; userId: string }) => {
      if (variables.fctType == "add") {
        return auditAddRequest(variables.auditId, variables.userId);
      } else {
        return auditRemoveRequest(variables.auditId, variables.userId);
      }
    },
    onSettled: (data) => {
      console.log(data);
    },
  });

  const auditors = audit.auditors
    .filter((auditor) => auditor.status === AuditorStatus.VERIFIED)
    .map((auditor) => auditor.userId);
  const requesters = audit.auditors
    .filter((auditor) => auditor.status === AuditorStatus.REQUESTED)
    .map((auditor) => auditor.userId);

  if (!user) return <></>;

  const isTheAuditee = audit.auditeeId === user.id;
  const isAnAuditor = auditors.includes(user.id);
  const isRequestor = requesters.includes(user.id);

  return (
    <Row className="gap-4">
      {isTheAuditee && audit.status !== AuditStatus.FINAL && (
        <DynamicLink href={`/audits/edit/${audit.id}`}>
          <Button>Edit Audit</Button>
        </DynamicLink>
      )}
      {isTheAuditee && requesters.length > 0 && (
        <Button disabled={isPending}>Manage Requests</Button>
      )}
      {isRequestor && (
        <Button
          onClick={() => mutate({ fctType: "remove", auditId: audit.id, userId: user.id })}
          disabled={isPending}
        >
          Remove Request to Audit
        </Button>
      )}
      {!isRequestor && audit.status === AuditStatus.OPEN && user.auditorRole && !isTheAuditee && (
        <Button
          onClick={() => mutate({ fctType: "add", auditId: audit.id, userId: user.id })}
          disabled={isPending}
        >
          Request to Audit
        </Button>
      )}
      {isAnAuditor &&
        audit.status !== AuditStatus.FINAL &&
        audit.status !== AuditStatus.ONGOING && (
          <Button disabled={isPending}>Remove me as Auditor</Button>
        )}
      {isTheAuditee && audit.status === AuditStatus.ATTESTATION && (
        <Button disabled={isPending}>Re-open Audit</Button>
      )}
      {!isTheAuditee && audit.status === AuditStatus.FINAL && (
        <Button disabled={isPending}>Challenge Audit</Button>
      )}
    </Row>
  );
};
