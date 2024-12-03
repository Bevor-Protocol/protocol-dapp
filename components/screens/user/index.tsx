import { Column, Row } from "@/components/Box";
import { code } from "@/components/font";
import * as Form from "@/components/Form";
import { Icon } from "@/components/Icon";
import { cn } from "@/utils";
import { trimAddress } from "@/utils/formatters";
import { UserStats } from "@/utils/types/custom";
import { User } from "@/utils/types/tables";

const Stats = ({
  user,
  stats,
  className,
}: {
  user: User;
  stats: UserStats;
  className?: string;
}): JSX.Element => {
  return (
    <Column className={cn("gap-1 text-sm whitespace-nowrap min-w-44", className)}>
      <p>
        <span className="inline-block w-32 text-right mr-4">Potential Payout: </span>
        <span className={cn("float-right", code.className)}>
          ${stats.moneyPaid.toLocaleString()}
        </span>
      </p>
      <p>
        <span className="inline-block w-32 text-right mr-4">Potential Earnings: </span>
        <span className={cn("float-right", code.className)}>${stats.moneyEarned}</span>
      </p>
      <p>
        <span className="inline-block w-32 text-right mr-4"># Audits Created: </span>
        <span className={cn("float-right", code.className)}>{stats.numAuditsCreated}</span>
      </p>
      <p>
        <span className="inline-block w-32 text-right mr-4"># Audits Audited: </span>
        <span className={cn("float-right", code.className)}>{stats.numAuditsAudited}</span>
      </p>
      {user.auditor_role && (
        <p>
          <span className="inline-block w-32 text-right mr-4"># Wishlists: </span>
          <span className={cn("float-right", code.className)}>{stats.numWishlist}</span>
        </p>
      )}
    </Column>
  );
};

const UserContent = async ({
  user,
  stats,
}: {
  user: User;
  stats: UserStats;
}): Promise<JSX.Element> => {
  return (
    <Column className="gap-2">
      <Row className="justify-between">
        <Icon size="xxl" image={user.image} seed={user.address} />
        <Stats user={user} stats={stats} />
      </Row>
      <div>
        <p className="text-sm my-1">
          {user.name && <span>{user.name} | </span>}
          <span>{trimAddress(user.address)}</span>
        </p>
        <p className="text-white/60 text-xs my-1">
          Member Since:
          <span> {new Date(user.created_at).toLocaleDateString()}</span>
        </p>
      </div>
      <Row className="gap-x-4 gap-y-1 xs:flex-col xs:w-fit">
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
          checked={user.auditor_role}
          disabled={true}
          aria-disabled={true}
        />
        <Form.Radio
          name="ownerRole"
          text="owner role"
          checked={user.owner_role}
          disabled={true}
          aria-disabled={true}
        />
      </Row>
    </Column>
  );
};

export default UserContent;
