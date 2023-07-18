"use client";

import { useState, useRef, useEffect } from "react";
import Jazzicon from "react-jazzicon";
import styled from "styled-components";

import { H2, H3, P, Span } from "@/components/Text";
import { Column, Row } from "@/components/Box";
import { IconLarge, IconSmall } from "@/components/Icon";
import { ToolTip } from "@/components/Tooltip";
import { Address } from "wagmi";

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

type PropsI = {
  // beneficiary of tokens after they are released
  auditor: Address;
  // beneficiary of tokens after they are released
  auditee: Address;
  // cliff period in seconds
  cliff: number;
  // start time of the vesting period
  start: number;
  // duration of the vesting period in seconds
  duration: number;
  // duration of a slice period for the vesting in seconds
  slicePeriodSeconds: number;
  // whether the vesting is revocable
  withdrawlPaused: boolean;
  // total amount of tokens to be released at the end of the vesting
  amountTotal: number;
  // amount of tokens withdrawn
  withdrawn: number;
  // amount of tokens in escrow for payment
  auditInvalidated: boolean;
  // address of the ERC20 token vesting
  token: Address;
  // address of the ERC721 audit NFT
  tokenId: number;
};
export default ({ audit }: { audit: PropsI }): JSX.Element => {
  const [cont, setCont] = useState("");
  const [mounted, setMounted] = useState(false);
  const tooltip = useRef<HTMLDivElement>(null as HTMLDivElement);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
      <Audit>
        <AuditContent $align="flex-start" $justify="flex-start" $gap="rem2">
          <IconLarge>
            {mounted && (
              <Jazzicon
                diameter={75}
                seed={Math.round(10000000)}
                paperStyles={{ minWidth: "75px", minHeight: "75px" }}
              />
            )}
          </IconLarge>
          <div className="text">
            <H3>{audit.auditor}</H3>
            <P>{audit.duration}</P>
          </div>
          <div>${audit.amountTotal.toLocaleString()}</div>
        </AuditContent>
        <AuditFooter $disabled={!audit.withdrawlPaused} $justify="flex-start" $gap="rem2">
          <Span>{audit.withdrawlPaused}</Span>
          <AuditAuditors>
            <Span>auditors:</Span>
            {!audit.withdrawlPaused ? (
              <IconSmall
                data-auditor={audit.auditor}
                onMouseOver={handleToolTip}
                onMouseOut={clearToolTip}
              >
                {mounted && (
                  <Jazzicon
                    seed={Math.round(3 * 10000000)}
                    paperStyles={{
                      minWidth: "25px",
                      minHeight: "25px",
                      maxWidth: "25px",
                      maxHeight: "25px",
                    }}
                  />
                )}
              </IconSmall>
            ) : (
              <Span>TBD</Span>
            )}
          </AuditAuditors>
          <ToolTip ref={tooltip}>{cont}</ToolTip>
          <Span className="competition">View Competition</Span>
        </AuditFooter>
      </Audit>
    </Column>
  );
};
