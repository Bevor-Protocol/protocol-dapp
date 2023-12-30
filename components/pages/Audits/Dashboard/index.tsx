"use client";

import { useState, useRef } from "react";
import styled from "styled-components";
import { useRouter, usePathname } from "next/navigation";

import { H3, P, Span } from "@/components/Text";
import { Column, Row } from "@/components/Box";
import { IconLarge, IconSmall, JazziconClient } from "@/components/Icon";
import { ToolTip } from "@/components/Tooltip";
import ProgressBar from "@/components/ProgressBar";
import { ButtonLight } from "@/components/Button";
import { useAccount } from "wagmi";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Markdown } from "@/components/Markdown";
import { Audit, AuditContent, AuditFooter, Auditor, AuditorWrapper, AuditNav } from "..";

const AuditDescription = styled(Column)`
  padding: 1rem;
  width: 100%;

  & pre {
    white-space: pre-line;
  }
`;

type Props = {
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  content: string;
  display: string;
};

export default ({ data, content, display }: Props): JSX.Element => {
  const [cont, setCont] = useState("");
  const mounted = useIsMounted();
  const tooltip = useRef<HTMLDivElement>(null);
  const account = useAccount();
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
    if (data.auditors.includes(account.toString())) {
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
            <H3>{data.auditee}</H3>
            <P>{data.duration}</P>
            <P>{new Date(data.date).toLocaleDateString()}</P>
          </div>
          <div>${data.amount.toLocaleString()}</div>
        </AuditContent>
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
        <AuditFooter $disabled={true} $justify="flex-start" $gap="rem2">
          <AuditorWrapper>
            <Span>auditors:</Span>
            {data.auditors.map((auditor: string, ind: number) => (
              <Auditor $offset={`-${ind * 12.5}px`} key={ind}>
                <IconSmall
                  data-auditor={auditor}
                  onMouseOver={handleToolTip}
                  onMouseOut={clearToolTip}
                >
                  <JazziconClient mounted={mounted} randVal={ind / data.auditors.length} />
                </IconSmall>
              </Auditor>
            ))}
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
