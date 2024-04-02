"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";

import { UserStats } from "@/lib/types/actions";
import { Button } from "@/components/Button";
import { Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { useModal } from "@/hooks/contexts";
import UserEdit from "@/components/Modal/Content/userEdit";
import { Users } from "@prisma/client";

const UserProfileActions = ({ user, stats }: { user: Users; stats: UserStats }): JSX.Element => {
  const { address } = useAccount();
  const { toggleOpen, setContent } = useModal();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  const handleModal = (): void => {
    setContent(<UserEdit user={user} stats={stats} />);
    toggleOpen();
  };

  if (!isOwner) return <></>;

  return (
    <Row className="w-full justify-between mt-4">
      <Button onClick={handleModal}>Edit</Button>
      {user.auditeeRole && (
        <DynamicLink href="/audits/create">
          <Button>Create Audit</Button>
        </DynamicLink>
      )}
    </Row>
  );
};

export default UserProfileActions;
