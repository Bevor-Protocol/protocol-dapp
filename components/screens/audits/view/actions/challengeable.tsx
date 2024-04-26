import { Column } from "@/components/Box";
import { Button } from "@/components/Button";

const AuditChallengeableActions = (): JSX.Element => {
  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      <Button>Challenge</Button>
    </Column>
  );
};

export default AuditChallengeableActions;
