"use client";

import { UserStats } from "@/utils/types";
import { Button } from "@/components/Button";
import { Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { useModal } from "@/hooks/useContexts";
import UserEdit from "@/components/Modal/Content/userEdit";
import { Users } from "@prisma/client";

const UserProfileActions = ({ user, stats }: { user: Users; stats: UserStats }): JSX.Element => {
  const { toggleOpen, setContent } = useModal();

  const handleModal = (): void => {
    setContent(<UserEdit user={user} stats={stats} />);
    toggleOpen();
  };

  return (
    <Row className="w-full justify-between mt-4">
      <Button onClick={handleModal} variant="outline">
        Edit
      </Button>
      {user.auditeeRole && (
        <DynamicLink href="/audits/create" asButton>
          <Row className="btn-outline">Create Audit</Row>
        </DynamicLink>
      )}
    </Row>
  );
};

export default UserProfileActions;
