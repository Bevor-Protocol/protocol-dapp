"use client";

import styled, { css } from "styled-components";
import Jazzicon from "react-jazzicon";

const Icon = css`
  margin-right: 0px;
  border-radius: 100%;
  transition: all 0.25s ease-in-out;
`;

export const IconSmall = styled.div`
  height: 25px;
  width: 15px;
  min-width: 15px;
  ${Icon}
`;

export const IconMedium = styled.div`
  height: 30px;
  width: 30px;
  min-width: 30px;
  background: white;
  ${Icon}
`;

export const IconLarge = styled.div`
  height: 75px;
  width: 75px;
  min-width: 75px;
  background: white;
  ${Icon}
`;

export const Logo = styled.div<{ $height: string }>`
  height: ${({ $height }): string => $height};
  aspect-ratio: 2135 / 401;
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
