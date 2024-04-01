"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";

import { UserProfile } from "@/lib/types/actions";
import { Button } from "@/components/Button";
import { Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { useModal } from "@/hooks/contexts";
import UserEdit from "@/components/Modal/Content/userEdit";

const UserProfileActions = ({ user }: { user: UserProfile }): JSX.Element => {
  const { address } = useAccount();
  const { toggleOpen, setContent } = useModal();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  const handleModal = (): void => {
    setContent(<UserEdit user={user} />);
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
