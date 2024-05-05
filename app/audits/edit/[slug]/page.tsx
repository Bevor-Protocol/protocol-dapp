import { Suspense } from "react";

import { LoaderFill } from "@/components/Loader";
import AuditEditWrapper from "@/components/screens/audits/edit";
import { getAudit } from "@/actions/audits/general";
import { getCurrentUser } from "@/actions/users";
import { Column } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { Button } from "@/components/Button";
import { Arrow } from "@/assets";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await getAudit(auditId);

  if (!audit) {
    return (
      <Column className="items-center gap-4">
        <p>This audit does not exist</p>
      </Column>
    );
  }

  const { address, user } = await getCurrentUser();

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

  if (address !== audit.auditee.address) {
    return (
      <Column className="items-center gap-4">
        <p>You cannot update this audit because you are not the owner of it</p>
        <DynamicLink href={`/user/${address}`}>
          <Button variant="gradient">
            <span>Dashboard</span>
            <Arrow height="0.75rem" width="0.75rem" />
          </Button>
        </DynamicLink>
      </Column>
    );
  }

  return <AuditEditWrapper audit={audit} />;
};

const EditAudit = ({ params }: { params: { slug: string } }): JSX.Element => {
  return (
    <section className="flex flex-col h-full items-center">
      <Suspense fallback={<LoaderFill />}>
        <Fetcher auditId={params.slug} />
      </Suspense>
    </section>
  );
};

export default EditAudit;
