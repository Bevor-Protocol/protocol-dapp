import { Suspense } from "react";

import { auditAction, userAction } from "@/actions";
import { Arrow } from "@/assets";
import { Column } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import { LoaderFill } from "@/components/Loader";
import AuditEditWrapper from "@/components/screens/audits/edit";
import { RoleType } from "@prisma/client";

const Fetcher = async ({ auditId }: { auditId: string }): Promise<JSX.Element> => {
  const audit = await auditAction.getAudit(auditId);

  if (!audit) {
    return (
      <Column className="items-center gap-4">
        <p>This audit does not exist</p>
      </Column>
    );
  }

  const { address, user } = await userAction.currentUser();
  const isOwner = audit.memberships.some(
    (member) => member.userId === user?.id && member.role === RoleType.OWNER,
  );

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

  return <AuditEditWrapper audit={audit} user={user} />;
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
