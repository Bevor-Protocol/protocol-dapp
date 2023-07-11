"use client";

import { useState, useEffect } from "react";
import { leaderboard } from "@/utils/constants";
import { Arrow } from "@/assets";
import Jazzicon from "react-jazzicon";

import * as Styled from "@/styles/pages.styled";

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
    <Styled.Leaderboard>
      <Styled.LeadHeader>
        <Styled.LeadGrid>
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
        </Styled.LeadGrid>
      </Styled.LeadHeader>
      <Styled.LeadData>
        {arrOrdered.map((arr, ind) => (
          <Styled.LeadGrid key={ind}>
            {headers.map((header, ind2) => (
              <li key={ind2}>
                {header === "name" && (
                  <Styled.Icon $size="medium">
                    {mounted && (
                      <Jazzicon
                        seed={Math.round((ind / arrOrdered.length) * 10000000)}
                        paperStyles={{ minWidth: "30px", minHeight: "30px" }}
                      />
                    )}
                  </Styled.Icon>
                )}
                <span>{arr[header as keyof ArrI].toLocaleString()}</span>
              </li>
            ))}
          </Styled.LeadGrid>
        ))}
      </Styled.LeadData>
    </Styled.Leaderboard>
  );
};
