import { Suspense } from "react";

import { notificationAction, statAction, userAction, wishlistAction } from "@/actions";
import { Loader } from "@/components/Loader";
import UserContent from "@/components/screens/user";
import UserProfileActions from "@/components/screens/user/actions";
import UserAudits from "@/components/screens/user/audits";
import UserNotExist from "@/components/screens/user/onboard";
import UserWishlist from "@/components/screens/user/wishlist";

const Fetcher = async ({ address }: { address: string }): Promise<JSX.Element> => {
  // this is already stored in a context, but since we conditionally fetch the stats server-side,
  // I'll throw a re-request here. Memoization should prevent actually going back to data store.
  const user = await userAction.getProfile(address);

  if (!user) {
    return <UserNotExist address={address} />;
  }

  const currentUser = await userAction.currentUser();
  const isOwner = currentUser.address === address;

  const stats = await statAction.getUserStats(address);
  const audits = await userAction.getUserAudits(address);

  let isWishlistedFlag = false;
  let pendingNotifications: string[] = [];
  // constrain wishlist to authenicated Protocol Owners. Can only wishlist Auditors.
  // If a user has both roles, wishlist will still appear.
  const canWishlist =
    !isOwner && user.auditorRole && !!currentUser.user && currentUser.user.ownerRole;
  if (canWishlist) {
    isWishlistedFlag = await wishlistAction.isWishlisted(currentUser.user!.id, user.id);
  }
  if (isOwner) {
    const notifications = await notificationAction.getUserNotifications(user.id);
    pendingNotifications = Object.keys(notifications);
  }

  return (
    <div className="w-full max-w-[1000px] py-8 relative">
      <UserContent user={user} stats={stats} />
      {isOwner && <UserProfileActions user={user} stats={stats} />}
      {canWishlist && <UserWishlist isWishlistedFlag={isWishlistedFlag} receiver={user} />}
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <UserAudits
        address={address}
        audits={audits}
        isOwner={isOwner}
        pendingNotifications={pendingNotifications}
      />
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
