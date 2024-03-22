/* eslint-disable @next/next/no-img-element */
import { getLeaderboard } from "@/lib/actions/users";
import { Column } from "@/components/Box";
import { trimAddress } from "@/lib/utils";
import { FallbackIcon } from "@/components/Icon";
import { Loader } from "@/components/Common";
import { UnstyledNextLink } from "@/components/Link";

export const LeaderboardData = async ({
  filter,
  order,
}: {
  filter: string;
  order: string;
}): Promise<JSX.Element> => {
  const data = await getLeaderboard(filter, order);
  return (
    <div className="w-full flex flex-col gap-1">
      {data.map((item, ind) => (
        <UnstyledNextLink key={ind} href={`/user/${item.address}`}>
          <ul
            className="grid grid-cols-12 list-none m-0 p-2 rounded-md 
          shadow bg-dark cursor-pointer transition-colors hover:bg-dark-primary-20"
          >
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <FallbackIcon image={item.profile?.image} size="md" address={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalValue.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalActive.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalComplete.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </UnstyledNextLink>
      ))}
      {data.map((item, ind) => (
        <UnstyledNextLink key={ind} href={`/user/${item.address}`}>
          <ul
            className="grid grid-cols-12 list-none m-0 p-2 rounded-md 
          shadow bg-dark cursor-pointer transition-colors hover:bg-dark-primary-20"
          >
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <FallbackIcon image={item.profile?.image} size="md" address={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalValue.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalActive.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalComplete.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </UnstyledNextLink>
      ))}
      {data.map((item, ind) => (
        <UnstyledNextLink key={ind} href={`/user/${item.address}`}>
          <ul
            className="grid grid-cols-12 list-none m-0 p-2 rounded-md 
          shadow bg-dark cursor-pointer transition-colors hover:bg-dark-primary-20"
          >
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <FallbackIcon image={item.profile?.image} size="md" address={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalValue.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalActive.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalComplete.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </UnstyledNextLink>
      ))}
      {data.map((item, ind) => (
        <UnstyledNextLink key={ind} href={`/user/${item.address}`}>
          <ul
            className="grid grid-cols-12 list-none m-0 p-2 rounded-md 
          shadow bg-dark cursor-pointer transition-colors hover:bg-dark-primary-20"
          >
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <FallbackIcon image={item.profile?.image} size="md" address={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalValue.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalActive.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalComplete.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </UnstyledNextLink>
      ))}
      {data.map((item, ind) => (
        <UnstyledNextLink key={ind} href={`/user/${item.address}`}>
          <ul
            className="grid grid-cols-12 list-none m-0 p-2 rounded-md 
          shadow bg-dark cursor-pointer transition-colors hover:bg-dark-primary-20"
          >
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <FallbackIcon image={item.profile?.image} size="md" address={item.address} />
              <span>{item.profile?.name || trimAddress(item.address)}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalValue.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalActive.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{item.totalComplete.toLocaleString()}</span>
            </li>
            <li
              className="grid-child cursor-pointer rounded-lg 
            w-fit flex items-center 
            gap-2 whitespace-nowrap max-w-full"
            >
              <span>{String(item.profile?.available)}</span>
            </li>
          </ul>
        </UnstyledNextLink>
      ))}
    </div>
  );
};

export const LeaderboardSkeleton = (): JSX.Element => {
  return (
    <Column $padding="4rem">
      <Loader $size="40px" />
    </Column>
  );
};
