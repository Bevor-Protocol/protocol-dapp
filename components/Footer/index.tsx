"use client";

import styled, { css } from "styled-components";

import { getBreakpoint } from "@/theme";
import { Column } from "@/components/Box";
import { CommonPad } from "@/components/Common";
import { P, Span } from "@/components/Text";

const Footer = styled(Column)`
  ${CommonPad}
  padding-top: 30px;
  padding-bottom: 30px;
  text-align: center;
  position: relative;
  & p {
    font-size: 0.85em;
    line-height: 1em;
    opacity: ${({ theme }): number => theme.opacity.disable};
  }

  & span {
    font-size: 0.8em;
    line-height: 0.85em;
    opacity: ${({ theme }): number => theme.opacity.disable};
  }
  ${getBreakpoint(
    "md",
    css`
      padding-bottom: calc(30px + 3rem);
    `,
  )}
`;

export default (): JSX.Element => {
  return (
    <footer>
      <Footer $gap="rem1" $width="100%">
        <P>de-risk. incentivize. audit. decentralize.</P>
        <Span>Bevor &copy; {`${new Date().getFullYear()}`}</Span>
      </Footer>
    </footer>
  );
};
