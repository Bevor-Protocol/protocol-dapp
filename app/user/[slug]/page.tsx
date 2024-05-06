import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import UserContent from "@/components/screens/user";
import { getCurrentUser, getUserProfile, getUserStats } from "@/actions/users";
import UserNotExist from "@/components/screens/user/onboard";

const Fetcher = async ({ address }: { address: string }): Promise<JSX.Element> => {
  // this is already stored in a context, but since we conditionally fetch the stats server-side,
  // I'll throw a re-request here.
  const user = await getUserProfile(address);

  if (!user) {
    return <UserNotExist address={address} />;
  }
  const stats = await getUserStats(address);
  const currentUser = await getCurrentUser();

  const isOwner = currentUser.address === address;

  return <UserContent address={address} user={user} stats={stats} isOwner={isOwner} />;
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
