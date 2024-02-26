import { Avatar } from "@/components/Icon";
import { LeadData, LeadGrid, Leaderboard } from "@/components/pages/Leaderboard";
import { Section } from "@/components/Common";
import { LiElement } from "@/components/Box";
import { getLeaderboard } from "@/lib/actions/users";
import { LeaderboardNav } from "@/components/pages/Leaderboard";
import { trimAddress } from "@/lib/utils";

const headers = ["name", "money", "active", "completed", "available"];

type SearchI = {
  filter?: string;
  order?: string;
};

const LeaderboardPage = async ({
  searchParams,
}: {
  searchParams: SearchI;
}): Promise<JSX.Element> => {
  const filter = searchParams.filter ?? "name";
  const order = searchParams.order ?? "asc";
  const data = await getLeaderboard(filter, order);

  return (
    <Section $padCommon $centerH>
      <Leaderboard $gap="xs">
        <LeaderboardNav headers={headers} filter={filter} order={order} />
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
      </Leaderboard>
    </Section>
  );
};

export default LeaderboardPage;
