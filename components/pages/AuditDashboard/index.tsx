"use client";

import { useState, useRef } from "react";
import styled from "styled-components";

import { H3, P, Span } from "@/components/Text";
import { Column, Row } from "@/components/Box";
import { IconLarge, IconSmall, JazziconClient } from "@/components/Icon";
import { ToolTip } from "@/components/Tooltip";
import ProgressBar from "@/components/ProgressBar";
import { ButtonLight } from "@/components/Button";
import { useAccount } from "wagmi";
import ReactMarkdown from "react-markdown";
import { mockAuditInfo, auditNavItems } from "@/utils/constants";
import { useIsMounted } from "@/hooks/useIsMounted";
import { AuditDashI } from "@/utils/types";
import { Audit, AuditContent, AuditFooter, Auditor, AuditorWrapper } from "../Audits";

const AuditDescription = styled(Column)`
  padding: 1rem;
  width: 100%;

  & pre {
    white-space: pre-line;
  }
`;

const NavItem = styled.div<{ $active: boolean }>`
  position: relative;
  opacity: ${({ $active, theme }): number =>
    $active ? theme.opacity.enabled : theme.opacity.disable};
  cursor: pointer;

  border-bottom: 2px solid ${({ $active }): string => ($active ? "white" : "transparent")};

  &:hover {
    opacity: ${({ theme }): number => theme.opacity.enabled};
    transition: opacity 0.25s ease-in-out;
  }
`;

export default ({ audit }: { audit: AuditDashI }): JSX.Element => {
  const [cont, setCont] = useState("");
  const mounted = useIsMounted();
  const [descriptionIndex, setDescriptionIndex] = useState(0);
  const tooltip = useRef<HTMLDivElement>(null);
  const account = useAccount();

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
    if (audit.auditor.toString() === account.toString()) {
      return "Withdraw";
    } else if (audit.auditee.toString() === account.toLocaleString()) {
      return "Challenge Validity";
    } else {
      return "Disabled";
    }
  };

  const descriptions = [mockAuditInfo.description, mockAuditInfo.deliverable];

  return (
    <Column $gap="md">
      <Audit>
        <AuditContent $align="flex-start" $justify="flex-start" $gap="rem2">
          <IconLarge>
            <JazziconClient
              mounted={mounted}
              randVal={Math.round(10000000)}
              paperStyles={{ minWidth: "75px", minHeight: "75px" }}
              diameter={75}
            />
          </IconLarge>
          <div className="text">
            <H3>{audit.auditee}</H3>
            <P>{audit.duration}</P>
          </div>
          <div>${audit.amountTotal.toLocaleString()}</div>
        </AuditContent>
        <ProgressBar />
        <AuditDescription $align="flex-start" $gap="lg">
          <Row $gap="lg" $justify="flex-start" $padding="0 1rem">
            {auditNavItems.map((item, ind) => (
              <NavItem
                onClick={(): void => setDescriptionIndex(ind)}
                $active={descriptionIndex === ind}
                key={ind}
              >
                {item.text}
              </NavItem>
            ))}
          </Row>
          <ReactMarkdown>{descriptions[descriptionIndex]}</ReactMarkdown>
        </AuditDescription>
        <AuditFooter $disabled={!audit.withdrawlPaused} $justify="flex-start" $gap="rem2">
          <Span>{audit.withdrawlPaused}</Span>
          <AuditorWrapper>
            <Span>auditors:</Span>
            {!audit.withdrawlPaused ? (
              <Auditor $offset={`-${0 * 12.5}px`} key={0}>
                <IconSmall
                  data-auditor={audit.auditor}
                  onMouseOver={handleToolTip}
                  onMouseOut={clearToolTip}
                >
                  <JazziconClient mounted={mounted} randVal={Math.round(3 * 10000000)} />
                </IconSmall>
              </Auditor>
            ) : (
              <Span>TBD</Span>
            )}
          </AuditorWrapper>
          <ToolTip ref={tooltip}>{cont}</ToolTip>
          <ButtonLight $hover="dim" disabled={true}>
            {buttonLabel()}
          </ButtonLight>
        </AuditFooter>
      </Audit>
    </Column>
  );
};
