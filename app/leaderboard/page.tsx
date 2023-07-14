"use client";

import { useState, useEffect } from "react";

import { IconMedium } from "@/components/Icon";

import { LeadData, LeadHeader, LeadGrid, Leaderboard } from "@/components/pages/Leaderboard";
import { leaderboard } from "@/utils/constants";
import { Section } from "@/components/Common";
import { Arrow } from "@/assets";
import { JazziconClient } from "@/components/Icon";

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
    <Section $fillHeight $padCommon $centerH $centerV>
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
                      <JazziconClient
                        mounted={mounted}
                        randVal={ind / arrOrdered.length}
                        paperStyles={{ minWidth: "30px", minHeight: "30px" }}
                      />
                    </IconMedium>
                  )}
                  <span>{arr[header as keyof ArrI].toLocaleString()}</span>
                </li>
              ))}
            </LeadGrid>
          ))}
        </LeadData>
      </Leaderboard>
    </Section>
  );
};
