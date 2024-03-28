import UserProfileData from "./profile";
import UserNotExist from "./onboard";
import UserAudits from "./audits";
import UserData from "./data";
import { getUserProfile } from "@/lib/actions/users";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { Column } from "@/components/Box";

const UserContent = async ({ address }: { address: string }): Promise<JSX.Element> => {
  /* 
  User does not exist:
    If not connected:
      Display that this isn't a user of Bevor
    If connected:
      If address == connected address:
        Allow for onboarding flow
      Else:
        Display that this isn't a user of Bevor
  Else:
    Show user profile. If owner, allow for edit.
  */
  const user = await getUserProfile(address);

  if (!user) {
    return <UserNotExist address={address} />;
  }

  return (
    <Column className="items-start w-full">
      <div className="relative w-full">
        <Suspense>
          <UserData address={address} />
        </Suspense>
        <UserProfileData user={user} />
      </div>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Suspense fallback={<Loader className="h-12" />}>
        <UserAudits address={address} />
      </Suspense>
    </Column>
  );
};

export default UserContent;
