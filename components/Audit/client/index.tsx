"use client";

import * as Tooltip from "@/components/Tooltip";
import { UserProfile } from "@/lib/types/actions";
import DynamicLink from "@/components/Link";
import { Icon } from "@/components/Icon";
import { cn, trimAddress } from "@/lib/utils";

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
            <Icon image={auditor.profile?.image} size="md" seed={auditor.address} />
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
