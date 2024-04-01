import { trimAddress } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Column } from "@/components/Box";
import { UserWithCount } from "@/lib/types/actions";

const LeaderboardData = ({ data }: { data: UserWithCount[] }): JSX.Element => {
  return (
    <Column className="w-full gap-1">
      {data.map((item, ind) => (
        <DynamicLink key={ind} href={`/user/${item.address}`}>
          <ul
            className="grid grid-cols-12 list-none m-0 p-2 rounded-md
          shadow bg-dark cursor-pointer transition-colors hover:bg-dark-primary-20"
          >
            <li
              className="grid-child cursor-pointer rounded-lg text-sm
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <Icon image={item.image} size="md" seed={item.address} />
              <span>{item.name || trimAddress(item.address)}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg text-sm
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalValue.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg text-sm
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalActive.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg text-sm
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalComplete.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg text-sm
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{String(item.available)}</span>
            </li>
          </ul>
        </DynamicLink>
      ))}
    </Column>
  );
};

export default LeaderboardData;
