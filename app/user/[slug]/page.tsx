import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import UserContent from "@/components/screens/user";
import { getUserProfile, getUserStats } from "@/actions/users";
import UserNotExist from "@/components/screens/user/onboard";
import { getUser } from "@/actions/siwe";

const Fetcher = async ({ address }: { address: string }): Promise<JSX.Element> => {
  // this is already stored in a context, but since we conditionally fetch the stats server-side,
  // I'll throw a re-request here.
  const user = await getUserProfile(address);
  const tester = await getUser();
  console.log(tester);

  if (!user) {
    return <UserNotExist address={address} />;
  }
  const stats = await getUserStats(address);

  return <UserContent address={address} user={user} stats={stats} />;
};

const UserPage = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<Loader className="h-12" />}>
        <Fetcher address={params.slug} />
      </Suspense>
    </section>
  );
};

export default UserPage;
