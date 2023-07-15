import styled from "styled-components";

export const EllipsesHolder = styled.div<{ $height?: string; $gap?: string; $fade?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ $height }): string => $height ?? "fit-content"};
  gap: ${({ $gap }): string => $gap ?? "7px"};
  transition: opacity ${({ theme }): string => theme.transitions.speed.md}
    ${({ theme }): string => theme.transitions.ease};

  &:hover,
  &:focus {
    opacity: ${({ $fade, theme }): number =>
      $fade ? theme.opacity.disable : theme.opacity.enabled};
  }
`;

export const EllipsesDot = styled.div<{ $size?: string }>`
  height: ${({ $size }): string => $size ?? "5px"};
  width: ${({ $size }): string => $size ?? "5px"};
  background-color: currentColor;
  border-radius: 100%;
  position: relative;
`;
