import { userController } from "@/actions";
import { Arrow } from "@/assets";
import { Column } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import { LoaderFill } from "@/components/Loader";
import AuditCreation from "@/components/screens/audits/create";
import { Suspense } from "react";

const Fetcher = async (): Promise<JSX.Element> => {
  const { address, user } = await userController.currentUser();

  if (!address) {
    return (
      <Column className="items-center gap-4">
        <p>Login before accessing this page</p>
      </Column>
    );
  }

  if (!user) {
    return (
      <Column className="items-center gap-4">
        <p>Create an account before accessing this page</p>
        <DynamicLink href={`/user/${address}`}>
          <Button variant="gradient">
            <span>Dashboard</span>
            <Arrow height="0.75rem" width="0.75rem" />
          </Button>
        </DynamicLink>
      </Column>
    );
  }

  if (!user.auditeeRole) {
    return (
      <Column className="items-center gap-4">
        <p>Claim the Auditee role before creating an audit</p>
        <DynamicLink href={`/user/${address}`}>
          <Button variant="gradient">
            <span>Dashboard</span>
            <Arrow height="0.75rem" width="0.75rem" />
          </Button>
        </DynamicLink>
      </Column>
    );
  }

  return <AuditCreation user={user} />;
};

const CreateAudit = (): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<LoaderFill />}>
        <Fetcher />
      </Suspense>
    </section>
  );
};

export default CreateAudit;
