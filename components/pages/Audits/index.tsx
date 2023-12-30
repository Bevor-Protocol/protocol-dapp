"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";

import { H2, H3, P, Span, Strong } from "@/components/Text";
import { hoverBg } from "@/components/Common";
import { Column, Row } from "@/components/Box";
import { IconLarge, IconSmall } from "@/components/Icon";
import { ToolTip } from "@/components/Tooltip";
import { JazziconClient } from "@/components/Icon";
import { AuditI } from "@/utils/types";
import SmartLink from "@/components/Link";
import { useIsMounted } from "@/hooks/useIsMounted";

export const AuditHolder = styled(Column)`
  width: min(100%, 1000px);
`;

export const AuditSection = styled.div`
  width: 100%;

  & ${H2} {
    margin-bottom: 1rem;
  }
`;

export const Audit = styled(Column)<{ $cursor?: string }>`
  background: ${({ theme }): string => theme.bg};
  border-radius: 10px;
  box-shadow: ${({ theme }): string => theme.boxShadow};
  width: 100%;
  cursor: ${({ $cursor }): string => $cursor ?? "default"};

  ${hoverBg}

  & > a {
    width: 100%;
  }
`;

export const AuditContent = styled(Row)`
  padding: 1rem;
  width: 100%;

  & :last-child {
    margin-left: auto;
  }

  & .text {
    max-width: 40%;

    & ${H3} {
      margin-bottom: 0.5rem;
    }
  }
`;

export const AuditFooter = styled(Row)<{ $disabled: boolean }>`
  border-top: 1px solid ${({ theme }): string => theme.greyBorder};
  padding: 0.5rem 1rem;
  width: 100%;

  & :last-child {
    margin-left: auto;
  }

  & .competition {
    opacity: ${({ theme, $disabled }): number => ($disabled ? theme.opacity.disable : 1)};
  }

  & .competition:hover {
    opacity: ${({ theme, $disabled }): number => !$disabled && theme.opacity.hover};
  }
`;

export const Auditor = styled.div<{ $offset: string }>`
  height: fit-content;
  width: fit-content;
  transform: ${({ $offset }): string => `translateX(${$offset})`};
  transition: transform ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};
`;

export const AuditorWrapper = styled(Row)`
  & span {
    margin-right: 10px;
  }

  &:hover ${Auditor} {
    transform: translateX(0);
  }
`;

export default ({ arr, current }: { arr: AuditI[]; current: string }): JSX.Element => {
  const [cont, setCont] = useState("");
  const mounted = useIsMounted();
  const tooltip = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  return (
    <Column $gap="rem1">
      <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
        <div
          style={{ color: current == "open" ? "white" : "grey" }}
          onClick={() => router.replace("/audits?status=open")}
        >
          open
        </div>
        <div
          style={{ color: current == "pending" ? "white" : "grey" }}
          onClick={() => router.replace("/audits?status=pending")}
        >
          pending
        </div>
        <div
          style={{ color: current == "closed" ? "white" : "grey" }}
          onClick={() => router.replace("/audits?status=closed")}
        >
          closed
        </div>
      </div>
      <Column $gap="rem1">
        {arr.map((audit, ind) => (
          <Audit key={ind}>
            <AuditContent $align="flex-start" $justify="flex-start" $gap="rem2">
              <IconLarge>
                <JazziconClient
                  mounted={mounted}
                  randVal={ind / arr.length}
                  paperStyles={{ minWidth: "75px", minHeight: "75px" }}
                  diameter={75}
                />
              </IconLarge>
              <div className="text">
                <P>
                  <Strong $large>{audit.auditee}</Strong>
                </P>
                <P>{audit.description}</P>
              </div>
              <div>${audit.money.toLocaleString()}</div>
            </AuditContent>
            <AuditFooter $disabled={audit.status !== "closed"} $justify="flex-start" $gap="rem2">
              <Span $secondary>{audit.status}</Span>
              <AuditorWrapper>
                <Span $secondary>auditors:</Span>
                {audit.status !== "soon" ? (
                  audit.auditors.map((auditor, ind2) => (
                    <Auditor $offset={`-${ind2 * 12.5}px`} key={ind2}>
                      <IconSmall
                        data-auditor={auditor}
                        key={ind2}
                        onMouseOver={handleToolTip}
                        onMouseOut={clearToolTip}
                      >
                        <JazziconClient mounted={mounted} randVal={ind2 / arr.length} />
                      </IconSmall>
                    </Auditor>
                  ))
                ) : (
                  <Span>TBD</Span>
                )}
              </AuditorWrapper>
              <ToolTip ref={tooltip}>{cont}</ToolTip>
              <SmartLink
                external={false}
                href={`/audits/${ind}`}
                disabled={audit.status !== "closed"}
              >
                <Span className="competition">View Audit</Span>
              </SmartLink>
            </AuditFooter>
          </Audit>
        ))}
      </Column>
    </Column>
  );
};
