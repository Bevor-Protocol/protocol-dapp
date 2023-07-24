"use client";

import styled from "styled-components";

import { Twitter, Discord, Gitbook, Github } from "@/assets";

import SmartLink from "@/components/Link";
import { Column, Row } from "@/components/Box";
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

const Bar = styled(Row)`
  & > a {
    opacity: ${({ theme }): number => theme.opacity.disable};
    transition: opacity ${({ theme }): string => theme.transitions.speed.md}
      ${({ theme }): string => theme.transitions.ease};
  }
  & > a:hover {
    opacity: ${({ theme }): number => theme.opacity.hover};
  }
`;

const ContainerStyles = styled.div`
  height: 20px;
  width: 100%;
  background-color: #e0e0de;
  border-radius: 50px;
  margin: 50px;
`;

const FillerStyles = styled.div`
  height: 100%;
  width: 18%;
  background-color: #e0e0de;
  border-radius: inherit;
  text-align: right;
`;

const LabelStyles = styled.span`
  padding: 5px;
  color: white;
  font-weight: bold;
`;

export default (): JSX.Element => {
  const completed = 18;

  return (
    <footer>
      <Container $gap="rem1">
        <div>
          <p>Vesting Progress</p>
        </div>
        <Bar $gap="rem2">
          <ContainerStyles>
            <FillerStyles>
              <LabelStyles>{`${completed}%`}</LabelStyles>
            </FillerStyles>
          </ContainerStyles>
        </Bar>
        <div className="copy">
          <p>1000/10000 ETH vested</p>
        </div>
      </Container>
    </footer>
  );
};
