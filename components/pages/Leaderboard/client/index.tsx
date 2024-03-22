"use client";

import { useRouter } from "next/navigation";
import { Arrow } from "@/assets";
import clsx from "clsx";

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
    <div className="sticky -top-[1px] bg-dark z-50 w-full">
      <ul className="grid grid-cols-12 list-none m-0 p-2">
        {headers.map((header, ind) => (
          <li
            key={ind}
            onClick={(): void => handleSearch(header)}
            className={clsx(
              "grid-child cursor-pointer p-2 -translate-x-2 rounded-lg \
            w-fit transition-colors hover:bg-dark-primary-20 flex items-center \
            gap-2 whitespace-nowrap max-w-full",
              {
                "translate-x-[30px]": header === "name",
              },
            )}
          >
            <span className=" text-ellipsis overflow-hidden block leading-[1.27rem]">{header}</span>
            {header === filter && (
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
