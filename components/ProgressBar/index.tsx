"use client";

import styled from "styled-components";
import { Column } from "@/components/Box";
import { CommonPad } from "@/components/Common";

const Container = styled(Column)`
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

  & .copy {
    font-size: 0.8em;
    line-height: 0.85em;
  }
`;

const ContainerStyles = styled.div`
  height: 20px;
  width: 80vh;
  background: ${({ theme }): string => theme.cardBg};
  border-radius: 10px;
  border: 2px solid ${({ theme }): string => theme.greyBorder};
  margin: 20px;
`;

const FillerStyles = styled.div`
  height: 100%;
  width: 18%;
  background: ${({ theme }): string => theme.textGradLight};
  border-radius: inherit;
  text-align: right;
`;

// const LabelStyles = styled.span`
//   padding: 5px;
//   color: white;
//   font-weight: bold;
// `;

export default (): JSX.Element => {
  // const completed = 18;

  return (
    <footer>
      <Container $gap="rem1">
        <div>
          <p>Vesting Progress</p>
        </div>
        <ContainerStyles>
          <FillerStyles>{/*<LabelStyles>{`${completed}%`}</LabelStyles>*/}</FillerStyles>
        </ContainerStyles>
        <div className="copy">
          <p>1000/10000 ETH vested</p>
        </div>
      </Container>
    </footer>
  );
};
