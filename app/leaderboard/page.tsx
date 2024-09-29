import { Suspense } from "react";

import { userAction } from "@/actions";
import { Loader } from "@/components/Loader";
import LeaderboardWrapper from "@/components/screens/leaderboard";

const Fetcher = async (): Promise<JSX.Element> => {
  const data = await userAction.getLeaderboard("name", "asc");
  return <LeaderboardWrapper initialData={data} />;
};

const LeaderboardPage = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<Loader className="h-12 w-12" />}>
        <Fetcher />
      </Suspense>
    </section>
  );
};

export default LeaderboardPage;
