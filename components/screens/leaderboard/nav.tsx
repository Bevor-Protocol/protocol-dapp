"use client";

import { Arrow } from "@/assets";
import { cn } from "@/lib/utils";

const headers = ["name", "money", "active", "completed", "available"];

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
    <div className="sticky -top-[1px] bg-dark z-50 w-full">
      <ul className="grid grid-cols-12 list-none m-0 p-2">
        {headers.map((header, ind) => (
          <li
            key={ind}
            onClick={(): void => handleSearch(header)}
            className={cn(
              "grid-child cursor-pointer p-2 -translate-x-2 rounded-lg",
              "w-fit transition-colors hover:bg-dark-primary-20 flex items-center",
              "gap-2 whitespace-nowrap max-w-full",
              header === "name" && "translate-x-[30px]",
            )}
          >
            <span className="text-ellipsis overflow-hidden block leading-[1.27rem]">{header}</span>
            {header === sort && (
              <Arrow
                fill="white"
                height="0.6rem"
                style={{
                  transform: order === "desc" ? "rotate(135deg)" : "rotate(-45deg)",
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaderboardNav;
