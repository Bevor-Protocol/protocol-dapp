/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { User, Profile } from "@prisma/client";
import { useAccount } from "wagmi";
import clsx from "clsx";

import { Row } from "@/components/Box";
import { ToolTip } from "@/components/Tooltip";
import { FallbackIcon } from "@/components/Icon";
import { UnstyledNextLink } from "@/components/Link";

export const AuditHeader = ({ current }: { current: string }): JSX.Element => {
  const router = useRouter();

  const fetchAudits = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { name } = event.currentTarget.dataset;
    router.replace(`/audits?status=${name}`);
  };

  return (
    <div className="flex flex-row gap-4">
      <div
        className={clsx(
          "text-xs cursor-pointer relative transition-opacity",
          "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1px] after:bg-current",
          {
            "opacity-disable": current != "open",
            "hover:opacity-hover": current != "open",
            "after:bg-transparent": current != "open",
          },
        )}
        data-name="open"
        onClick={fetchAudits}
      >
        open
      </div>
      <div
        className={clsx(
          "text-xs cursor-pointer relative transition-opacity",
          "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1px] after:bg-current",
          {
            "opacity-disable": current != "pending",
            "hover:opacity-hover": current != "pending",
            "after:bg-transparent": current != "pending",
          },
        )}
        data-name="pending"
        onClick={fetchAudits}
      >
        pending
      </div>
      <div
        className={clsx(
          "text-xs cursor-pointer relative transition-opacity",
          "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1px] after:bg-current",
          {
            "opacity-disable": current != "closed",
            "hover:opacity-hover": current != "closed",
            "after:bg-transparent": current != "closed",
          },
        )}
        data-name="closed"
        onClick={fetchAudits}
      >
        closed
      </div>
    </div>
  );
};

export const AuditDashboardHeader = ({ display }: { display: string }): JSX.Element => {
  const router = useRouter();
  const pathname = usePathname();

  const handleMarkdownChange = (displayType: string): void => {
    if (display == displayType) return;
    const path = `${pathname}?display=${displayType}`;
    router.replace(path);
  };

  return (
    <Row $gap="rem1" $justify="flex-start">
      <div
        className={clsx(
          "text-xs cursor-pointer relative transition-opacity",
          "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1px] after:bg-current",
          {
            "opacity-disable": display != "details",
            "hover:opacity-hover": display != "details",
            "after:bg-transparent": display != "details",
          },
        )}
        onClick={(): void => handleMarkdownChange("details")}
      >
        Details
      </div>
      <div
        className={clsx(
          "text-xs cursor-pointer relative transition-opacity",
          "after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1px] after:bg-current",
          {
            "opacity-disable": display != "audit",
            "hover:opacity-hover": display != "audit",
            "after:bg-transparent": display != "audit",
          },
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
    tooltip.current.style.left = "0px";
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
      <UnstyledNextLink href={`/user/${auditor.address}`}>
        <FallbackIcon
          image={auditor.profile?.image}
          size="md"
          address={auditor.address}
          data-auditoradd={auditor.address}
          onMouseOver={handleToolTip}
          onMouseOut={clearToolTip}
        />
      </UnstyledNextLink>
      <ToolTip ref={tooltip}>{cont}</ToolTip>
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
