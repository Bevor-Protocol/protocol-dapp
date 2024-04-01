import { getUserStats } from "@/lib/actions/users";
import { Column } from "@/components/Box";

const UserData = async ({ address }: { address: string }): Promise<JSX.Element> => {
  const data = await getUserStats(address);
  return (
    <Column className="gap-1 text-sm whitespace-nowrap min-w-44">
      <p>
        <span className="inline-block w-32 text-right mr-4">Potential Payout: </span>
        <span className="float-right">${data.moneyPaid.toLocaleString()}</span>
      </p>
      <p>
        <span className="inline-block w-32 text-right mr-4">Potential Earnings: </span>
        <span className="float-right">${data.moneyEarned}</span>
      </p>
      <p>
        <span className="inline-block w-32 text-right mr-4"># Audits Created: </span>
        <span className="float-right">{data.numAuditsCreated}</span>
      </p>
      <p>
        <span className="inline-block w-32 text-right mr-4"># Audits Audited: </span>
        <span className="float-right">{data.numAuditsAudited}</span>
      </p>
    </Column>
  );
};

export default UserData;
