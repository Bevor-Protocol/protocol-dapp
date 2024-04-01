import UserNotExist from "./onboard";
import UserAudits from "./audits";
import UserData from "./data";
import UserProfileActions from "./actions";
import { getUserProfile } from "@/lib/actions/users";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { Column, Row } from "@/components/Box";
import { Icon } from "@/components/Icon";
import { trimAddress } from "@/lib/utils";
import * as Form from "@/components/Form";

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
    <Column className="items-start w-full max-w-[1000px] py-8">
      <Row className="justify-between w-full">
        <Column className="gap-4">
          <div>
            <Icon size="xxl" image={user.profile?.image} seed={user.address} />
            <p className="text-sm mt-4 mb-1">
              {user.profile?.name && <span>{user.profile.name} | </span>}
              <span>{trimAddress(user.address)}</span>
            </p>
            <p className="text-white/60 text-xs my-1">
              Member Since:
              <span> {user.createdAt.toLocaleDateString()}</span>
            </p>
          </div>
          <Row className="gap-4">
            <Form.Radio
              name="available"
              text="is available"
              checked={user.profile?.available}
              disabled={true}
              aria-disabled={true}
            />
            <Form.Radio
              name="auditorRole"
              text="auditor role"
              checked={user.auditorRole}
              disabled={true}
              aria-disabled={true}
            />
            <Form.Radio
              name="auditeeRole"
              text="auditee role"
              checked={user.auditeeRole}
              disabled={true}
              aria-disabled={true}
            />
          </Row>
        </Column>
        <Suspense>
          <UserData address={address} />
        </Suspense>
      </Row>
      <UserProfileActions user={user} />
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Suspense fallback={<Loader className="h-12" />}>
        <UserAudits address={address} />
      </Suspense>
    </Column>
  );
};

export default UserContent;
