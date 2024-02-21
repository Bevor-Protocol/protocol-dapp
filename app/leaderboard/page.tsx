"use client";

import { useReducer } from "react";

import { IconMedium } from "@/components/Icon";
import { LeadData, LeadHeader, LeadGrid, Leaderboard } from "@/components/pages/Leaderboard";
import { leaderboard } from "@/lib/constants";
import { Section } from "@/components/Common";
import { LiElement } from "@/components/Box";
import { Arrow } from "@/assets";
import { JazziconClient } from "@/components/Icon";
import { sortLeaderboardReducer } from "@/lib/reducers";
import { LeaderboardI } from "@/lib/types";
import { useIsMounted } from "@/hooks/useIsMounted";

const headers = ["name", "money", "active", "completed", "available"];

const LeaderboardPage = (): JSX.Element => {
  const initState = {
    key: "name",
    decrease: true,
    arr: [...leaderboard],
  };

  const mounted = useIsMounted();
  const [state, dispatch] = useReducer(sortLeaderboardReducer, initState);

  return (
    <Section $padCommon $centerH>
      <Leaderboard $gap="xs">
        <LeadHeader>
          <LeadGrid>
            {headers.map((header, ind) => (
              <LiElement key={ind} onClick={(): void => dispatch({ key: header })}>
                <span>{header}</span>
                {header === state.key && (
                  <Arrow
                    fill="white"
                    height="0.6rem"
                    style={{
                      transform: state.decrease ? "rotate(135deg)" : "rotate(-45deg)",
                    }}
                  />
                )}
              </LiElement>
            ))}
          </LeadGrid>
        </LeadHeader>
        <LeadData>
          {state.arr.map((item, ind) => (
            <LeadGrid key={ind}>
              {headers.map((header, ind2) => (
                <LiElement key={ind2}>
                  {header === "name" && (
                    <IconMedium>
                      <JazziconClient
                        mounted={mounted}
                        randVal={ind / state.arr.length}
                        diameter={30}
                        paperStyles={{
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </IconMedium>
                  )}
                  <span>{item[header as keyof LeaderboardI].toLocaleString()}</span>
                </LiElement>
              ))}
            </LeadGrid>
          ))}
        </LeadData>
      </Leaderboard>
    </Section>
  );
};

export default LeaderboardPage;
