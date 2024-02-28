"use client";

import { useRouter } from "next/navigation";

import { LeadHeader, LeadGrid } from "../styled";
import { LiElement } from "@/components/Box";
import { Arrow } from "@/assets";

export const LeaderboardNav = ({
  headers,
  filter,
  order,
}: {
  headers: string[];
  filter: string;
  order: string;
}): JSX.Element => {
  const router = useRouter();

  const handleSearch = (header: string): void => {
    let path: string;
    if (header === filter) {
      const newOrder = order === "asc" ? "desc" : "asc";
      path = `/leaderboard?filter=${filter}&order=${newOrder}`;
    } else {
      path = `/leaderboard?filter=${header}&order=asc`;
    }
    router.replace(path);
  };

  return (
    <LeadHeader>
      <LeadGrid>
        {headers.map((header, ind) => (
          <LiElement key={ind} onClick={(): void => handleSearch(header)}>
            <span>{header}</span>
            {header === filter && (
              <Arrow
                fill="white"
                height="0.6rem"
                style={{
                  transform: order === "desc" ? "rotate(135deg)" : "rotate(-45deg)",
                }}
              />
            )}
          </LiElement>
        ))}
      </LeadGrid>
    </LeadHeader>
  );
};
