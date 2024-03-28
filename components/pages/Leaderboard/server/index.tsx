/* eslint-disable @next/next/no-img-element */
import { getLeaderboard } from "@/lib/actions/users";
import { trimAddress } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import DynamicLink from "@/components/Link";
import { Column } from "@/components/Box";

export const LeaderboardData = async ({
  sort,
  order,
}: {
  sort: string;
  order: string;
}): Promise<JSX.Element> => {
  const data = await getLeaderboard(sort, order);
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
              <Icon image={item.profile?.image} size="md" seed={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
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
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </DynamicLink>
      ))}
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
              <Icon image={item.profile?.image} size="md" seed={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
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
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </DynamicLink>
      ))}
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
              <Icon image={item.profile?.image} size="md" seed={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
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
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </DynamicLink>
      ))}
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
              <Icon image={item.profile?.image} size="md" seed={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
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
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </DynamicLink>
      ))}
    </Column>
  );
};
