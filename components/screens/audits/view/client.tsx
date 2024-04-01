"use client";

import { useRouter, usePathname } from "next/navigation";

import { Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/Button";
import { AuditFull } from "@/lib/types/actions";
import { useUser } from "@/hooks/contexts";
import DynamicLink from "@/components/Link";

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

export const AuditDashboardAction = ({ audit }: { audit: AuditFull }): JSX.Element => {
  const { user } = useUser();

  const auditors = audit.auditors.map((auditor) => auditor.id);

  if (!user) return <></>;

  const isAuditee = audit.auditeeId === user.id;
  const isAuditor = auditors.includes(user.id);

  return (
    <div>
      {isAuditee && !audit.isLocked && (
        <DynamicLink href={`/audits/edit/${audit.id}`}>
          <Button>Edit Audit</Button>
        </DynamicLink>
      )}
      {!isAuditee && !isAuditor && !audit.isLocked && <Button>Request to Audit</Button>}
      {!isAuditor && audit.isLocked && !audit.isFinal && (
        <Button disabled={true}>Audit Locked</Button>
      )}
      {isAuditor && audit.isLocked && !audit.isFinal && <Button>Add Audit Findings</Button>}
      {audit.isFinal && <Button>See Audit Findings</Button>}
    </div>
  );
};
