import { getLeaderboard } from "@/lib/actions/users";
import { LeadData, LeadGrid } from "../styled";
import { LiElement, Column } from "@/components/Box";
import { trimAddress } from "@/lib/utils";
import { Avatar } from "@/components/Icon";
import { Loader } from "@/components/Common";

export const LeaderboardData = async ({
  filter,
  order,
}: {
  filter: string;
  order: string;
}): Promise<JSX.Element> => {
  const data = await getLeaderboard(filter, order);
  return (
    <LeadData>
      {data.map((item, ind) => (
        <LeadGrid key={ind}>
          <LiElement>
            <Avatar $size="md" $seed={item.address} />
            <span>{item.profile?.name || trimAddress(item.address)}</span>
          </LiElement>
          <LiElement>
            <span>{item.totalValue.toLocaleString()}</span>
          </LiElement>
          <LiElement>
            <span>{item.totalActive.toLocaleString()}</span>
          </LiElement>
          <LiElement>
            <span>{item.totalComplete.toLocaleString()}</span>
          </LiElement>
          <LiElement>
            <span>{String(item.profile?.available)}</span>
          </LiElement>
        </LeadGrid>
      ))}
    </LeadData>
  );
};

export const LeaderboardSkeleton = (): JSX.Element => {
  return (
    <Column $padding="4rem">
      <Loader $size="40px" />
    </Column>
  );
};
