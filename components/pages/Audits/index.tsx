"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styled, { CSSProp } from "styled-components";

import { P, Span, Strong } from "@/components/Text";
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
  height: 100%;
`;

export const Audit = styled(Column)<{ $cursor?: string; $hover?: boolean }>`
  background: ${({ theme }): string => theme.bg};
  border-radius: 10px;
  box-shadow: ${({ theme }): string => theme.boxShadow};
  width: 100%;
  cursor: ${({ $cursor }): string => $cursor ?? "default"};

  ${({ $hover }): CSSProp => $hover && hoverBg}

  & > a {
    width: 100%;
  }
`;

export const AuditNav = styled.div<{ $active: boolean }>`
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;
  opacity: ${({ theme, $active }): number => ($active ? 1 : theme.opacity.disable)};
  transition: opacity ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover {
    opacity: ${({ theme, $active }): number => !$active && theme.opacity.hover};
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${({ $active }): string => ($active ? "currentcolor" : "transparent")};
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

  const fetchAudits = (event: React.MouseEvent<HTMLDivElement>): void => {
    const { name } = event.currentTarget.dataset;
    router.replace(`/audits?status=${name}`);
  };

  return (
    <Column $gap="rem2">
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
      <Column $gap="rem1">
        {arr.map((audit, ind) => (
          <Audit key={ind} $hover>
            <Row $align="stretch" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
              <IconLarge>
                <JazziconClient
                  mounted={mounted}
                  randVal={ind / arr.length}
                  diameter={75}
                  paperStyles={{
                    height: "100%",
                    width: "100%",
                  }}
                />
              </IconLarge>
              <Column $justify="flex-start" $align="flex-start">
                <Row $justify="space-between" $width="100%">
                  <P>
                    <Strong $large>{audit.auditee}</Strong>
                  </P>
                  <div>${audit.money.toLocaleString()}</div>
                </Row>
                <P>{audit.description}</P>
              </Column>
            </Row>
            <AuditFooter $disabled={audit.status !== "closed"} $justify="flex-start" $gap="rem2">
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
