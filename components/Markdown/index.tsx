"use client";

import styled from "styled-components";

export const Markdown = styled.div`
  max-width: 100%;
  overflow: hidden;

  & > * {
    margin: 1rem 0;
  }

  & > table {
    overflow-x: scroll;
    max-width: 100%;
    margin: auto;
    border-collapse: collapse;
  }

  & caption {
    margin-bottom: 5px;
    display: table-caption;
  }

  & td,
  & th {
    padding: 2px 4px;
    border: 1px solid ${({ theme }): string => theme.greyBorder};
  }

  & a {
    color: ${({ theme }): string => theme.primary70};
  }
`;
