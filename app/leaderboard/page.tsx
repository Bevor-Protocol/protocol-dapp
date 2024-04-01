import { Loader } from "@/components/Loader";
import Leaderboard from "@/components/screens/leaderboard";
import { Suspense } from "react";

const LeaderboardPage = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center px-content-limit">
      <Suspense fallback={<Loader className="h-12 w-12" />}>
        <Leaderboard />
      </Suspense>
    </section>
  );
};

export default LeaderboardPage;
