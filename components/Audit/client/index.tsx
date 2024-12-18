"use client";

import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import * as Tooltip from "@/components/Tooltip";
import { cn } from "@/utils";
import { trimAddress } from "@/utils/formatters";
import { User } from "@/utils/types/tables";

export const AuditAuditor = ({
  position,
  auditor,
}: {
  position: string;
  auditor: User;
}): JSX.Element => {
  return (
    <div style={{ transform: `translateX(${position})` }}>
      <DynamicLink href={`/users/${auditor.address}`}>
        <Tooltip.Reference>
          <Tooltip.Trigger>
            <Icon image={auditor.image} size="md" seed={auditor.address} />
          </Tooltip.Trigger>
          <Tooltip.Content side="top" align="center">
            <div
              className={cn(
                "max-w-28 text-ellipsis bg-dark-primary-20",
                "px-2 py-1 border border-gray-200/20 rounded-lg",
              )}
            >
              {trimAddress(auditor.address)}
            </div>
          </Tooltip.Content>
        </Tooltip.Reference>
      </DynamicLink>
    </div>
  );
};
