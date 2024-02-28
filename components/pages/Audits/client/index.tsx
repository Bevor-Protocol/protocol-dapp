/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { User, Profile } from "@prisma/client";

import { Row } from "@/components/Box";
import { AuditNav, Auditor } from "../styled";
import { ToolTip } from "@/components/Tooltip";
import { Icon, Avatar } from "@/components/Icon";

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
      {auditor.profile?.image ? (
        <Icon $size="sm">
          <img
            src={auditor.profile.image}
            alt="user icon"
            style={{ height: "100%", width: "100%" }}
            data-auditoradd={auditor.address}
            onMouseOver={handleToolTip}
            onMouseOut={clearToolTip}
          />
        </Icon>
      ) : (
        <Avatar
          data-auditoradd={auditor.address}
          $size="sm"
          $seed={auditor.address.replace(/\s/g, "")}
          onMouseOver={handleToolTip}
          onMouseOut={clearToolTip}
        />
      )}
      <ToolTip ref={tooltip}>{cont}</ToolTip>
    </Auditor>
  );
};
