/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef } from "react";
import { User, Profile } from "@prisma/client";
import { useAccount } from "wagmi";

import { Row } from "@/components/Box";
import { AuditNav, Auditor } from "../styled";
import { ToolTip } from "@/components/Tooltip";
import { FallbackIcon } from "@/components/Icon";
import { ButtonLight } from "@/components/Button";
import { UnstyledNextLink } from "@/components/Link";

export const AuditHeader = ({ current }: { current: string }): JSX.Element => {
  const router = useRouter();

  const fetchAudits = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { name } = event.currentTarget.dataset;
    router.replace(`/audits?status=${name}`);
  };

  return (
    <Row $gap="rem1">
      <AuditNav $active={current == "open"} data-name="open" onClick={fetchAudits}>
        open
      </AuditNav>
      <AuditNav $active={current == "pending"} data-name="pending" onClick={fetchAudits}>
        pending
      </AuditNav>
      <AuditNav $active={current == "closed"} data-name="closed" onClick={fetchAudits}>
        closed
      </AuditNav>
    </Row>
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
      <AuditNav
        onClick={(): void => handleMarkdownChange("details")}
        $active={display === "details"}
      >
        Details
      </AuditNav>
      <AuditNav onClick={(): void => handleMarkdownChange("audit")} $active={display === "audit"}>
        Audit
      </AuditNav>
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
    <Auditor $offset={position}>
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
    </Auditor>
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
    <ButtonLight $hover="dim" disabled={true}>
      {buttonLabel()}
    </ButtonLight>
  );
};
