import { cn, trimAddress } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Column } from "@/components/Box";
import { UserWithCount } from "@/lib/types";

const LeaderboardData = ({ data }: { data: UserWithCount[] }): JSX.Element => {
  return (
    <Column className="w-full gap-1">
      {data.map((item, ind) => (
        <DynamicLink key={ind} href={`/user/${item.address}`} className="w-full">
          <ul
            className="leaderboard-element rounded-md
shadow bg-dark cursor-pointer transition-colors hover:bg-dark-primary-20"
          >
            <li
              className="cursor-pointer rounded-lg text-sm
flex items-center gap-2 whitespace-nowrap max-w-full px-4"
            >
              <Icon image={item.image} size="md" seed={item.address} className="shrink-0" />
              <span className="overflow-hidden text-ellipsis">
                {item.name || trimAddress(item.address)}
              </span>
            </li>
            <li
              className="cursor-pointer rounded-lg text-sm
flex items-center gap-2 whitespace-nowrap max-w-full px-4"
            >
              <span>{item.stats.valuePotential.toLocaleString()}</span>
            </li>
            <li
              className="cursor-pointer rounded-lg text-sm
flex items-center gap-2 whitespace-nowrap max-w-full px-4"
            >
              <span>{item.stats.valueComplete.toLocaleString()}</span>
            </li>
            <li
              className="cursor-pointer rounded-lg text-sm
flex items-center gap-2 whitespace-nowrap max-w-full px-4"
            >
              <span>{item.stats.numActive.toLocaleString()}</span>
            </li>
            <li
              className="cursor-pointer rounded-lg text-sm
flex items-center gap-2 whitespace-nowrap max-w-full px-4"
            >
              <span>{item.stats.numComplete.toLocaleString()}</span>
            </li>
            <li
              className="cursor-pointer rounded-lg text-sm
flex items-center gap-2 whitespace-nowrap max-w-full px-4 relative"
            >
              <span
                className={cn(
                  "h-1 w-1 rounded-full mb-auto absolute right-0 top-0",
                  item.available && " bg-green-400",
                  !item.available && " bg-gray-600",
                )}
              />
              <span>{item.stats.numWishlist.toLocaleString()}</span>
            </li>
          </ul>
        </DynamicLink>
      ))}
    </Column>
  );
};

export default LeaderboardData;
