"use client";

import styled, { css } from "styled-components";
import { getBreakpoint } from "@/theme";

const IconCSS = css`
  position: relative;
  margin-right: 0px;
  border-radius: 100%;
  transition: all 0.25s ease-in-out;
`;

const sizeMapper: Record<string, Record<string, string>> = {
  sm: {
    standard: "25px",
    break: "25px",
  },
  md: {
    standard: "30px",
    break: "25px",
  },
  lg: {
    standard: "75px",
    break: "60px",
  },
  xl: {
    standard: "90px",
    break: "75px",
  },
};

export const Icon = styled.div<{ $size: string }>`
  --size: ${({ $size }): string => sizeMapper[$size].standard};
  height: var(--size);
  width: var(--size);
  min-width: var(--size);

  ${getBreakpoint(
    "md",
    (props: { $size: string }) => css`
      --size: ${sizeMapper[props.$size].break};
    `,
  )};

  ${IconCSS}
`;

export const Avatar = styled(Icon)<{ $seed: string }>`
  background-image: ${({ $seed }): string => `url(https://avatar.vercel.sh/${$seed})`};
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

export const LogoIcon = styled.div<{ $height: string }>`
  height: ${({ $height }): string => $height};
  aspect-ratio: 1091 / 1685;
  position: relative;
`;
