import UserNotExist from "./onboard";
import UserAudits from "./audits";
import UserProfileActions from "./actions";
import { getUserProfile, getUserStats } from "@/actions/users";
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
  const stats = await getUserStats(address);

  return (
    <Column className="items-start w-full max-w-[1000px] py-8">
      <Row className="justify-between w-full">
        <Column className="gap-4">
          <div>
            <Icon size="xxl" image={user.image} seed={user.address} />
            <p className="text-sm mt-4 mb-1">
              {user.name && <span>{user.name} | </span>}
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
              checked={user.available}
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
        <Column className="gap-1 text-sm whitespace-nowrap min-w-44">
          <p>
            <span className="inline-block w-32 text-right mr-4">Potential Payout: </span>
            <span className="float-right">${stats.moneyPaid.toLocaleString()}</span>
          </p>
          <p>
            <span className="inline-block w-32 text-right mr-4">Potential Earnings: </span>
            <span className="float-right">${stats.moneyEarned}</span>
          </p>
          <p>
            <span className="inline-block w-32 text-right mr-4"># Audits Created: </span>
            <span className="float-right">{stats.numAuditsCreated}</span>
          </p>
          <p>
            <span className="inline-block w-32 text-right mr-4"># Audits Audited: </span>
            <span className="float-right">{stats.numAuditsAudited}</span>
          </p>
        </Column>
      </Row>
      <UserProfileActions user={user} stats={stats} />
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Suspense fallback={<Loader className="h-12" />}>
        <UserAudits address={address} />
      </Suspense>
    </Column>
  );
};

export default UserContent;
