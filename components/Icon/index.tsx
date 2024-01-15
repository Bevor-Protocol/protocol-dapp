"use client";

import styled, { css } from "styled-components";
import Jazzicon from "react-jazzicon";

import { getBreakpoint } from "@/theme";

const Icon = css`
  position: relative;
  margin-right: 0px;
  border-radius: 100%;
  transition: all 0.25s ease-in-out;
`;

export const IconSmall = styled.div`
  --size: 25px;
  height: var(--size);
  width: var(--size);
  min-width: var(--size);
  ${Icon}
`;

export const IconMedium = styled.div`
  --size: 30px;
  height: var(--size);
  width: var(--size);
  min-width: var(--size);
  background: white;
  ${Icon}

  ${getBreakpoint(
    "md",
    css`
      --size: 25px;
    `,
  )}
`;

export const IconLarge = styled.div`
  --size: 75px;
  height: var(--size);
  width: var(--size);
  min-width: var(--size);
  background: white;
  ${Icon}

  ${getBreakpoint(
    "md",
    css`
      --size: 60px;
    `,
  )}
`;

export const LogoName = styled.div<{ $height: string }>`
  height: ${({ $height }): string => $height};
  aspect-ratio: 2135 / 401;
  position: relative;
`;

export const LogoIcon = styled.div<{ $height: string }>`
  height: ${({ $height }): string => $height};
  aspect-ratio: 1091 / 1685;
  position: relative;
`;

export const JazziconClient = ({
  mounted,
  randVal,
  ...rest
}: {
  mounted: boolean;
  randVal: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}): JSX.Element => {
  if (!mounted) {
    return <></>;
  }

  return <Jazzicon seed={Math.round(randVal * 10000000)} {...rest} />;
};
