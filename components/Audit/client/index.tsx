"use client";

import { useRouter, usePathname } from "next/navigation";

import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import * as Tooltip from "@/components/Tooltip";
import { cn, trimAddress } from "@/lib/utils";
import { Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { Button } from "@/components/Button";
import { AuditFull, UserProfile } from "@/lib/types/actions";
import { useUser } from "@/hooks/contexts";

export const AuditAuditor = ({
  position,
  auditor,
}: {
  position: string;
  auditor: UserProfile;
}): JSX.Element => {
  return (
    <div style={{ transform: `translateX(${position})` }}>
      <DynamicLink href={`/user/${auditor.address}`}>
        <Tooltip.Reference>
          <Tooltip.Trigger>
            <Icon
              image={auditor.profile?.image}
              size="md"
              seed={auditor.address}
              data-auditoradd={auditor.address}
            />
          </Tooltip.Trigger>
          <Tooltip.Content
            className={cn(
              "text-xs max-w-28 overflow-hidden text-ellipsis bg-dark-primary-20",
              "px-2 py-1 -translate-x-1/2 border border-gray-200/20 rounded-lg",
              "bottom-full left-1/2",
            )}
          >
            {trimAddress(auditor.address)}
          </Tooltip.Content>
        </Tooltip.Reference>
      </DynamicLink>
    </div>
  );
};

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
      {isAuditee && !audit.isLocked && <Button>Edit Audit</Button>}
      {!isAuditee && !isAuditor && !audit.isLocked && <Button>Request to Audit</Button>}
      {!isAuditor && audit.isLocked && !audit.isFinal && (
        <Button disabled={true}>Audit Locked</Button>
      )}
      {isAuditor && audit.isLocked && !audit.isFinal && <Button>Add Audit Findings</Button>}
      {audit.isFinal && <Button>See Audit Findings</Button>}
    </div>
  );
};
