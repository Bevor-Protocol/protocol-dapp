/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { User, Profile } from "@prisma/client";
import { useAccount } from "wagmi";

import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Row } from "@/components/Box";
import { cn } from "@/lib/utils";

export const AuditHeader = ({ current }: { current: string }): JSX.Element => {
  const router = useRouter();

  const fetchAudits = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { name } = event.currentTarget.dataset;
    router.replace(`/audits?status=${name}`);
  };

  return (
    <Row className="gap-4">
      <div
        className={cn(
          "text-xs cursor-pointer relative transition-opacity after-underline",
          current != "open" && "opacity-disable",
          current != "open" && "hover:opacity-hover",
          current != "open" && "after:bg-transparent",
        )}
        data-name="open"
        onClick={fetchAudits}
      >
        open
      </div>
      <div
        className={cn(
          "text-xs cursor-pointer relative transition-opacity after-underline",
          current != "pending" && "opacity-disable",
          current != "pending" && "hover:opacity-hover",
          current != "pending" && "after:bg-transparent",
        )}
        data-name="pending"
        onClick={fetchAudits}
      >
        pending
      </div>
      <div
        className={cn(
          "text-xs cursor-pointer relative transition-opacity after-underline",
          current != "closed" && "opacity-disable",
          current != "closed" && "hover:opacity-hover",
          current != "closed" && "after:bg-transparent",
        )}
        data-name="closed"
        onClick={fetchAudits}
      >
        closed
      </div>
    </Row>
  );
};

export const AuditDashboardHeader = ({ display }: { display: string }): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMarkdownChange = (displayType: string): void => {
    if (display == displayType) return;
    const path = `${pathname}?display=${displayType}`;
    router.replace(path, { scroll: false });
  };

  return (
    <Row className="gap-4 justify-start">
      <div
        className={cn(
          "text-xs cursor-pointer relative transition-opacity after-underline",
          display != "details" && "opacity-disable",
          display != "details" && "hover:opacity-hover",
          display != "details" && "after:bg-transparent",
        )}
        onClick={(): void => handleMarkdownChange("details")}
      >
        Details
      </div>
      <div
        className={cn(
          "text-xs cursor-pointer relative transition-opacity after-underline",
          display != "audit" && "opacity-disable",
          display != "audit" && "hover:opacity-hover",
          display != "audit" && "after:bg-transparent",
        )}
        onClick={(): void => handleMarkdownChange("audit")}
      >
        Audit
      </div>
    </Row>
  );
};

export const AuditAuditor = ({
  position,
  auditor,
}: {
  position: string;
  auditor: User & {
    profile: Profile | null;
  };
}): JSX.Element => {
  const [cont, setCont] = useState("");
  const tooltip = useRef<HTMLDivElement>(null);

  const handleToolTip = (event: React.MouseEvent<HTMLElement>): void => {
    if (!tooltip.current) return;
    const { auditoradd } = event.currentTarget.dataset;

    tooltip.current.style.bottom = "110%";
    tooltip.current.style.left = "50%";
    tooltip.current.style.display = "block";
    setCont(auditoradd || "");
  };

  const clearToolTip = (): void => {
    if (!tooltip.current) return;
    tooltip.current.style.display = "none";
    setCont("");
  };
  return (
    <div className="h-fit w-fit relative" style={{ transform: `translateX(${position})` }}>
      <DynamicLink href={`/user/${auditor.address}`}>
        <Icon
          image={auditor.profile?.image}
          size="md"
          seed={auditor.address}
          data-auditoradd={auditor.address}
          onMouseOver={handleToolTip}
          onMouseOut={clearToolTip}
        />
      </DynamicLink>
      <div
        className={cn(
          "absolute hidden text-sm max-w-28 overflow-hidden text-ellipsis bg-dark-primary-20",
          "px-2 py-1 -translate-x-1/2 border border-gray-200/20",
        )}
        ref={tooltip}
      >
        {cont}
      </div>
    </div>
  );
};

export const AuditDashboardBtn = ({
  auditors,
}: {
  auditors: (User & {
    profile: Profile | null;
  })[];
}): JSX.Element => {
  const { address } = useAccount();

  const buttonLabel = (): string => {
    const auditorsAddresses = auditors.map((auditor) => auditor.address);
    if (auditorsAddresses.includes(address?.toString() || "")) {
      return "Withdraw";
      // } else if (data.auditee.toString() === account.toLocaleString()) {
      //   return "Challenge Validity";
    } else {
      return "Disabled";
    }
  };
  return (
    <button
      className="outline-none border-none font-bold rounded-md 
            grad-light py-2 px-5 dim disabled:opacity-disable"
      disabled={true}
    >
      <div className="flex flex-row align-middle gap-1 text-dark text-sm">
        <span>{buttonLabel()}</span>
      </div>
    </button>
  );
};
