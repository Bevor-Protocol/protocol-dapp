"use client";

import styled from "styled-components";
import { Column } from "@/components/Box";
import { P, Span } from "@/components/Text";

const Container = styled(Column)`
  width: 100%;
  max-width: 400px;
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
`;

const ContainerStyles = styled.div`
  height: 20px;
  width: 100%;
  background: ${({ theme }): string => theme.primaryMix20};
  border-radius: 10px;
  border: 2px solid ${({ theme }): string => theme.greyBorder};
`;

const FillerStyles = styled.div`
  height: 100%;
  width: 18%;
  background: ${({ theme }): string => theme.textGradLight};
  border-radius: inherit;
  text-align: right;
`;

const ProgressBar = (): JSX.Element => {
  return (
    <Container $gap="md" $padding="20px 0">
      <P>Vesting Progress</P>
      <ContainerStyles>
        <FillerStyles>{/*<LabelStyles>{`${completed}%`}</LabelStyles>*/}</FillerStyles>
      </ContainerStyles>
      <Span>1000 / 10000 ETH vested</Span>
    </Container>
  );
};

export default ProgressBar;
