"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import styled from "styled-components";
import { Audit, User, Profile } from "@prisma/client";

import { P, Span, Strong } from "@/components/Text";
import { Column, Row, Card } from "@/components/Box";
import { ToolTip } from "@/components/Tooltip";
import { Avatar } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { trimAddress } from "@/lib/utils";

export const AuditHolder = styled(Column)`
  width: min(100%, 1000px);
  height: 100%;
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

export const AuditFooter = styled(Row)`
  border-top: 1px solid ${({ theme }): string => theme.greyBorder};
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

interface AuditRelation extends Audit {
  auditee: User & {
    profile: Profile | null;
  };
  auditors: User[];
  terms: {
    price: number;
  } | null;
}

const Audits = ({ arr, current }: { arr: AuditRelation[]; current: string }): JSX.Element => {
  const [cont, setCont] = useState("");
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
        {arr.length == 0 && <P>Currently no {current} audits</P>}
        {arr.map((audit, ind) => (
          <Card key={ind} $hover $width="100%" $padding="0px">
            <Row $align="stretch" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
              <Avatar $size="lg" $seed={audit.auditeeId.replace(/\s/g, "")} />
              <Column $justify="flex-start" $align="flex-start">
                <Row $justify="space-between" $width="100%">
                  <P>
                    <Strong $large>
                      {audit.auditee.profile?.name || trimAddress(audit.auditee.address)}
                    </Strong>
                  </P>
                  <div>${audit.terms?.price.toLocaleString() || 0}</div>
                </Row>
                <P>{"This is a placeholder audit description which I'll get back to."}</P>
              </Column>
            </Row>
            <AuditFooter $justify="space-between" $gap="rem2" $padding="0.5rem 1rem" $width="100%">
              <AuditorWrapper>
                <Span $secondary>auditors:</Span>
                {audit.auditors.length > 0 ? (
                  audit.auditors.map((auditor, ind2) => (
                    <Auditor $offset={`-${ind2 * 12.5}px`} key={ind2}>
                      <Avatar
                        data-auditor={auditor.address}
                        $size="sm"
                        $seed={auditor.address.replace(/\s/g, "")}
                        onMouseOver={handleToolTip}
                        onMouseOut={clearToolTip}
                      />
                    </Auditor>
                  ))
                ) : (
                  <Span>TBD</Span>
                )}
              </AuditorWrapper>
              <ToolTip ref={tooltip}>{cont}</ToolTip>
              <DynamicLink href={`/audits/${ind}`} disabled={current !== "closed"}>
                <Span>View Audit</Span>
              </DynamicLink>
            </AuditFooter>
          </Card>
        ))}
      </Column>
    </Column>
  );
};

export default Audits;
