import { Suspense } from "react";

import { LeaderboardNav } from "@/components/pages/Leaderboard/client";
import { LeaderboardData } from "@/components/pages/Leaderboard/server";
import { LeaderboardSkeleton } from "@/components/Loader";

const headers = ["name", "money", "active", "completed", "available"];

type SearchI = {
  sort?: string;
  order?: string;
};

const LeaderboardPage = ({ searchParams }: { searchParams: SearchI }): JSX.Element => {
  const sort = searchParams.sort ?? "name";
  const order = searchParams.order ?? "asc";

  return (
    <section className="flex flex-col h-full items-center px-content-limit">
      <div className="flex flex-col scroll-table">
        <LeaderboardNav headers={headers} sort={sort} order={order} />
        {/* must add the key here to get suspense boundary on each new route */}
        <Suspense fallback={<LeaderboardSkeleton />} key={JSON.stringify(searchParams)}>
          <LeaderboardData sort={sort} order={order} />
        </Suspense>
      </div>
    </section>
  );
};

export default LeaderboardPage;
