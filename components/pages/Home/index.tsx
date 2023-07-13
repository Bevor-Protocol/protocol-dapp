"use client";

import styled, { css } from "styled-components";

import { Arrow } from "@/assets";
import { stats } from "@/utils/constants";

import { getBreakpoint } from "@/theme";
import { H1, H3, P, Span } from "@/components/Text";
import { ButtonLight } from "@/components/Button";
import { Grid, Column, Row } from "@/components/Box";
import { ButtonContent } from "@/components/Button";

const Home = styled(Grid)`
  grid-template-columns: repeat(2, 1fr);
  width: 100%;

  ${getBreakpoint(
    "md",
    css`
      grid-template-columns: 1fr;
    `,
  )}
`;

const HomeText = styled(Column)`
  text-align: left;

  ${getBreakpoint(
    "md",
    css`
      text-align: center;
      align-items: center;
    `,
  )}
`;

const HomeStats = styled(Grid)`
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);

  ${getBreakpoint(
    "xxl",
    css`
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 1fr);
    `,
  )}
  ${getBreakpoint(
    "md",
    css`
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
    `,
  )}
  ${getBreakpoint(
    "sm",
    css`
      grid-template-columns: 1fr;
      grid-template-rows: repeat(4, 1fr);
    `,
  )}
`;

const HomeStat = styled(Row)`
  background-color: ${({ theme }): string => theme.cardBg};
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  justify-content: center;
  filter: brightness(1);
  transition: filter ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover {
    filter: brightness(1.4);
  }
`;

export default (): JSX.Element => {
  return (
    <Home $gap="lg">
      <HomeText $gap="xl" $align="flex-start">
        <H1 $gradient>
          Ensuring <br /> quality audits
        </H1>
        <P $gradient>
          On-chain solution for establishing terms and carrying out smart contract audits. Register
          as an auditee, auditor, or DAO participant.
        </P>
        <Row $gap="sm">
          <ButtonLight>
            <ButtonContent>
              <Span>Get Audited</Span>
              <Arrow height="0.75rem" width="0.75rem" />
            </ButtonContent>
          </ButtonLight>
          <ButtonLight>
            <ButtonContent>
              <Span>Conduct Audit</Span>
              <Arrow height="0.75rem" width="0.75rem" />
            </ButtonContent>
          </ButtonLight>
        </Row>
      </HomeText>
      <HomeStats $gap="sm" $align="initial" $justify="initial">
        {stats.map((stat, ind) => (
          <HomeStat key={ind}>
            <div>
              <H3 $gradient>
                {stat.symbol}
                {stat.stat.toLocaleString()}
              </H3>
              <P $gradient>{stat.text}</P>
            </div>
          </HomeStat>
        ))}
      </HomeStats>
    </Home>
  );
};
