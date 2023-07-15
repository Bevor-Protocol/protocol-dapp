"use client";

import { useState, useRef } from "react";
import styled from "styled-components";

import { H2, H3, P, Span } from "@/components/Text";
import { Column, Row } from "@/components/Box";
import { IconLarge, IconSmall } from "@/components/Icon";
import { ToolTip } from "@/components/Tooltip";
import { JazziconClient } from "@/components/Icon";
import { AuditI } from "@/utils/types";
import { useIsMounted } from "@/hooks/useIsMounted";

export const AuditSection = styled.div`
  width: 100%;
  margin: 2rem;

  & ${H2} {
    margin-bottom: 1rem;
  }
`;

const Audit = styled(Column)`
  background: ${({ theme }): string => theme.cardBg};
  border-radius: 10px;
  border: 2px solid ${({ theme }): string => theme.greyBorder};
  width: 100%;
`;

const AuditContent = styled(Row)`
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

const AuditFooter = styled(Row)<{ $disabled: boolean }>`
  border-top: 1px solid ${({ theme }): string => theme.greyBorder};
  height: 40px;
  padding: 0 1rem;
  width: 100%;

  & :last-child {
    margin-left: auto;
  }

  & .competition {
    opacity: ${({ $disabled }): number => ($disabled ? 0.5 : 1)};
  }
`;

const AuditAuditors = styled(Row)`
  & span {
    margin-right: 10px;
  }

  &:hover ${IconSmall} {
    width: 25px;
    margin-right: 5px;
  }
`;

export default ({ arr }: { arr: AuditI[] }): JSX.Element => {
  const [cont, setCont] = useState("");
  const mounted = useIsMounted();
  const tooltip = useRef<HTMLDivElement>(null);

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
    <Column $gap="md">
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
              <H3>{audit.auditee}</H3>
              <P>{audit.description}</P>
            </div>
            <div>${audit.money.toLocaleString()}</div>
          </AuditContent>
          <AuditFooter $disabled={audit.status !== "closed"} $justify="flex-start" $gap="rem2">
            <Span>{audit.status}</Span>
            <AuditAuditors>
              <Span>auditors:</Span>
              {audit.status !== "soon" ? (
                audit.auditors.map((auditor, ind2) => (
                  <IconSmall
                    data-auditor={auditor}
                    key={ind2}
                    onMouseOver={handleToolTip}
                    onMouseOut={clearToolTip}
                  >
                    <JazziconClient
                      mounted={mounted}
                      randVal={ind2 / arr.length}
                      paperStyles={{
                        minWidth: "25px",
                        minHeight: "25px",
                        maxWidth: "25px",
                        maxHeight: "25px",
                      }}
                    />
                  </IconSmall>
                ))
              ) : (
                <Span>TBD</Span>
              )}
            </AuditAuditors>
            <ToolTip ref={tooltip}>{cont}</ToolTip>
            <Span className="competition">View Audit</Span>
          </AuditFooter>
        </Audit>
      ))}
    </Column>
  );
};
