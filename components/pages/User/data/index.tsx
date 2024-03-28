import { getUserStats } from "@/lib/actions/users";
import { Column } from "@/components/Box";

const UserData = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const data = await getUserStats(address);
  return (
    <Column className="gap-1 text-sm whitespace-nowrap w-44 absolute top-0 left-0">
      <p>
        Potential Payout: <span>${data.moneyPaid.toLocaleString()}</span>
      </p>
      <p>
        Potential Earnings: <span>${data.moneyEarned}</span>
      </p>
      <p>
        # Audits Created: <span>{data.numAuditsCreated}</span>
      </p>
      <p>
        # Audits Audited: <span>{data.numAuditsAudited}</span>
      </p>
    </Column>
  );
};

export default UserData;
