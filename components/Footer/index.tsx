"use client";

import styled, { css } from "styled-components";

import { getBreakpoint } from "@/theme";
import { Twitter, Discord, Gitbook, Github } from "@/assets";
import SmartLink from "@/components/Link";
import { Column, Row } from "@/components/Box";
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

const FooterItems = styled(Row)`
  & > a {
    opacity: ${({ theme }): number => theme.opacity.disable};
    transition: opacity ${({ theme }): string => theme.transitions.speed.md}
      ${({ theme }): string => theme.transitions.ease};
  }
  & > a:hover {
    opacity: ${({ theme }): number => theme.opacity.hover};
  }
`;

export default (): JSX.Element => {
  return (
    <footer>
      <Footer $gap="rem1" $width="100%">
        <P>de-risk. incentivize. audit. decentralize.</P>
        <FooterItems $gap="rem2">
          <SmartLink href="https://twitter.com/BevorProtocol" external={true}>
            <Twitter height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
          <SmartLink href="https://docs.bevor.io" external={true}>
            <Gitbook height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
          <SmartLink href="https://github.com/Bevor-Protocol" external={true}>
            <Github height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
          <SmartLink href="https://discord.gg/MDfNgatN" external={true}>
            <Discord height="1.5rem" width="1.5rem" fill="white" />
          </SmartLink>
        </FooterItems>
        <Span>Bevor &copy; {`${new Date().getFullYear()}`}</Span>
      </Footer>
    </footer>
  );
};
