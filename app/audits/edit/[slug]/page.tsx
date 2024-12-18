import { Suspense } from "react";

import { auditAction, authAction } from "@/actions";
import { Arrow } from "@/assets";
import { Column } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import { LoaderFill } from "@/components/Loader";
import AuditEditWrapper from "@/components/screens/audits/edit";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await auditAction.getAudit(auditId);

  if (!audit) {
    return (
      <Column className="items-center gap-4">
        <p>This audit does not exist</p>
      </Column>
    );
  }

  const { address, id } = await authAction.getCurrentUser();
  const isOwner = audit.owner.id === id;

  if (!address) {
    return (
      <Column className="items-center gap-4">
        <p>Login before accessing this page</p>
      </Column>
    );
  }

  if (!id) {
    return (
      <Column className="items-center gap-4">
        <p>Create an account before accessing this page</p>
        <DynamicLink href={`/users/${address}`}>
          <Button variant="gradient">
            <span>Dashboard</span>
            <Arrow height="0.75rem" width="0.75rem" />
          </Button>
        </DynamicLink>
      </Column>
    );
  }

  if (!isOwner) {
    return (
      <Column className="items-center gap-4">
        <p>You cannot update this audit because you are not the owner of it</p>
        <DynamicLink href={`/users/${address}`}>
          <Button variant="gradient">
            <span>Dashboard</span>
            <Arrow height="0.75rem" width="0.75rem" />
          </Button>
        </DynamicLink>
      </Column>
    );
  }

  return <AuditEditWrapper audit={audit} userId={id} />;
};

type Params = Promise<{ slug: string }>;

const EditAudit = async ({ params }: { params: Params }): Promise<JSX.Element> => {
  const { slug } = await params;
  return (
    <section className="flex flex-col h-full items-center sm:pb-14">
      <Suspense fallback={<LoaderFill />}>
        <Fetcher auditId={slug} />
      </Suspense>
    </section>
  );
};

export default EditAudit;
