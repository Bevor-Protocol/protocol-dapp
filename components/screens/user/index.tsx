import { Users } from "@prisma/client";

import { Column, Row } from "@/components/Box";
import { Icon } from "@/components/Icon";
import { trimAddress } from "@/utils/formatters";
import * as Form from "@/components/Form";
import { UserStats } from "@/utils/types";

const UserContent = async ({
  user,
  stats,
}: {
  user: Users;
  stats: UserStats;
}): Promise<JSX.Element> => {
  return (
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
        {user.auditorRole && (
          <p>
            <span className="inline-block w-32 text-right mr-4"># Wishlists: </span>
            <span className="float-right">{stats.numWishlist}</span>
          </p>
        )}
      </Column>
    </Row>
  );
};

export default UserContent;
