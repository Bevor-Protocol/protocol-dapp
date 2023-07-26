import styled from "styled-components";

export const EllipsesHolder = styled.div<{ $gap?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }): string => $gap ?? "7px"};
`;

export const EllipsesDot = styled.div<{ $size?: string }>`
  height: ${({ $size }): string => $size ?? "5px"};
  width: ${({ $size }): string => $size ?? "5px"};
  background-color: currentColor;
  border-radius: 100%;
  position: relative;
`;
