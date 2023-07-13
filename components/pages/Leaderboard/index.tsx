"use client";

import styled from "styled-components";

import { useState, useEffect } from "react";
import { leaderboard } from "@/utils/constants";
import { Arrow } from "@/assets";
import Jazzicon from "react-jazzicon";

import { IconMedium } from "@/components/Icon";

const Leaderboard = styled.div`
  padding: 3rem 0;
  position: relative;
  max-height: none;
  width: min(100%, 1000px);
  margin: auto;
`;

const LeadHeader = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(5px);

  & li {
    cursor: pointer;
  }
`;

const LeadGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  appearance: none;
  list-style: none;
  margin: 0;
  padding: 10px 10px;

  &:nth-child(n + 2) {
    margin: 7px 0;
  }

  & li {
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  & li span {
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
  }

  & :nth-child(1) {
    grid-column: 1 / 4;
  }
  & :nth-child(2) {
    grid-column: 4 / 7;
  }
  & :nth-child(3) {
    grid-column: 7 / 9;
  }
  & :nth-child(4) {
    grid-column: 9 / 11;
  }
  & :nth-child(5) {
    grid-column: 11 / 13;
  }
`;

const LeadData = styled.div`
  margin: 0 10px;

  & ${LeadGrid} {
    background: ${({ theme }): string => theme.cardBg};
    border-radius: 10px;
    border: 1px solid ${({ theme }): string => theme.greyBorder};
  }
`;

type ArrI = {
  name: string;
  money: number;
  active: number;
  completed: number;
  available: boolean;
};

const headers = ["name", "money", "active", "completed", "available"];

export default (): JSX.Element => {
  const [keyOrder, setKeyOrder] = useState("name");
  const [decOrder, setDecOrder] = useState(true);
  const [arrOrdered, setArrOrdered] = useState<ArrI[]>([...leaderboard]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleOrder = (key: string): void => {
    setKeyOrder(key);
    setDecOrder(!decOrder);
    setArrOrdered((prev) => {
      return prev.sort((a, b) => {
        const aVal = a[key as keyof ArrI];
        const bVal = b[key as keyof ArrI];
        return aVal > bVal ? 2 * Number(decOrder) - 1 : bVal > aVal ? 2 * Number(!decOrder) - 1 : 0;
      });
    });
  };

  return (
    <Leaderboard>
      <LeadHeader>
        <LeadGrid>
          {headers.map((header, ind) => (
            <li key={ind} onClick={(): void => handleOrder(header)}>
              <span>{header}</span>
              {header === keyOrder && (
                <Arrow
                  fill="white"
                  height="0.6rem"
                  style={{
                    transform: decOrder ? "rotate(135deg)" : "rotate(-45deg)",
                    marginLeft: "5px",
                  }}
                />
              )}
            </li>
          ))}
        </LeadGrid>
      </LeadHeader>
      <LeadData>
        {arrOrdered.map((arr, ind) => (
          <LeadGrid key={ind}>
            {headers.map((header, ind2) => (
              <li key={ind2}>
                {header === "name" && (
                  <IconMedium>
                    {mounted && (
                      <Jazzicon
                        seed={Math.round((ind / arrOrdered.length) * 10000000)}
                        paperStyles={{ minWidth: "30px", minHeight: "30px" }}
                      />
                    )}
                  </IconMedium>
                )}
                <span>{arr[header as keyof ArrI].toLocaleString()}</span>
              </li>
            ))}
          </LeadGrid>
        ))}
      </LeadData>
    </Leaderboard>
  );
};
