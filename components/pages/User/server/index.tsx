/* eslint-disable @next/next/no-img-element */
import { UserIsOwner } from "../client";
import { getUserProfile } from "@/lib/actions/users";

export const UserContent = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const user = await getUserProfile(address);
  console.log(user);

  if (!user) {
    return <h2>This is not a user of Bevor Protocol</h2>;
  }
  return <UserIsOwner user={user} />;
};
