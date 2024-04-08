import { Column } from "@/components/Box";
import { Button } from "@/components/Button";

const AuditFinalActions = (): JSX.Element => {
  return (
    <Column className="gap-2 items-end w-fit *:w-full">
      <Button>View Findings</Button>
    </Column>
  );
};

export default AuditFinalActions;
