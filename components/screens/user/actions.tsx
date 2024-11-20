"use client";

import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
import DynamicLink from "@/components/Link";
import UserEdit from "@/components/Modal/Content/userEdit";
import { useModal } from "@/hooks/useContexts";
import { UserStats } from "@/utils/types";
import { User } from "@/utils/types/tables";

const UserProfileActions = ({ user, stats }: { user: User; stats: UserStats }): JSX.Element => {
  const { show } = useModal();

  const handleModal = (): void => {
    show(<UserEdit user={user} stats={stats} />);
  };

  return (
    <Row className="w-full justify-between mt-4">
      <Button onClick={handleModal} variant="outline">
        Edit
      </Button>
      {user.owner_role && (
        <DynamicLink href="/audits/create" asButton>
          <Row className="btn-outline">Create Audit</Row>
        </DynamicLink>
      )}
    </Row>
  );
};

export default UserProfileActions;
