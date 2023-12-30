"use client";

import { useReducer } from "react";

import { IconMedium } from "@/components/Icon";
import { LeadData, LeadHeader, LeadGrid, Leaderboard } from "@/components/pages/Leaderboard";
import { leaderboard } from "@/utils/constants";
import { Section } from "@/components/Common";
import { Arrow } from "@/assets";
import { JazziconClient } from "@/components/Icon";
import { sortLeaderboardReducer } from "@/utils/reducers";
import { LeaderboardI } from "@/utils/types";
import { useIsMounted } from "@/hooks/useIsMounted";

const headers = ["name", "money", "active", "completed", "available"];

export default (): JSX.Element => {
  const initState = {
    key: "name",
    decrease: true,
    arr: [...leaderboard],
  };

  const mounted = useIsMounted();
  const [state, dispatch] = useReducer(sortLeaderboardReducer, initState);

  return (
    <Section $fillHeight $padCommon $centerH $centerV>
      <Leaderboard $padding="3rem 0" $gap="xs">
        <LeadHeader>
          <LeadGrid>
            {headers.map((header, ind) => (
              <li key={ind} onClick={(): void => dispatch({ key: header })}>
                <span>{header}</span>
                {header === state.key && (
                  <Arrow
                    fill="white"
                    height="0.6rem"
                    style={{
                      transform: state.decrease ? "rotate(135deg)" : "rotate(-45deg)",
                      marginLeft: "5px",
                    }}
                  />
                )}
              </li>
            ))}
          </LeadGrid>
        </LeadHeader>
        <LeadData>
          {state.arr.map((item, ind) => (
            <LeadGrid key={ind}>
              {headers.map((header, ind2) => (
                <li key={ind2}>
                  {header === "name" && (
                    <IconMedium>
                      <JazziconClient
                        mounted={mounted}
                        randVal={ind / state.arr.length}
                        paperStyles={{ minWidth: "30px", minHeight: "30px" }}
                      />
                    </IconMedium>
                  )}
                  <span>{item[header as keyof LeaderboardI].toLocaleString()}</span>
                </li>
              ))}
            </LeadGrid>
          ))}
        </LeadData>
      </Leaderboard>
    </Section>
  );
};
