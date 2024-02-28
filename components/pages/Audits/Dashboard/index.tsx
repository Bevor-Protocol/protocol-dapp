"use client";

import { useState, useRef } from "react";
import styled from "styled-components";
import { useRouter, usePathname } from "next/navigation";
import { Audit, Profile, Terms, User } from "@prisma/client";

import { P, Span, Strong } from "@/components/Text";
import { Column, Row, Card } from "@/components/Box";
import { Avatar } from "@/components/Icon";
import { ToolTip } from "@/components/Tooltip";
import ProgressBar from "@/components/ProgressBar";
import { ButtonLight } from "@/components/Button";
import { useAccount } from "wagmi";
import { Markdown } from "@/components/Markdown";
import { AuditFooter, Auditor, AuditorWrapper, AuditNav } from "../styled";

const AuditDescription = styled(Column)`
  padding: 1rem;
  width: 100%;

  & pre {
    white-space: pre-line;
  }
`;

interface AuditRelation extends Audit {
  auditors: (User & {
    profile: Profile | null;
  })[];
  auditee: User & {
    profile: Profile | null;
  };
  terms: Terms | null;
}

type Props = {
  audit: AuditRelation;
  content: string;
  display: string;
};

const AuditDashboard = ({ audit, content, display }: Props): JSX.Element => {
  const [cont, setCont] = useState("");
  const tooltip = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const handleToolTip = (event: React.MouseEvent<HTMLElement>): void => {
    if (!tooltip.current) return;
    const { auditor } = event.currentTarget.dataset;
    const { x, y } = event.currentTarget.getBoundingClientRect();
    const { scrollY } = window;

    tooltip.current.style.top = `${scrollY + y - 14 - 8 - 8}px`;
    tooltip.current.style.left = `${x}px`;
    tooltip.current.style.display = "block";
    setCont(auditor || "");
  };

  const clearToolTip = (): void => {
    if (!tooltip.current) return;
    tooltip.current.style.display = "none";
    setCont("");
  };

  const buttonLabel = (): string => {
    const auditors = audit.auditors.map((auditor) => auditor.address);
    if (auditors.includes(address?.toString() || "")) {
      return "Withdraw";
      // } else if (data.auditee.toString() === account.toLocaleString()) {
      //   return "Challenge Validity";
    } else {
      return "Disabled";
    }
  };

  const handleMarkdownChange = (displayType: string): void => {
    if (display == displayType) return;
    const path = `${pathname}?display=${displayType}`;
    router.replace(path);
  };

  return (
    <Column $gap="md">
      <Card $width="100%" $padding="0px">
        <Row $align="flex-start" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
          <Avatar $size="lg" $seed={audit.auditee.address.replace(/\s/g, "")} />
          <Column $justify="flex-start" $align="flex-start">
            <Row $justify="space-between" $width="100%">
              <P>
                <Strong $large>{audit.title}</Strong>
              </P>
              <div>${audit.terms?.price.toLocaleString()}</div>
            </Row>
            <P>{audit.description}</P>
            <P>Months: {audit.terms?.duration}</P>
            <P>Created: {new Date(audit.createdAt).toLocaleDateString()}</P>
          </Column>
        </Row>
        <ProgressBar />
        <AuditDescription $align="flex-start" $gap="lg">
          <Row $gap="rem1" $justify="flex-start">
            <AuditNav
              onClick={(): void => handleMarkdownChange("details")}
              $active={display === "details"}
            >
              Details
            </AuditNav>
            <AuditNav
              onClick={(): void => handleMarkdownChange("audit")}
              $active={display === "audit"}
            >
              Audit
            </AuditNav>
          </Row>
          <Markdown dangerouslySetInnerHTML={{ __html: content }} />
        </AuditDescription>
        <AuditFooter $justify="space-between" $gap="rem2" $padding="0.5rem 1rem" $width="100%">
          <AuditorWrapper>
            <Span>auditors:</Span>
            {audit.auditors.map((auditor, ind: number) => (
              <Auditor $offset={`-${ind * 12.5}px`} key={ind}>
                <Avatar
                  data-auditor={auditor.address}
                  $size="sm"
                  $seed={auditor.address.replace(/\s/g, "")}
                  onMouseOver={handleToolTip}
                  onMouseOut={clearToolTip}
                />
              </Auditor>
            ))}
          </AuditorWrapper>
          <ToolTip ref={tooltip}>{cont}</ToolTip>
          <ButtonLight $hover="dim" disabled={true}>
            {buttonLabel()}
          </ButtonLight>
        </AuditFooter>
      </Card>
    </Column>
  );
};

export default AuditDashboard;
