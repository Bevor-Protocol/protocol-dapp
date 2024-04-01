import { getLeaderboard } from "@/lib/actions/users";
import LeaderboardWrapper from "./wrapper";

const Leaderboard = async (): Promise<JSX.Element> => {
  const data = await getLeaderboard("name", "asc");
  return <LeaderboardWrapper initialData={data} />;
};

export default Leaderboard;
