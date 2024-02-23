"use client";

import styled from "styled-components";

import { Card } from "@/components/Box";

export const ModalWrapper = styled.dialog`
  background: none;
  border: none;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  color: inherit;
  padding: 5px;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1px);
  }
`;

export const ModalContent = styled(Card)`
  height: 400px;
  max-height: 75%;
  width: 300px;
  max-width: 80%;
`;
