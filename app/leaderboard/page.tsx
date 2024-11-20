import { Suspense } from "react";

import { userAction } from "@/actions";
import { Column } from "@/components/Box";
import { LoaderFill } from "@/components/Loader";
import LeaderboardWrapper from "@/components/screens/leaderboard";

const Fetcher = async (): Promise<JSX.Element> => {
  const data = await userAction.getLeaderboard("name", "asc");
  console.log(data);
  return <LeaderboardWrapper initialData={data} />;
};

const LeaderboardPage = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Column className="gap-4 py-8 justify-start items-center w-full max-w-[1000px] h-full">
        <div className="grad-light text-grad">
          <h2 className="text-4xl font-extrabold leading-[normal]">Leaderboard</h2>
        </div>
        <Suspense fallback={<LoaderFill className="h-12 w-12" />}>
          <Fetcher />
        </Suspense>
      </Column>
    </section>
  );
};

export default LeaderboardPage;
