import { Suspense } from "react";

import { LeaderboardNav } from "@/components/pages/Leaderboard/client";
import { LeaderboardData, LeaderboardSkeleton } from "@/components/pages/Leaderboard/server";

const headers = ["name", "money", "active", "completed", "available"];

type SearchI = {
  filter?: string;
  order?: string;
};

const LeaderboardPage = ({ searchParams }: { searchParams: SearchI }): JSX.Element => {
  const filter = searchParams.filter ?? "name";
  const order = searchParams.order ?? "asc";

  return (
    <section className="flex flex-col h-full items-center px-screen">
      <div className="flex flex-col gap-2 scroll-table">
        <LeaderboardNav headers={headers} filter={filter} order={order} />
        {/* must add the key here to get suspense boundary on each new route */}
        <Suspense fallback={<LeaderboardSkeleton />} key={JSON.stringify(searchParams)}>
          <LeaderboardData filter={filter} order={order} />
        </Suspense>
      </div>
    </section>
  );
};

export default LeaderboardPage;
