"use client";

import { Arrow } from "@/assets";
import { cn } from "@/lib/utils";

const headers = [
  { key: "name", text: "name" },
  { key: "value_potential", text: "$ potential" },
  { key: "value_complete", text: "$ completed" },
  { key: "num_active", text: "# active" },
  { key: "num_complete", text: "# completed" },
  { key: "date", text: "joined" },
];

const LeaderboardNav = ({
  sort,
  order,
  handleSearch,
}: {
  sort: string;
  order: string;
  handleSearch: (s: string) => void;
}): JSX.Element => {
  return (
    <div
      className={cn(
        "sticky -top-[1px] bg-dark z-50 w-full",
        "border border-transparent outline-2 outline-transparent outline-offset-2",
      )}
    >
      <ul className="leaderboard-element">
        {headers.map(({ key, text }, ind) => (
          <li
            key={ind}
            onClick={(): void => handleSearch(key)}
            className={cn(
              "px-2 whitespace-nowrap max-w-full min-w-fit",
              key === "name" && "pl-[calc(1rem+30px)] md:pl-[calc(1rem+25px)]",
            )}
          >
            <div
              className={cn(
                "relative p-2 pr-6 transition-colors hover:bg-dark-primary-20 w-fit",
                "cursor-pointer rounded-lg",
              )}
            >
              <span>{text}</span>
              {key === sort && (
                <Arrow
                  fill="white"
                  height="0.6rem"
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2",
                    order === "desc" ? "rotate-135" : "-rotate-45",
                  )}
                />
              )}
            </div>
            {/* <span className="text-ellipsis overflow-hidden block leading-[1.27rem]">{text}</span> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardNav;
