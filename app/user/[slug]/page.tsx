import { Suspense } from "react";

import { Loader } from "@/components/Loader";
import UserContent from "@/components/screens/user";
import {
  getCurrentUser,
  getUserAudits,
  getUserProfile,
  getUserStats,
  isWishlisted,
} from "@/actions/users";
import UserNotExist from "@/components/screens/user/onboard";
import UserAudits from "@/components/screens/user/audits";
import UserProfileActions from "@/components/screens/user/actions";
import UserWishlist from "@/components/screens/user/wishlist";

const Fetcher = async ({ address }: { address: string }): Promise<JSX.Element> => {
  // this is already stored in a context, but since we conditionally fetch the stats server-side,
  // I'll throw a re-request here.
  const user = await getUserProfile(address);

  if (!user) {
    return <UserNotExist address={address} />;
  }
  const stats = await getUserStats(address);
  const currentUser = await getCurrentUser();
  const audits = await getUserAudits(address);

  const isOwner = currentUser.address === address;

  let isWishlistedFlag = false;
  const canWishlist = !isOwner && user.auditorRole && !!currentUser.user;
  if (canWishlist) {
    isWishlistedFlag = await isWishlisted(currentUser.user!.id, user.id);
  }

  return (
    <div className="w-full max-w-[1000px] py-8 relative">
      <UserContent address={address} user={user} stats={stats} isOwner={isOwner} audits={audits} />
      {isOwner && <UserProfileActions user={user} stats={stats} />}
      {canWishlist && (
        <UserWishlist
          isWishlistedFlag={isWishlistedFlag}
          requestor={currentUser.user!.id}
          receiver={user.id}
        />
      )}
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <UserAudits address={address} audits={audits} isOwner={isOwner} />
    </div>
  );
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
