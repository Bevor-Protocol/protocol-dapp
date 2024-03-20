"use client";

import styled from "styled-components";
import { Row } from "@/components/Box";
import { P } from "@/components/Text";

export const Edit = styled.div`
  cursor: pointer;
  font-size: 15px;
`;

export const Text = styled.input`
  appearance: none;
  font-family: inherit;
  width: 200px;
  padding: 5px 3px;
  border-radius: 5px;
  border: 1px solid rgba(204, 204, 204, 0.2);
  outline: none;
  font-size: inherit;
  background: transparent;
  color: inherit;
  cursor: auto;

  &:disabled {
    cursor: text;
    color: inherit;
    border: 1px solid transparent;
  }
`;

const RadioLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 35px;
  height: 20px;
`;

const RadioInput = styled.input`
  display: none;
  appearance: none;
`;

const RadioSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;

  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    border-radius: 100%;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  ${RadioInput}:disabled + & {
    cursor: default;
    opacity: 0.75;
  }

  ${RadioInput}:checked + & {
    background-color: #4cd964;
  }

  ${RadioInput}:focus + & {
    box-shadow: 0 0 1px #4cd964;
  }

  ${RadioInput}:checked + &:before {
    -webkit-transform: translateX(15px);
    -ms-transform: translateX(15px);
    transform: translateX(15px);
  }
`;

export const Radio: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
  props,
): JSX.Element => {
  const { name, ...rest } = props;
  return (
    <Row $gap="sm">
      <P>{name}</P>
      <RadioLabel htmlFor={name}>
        <RadioInput id={name} type="checkbox" name={name} {...rest} />
        <RadioSlider />
      </RadioLabel>
    </Row>
  );
};
