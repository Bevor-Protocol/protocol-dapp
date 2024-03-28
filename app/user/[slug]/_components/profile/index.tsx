"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";

import { Icon, Social } from "@/components/Icon";
import { UserProfile } from "@/lib/types/actions";
import * as Form from "@/components/Form";
import { Pencil } from "@/assets";
import { Button } from "@/components/Button";
import { Column, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { trimAddress } from "@/lib/utils";
import { useModal } from "@/hooks/contexts";
import UserEdit from "@/components/Modal/Content/userEdit";

const UserProfileData = ({ user }: { user: UserProfile }): JSX.Element => {
  const { address } = useAccount();
  const { toggleOpen, setContent } = useModal();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  const handleModal = (): void => {
    setContent(<UserEdit user={user} />);
    toggleOpen();
  };

  return (
    <Column className="gap-1 justify-center items-center w-full relative">
      {isOwner && (
        <Social
          className="absolute right-1/2 top-0 translate-x-[100px] cursor-pointer"
          onClick={handleModal}
        >
          <Pencil height="14px" width="14px" fill="white" />
        </Social>
      )}
      <Icon size="xxl" image={user.profile?.image} seed={user.address} />
      <p className="text-sm">
        {user.profile?.name && <span>{user.profile.name} | </span>}
        <span>{trimAddress(user.address)}</span>
      </p>
      <p className="text-white/60 text-xs">
        Member Since:
        <span> {user.createdAt.toLocaleDateString()}</span>
      </p>
      <Row className="items-stretch gap-4 my-4">
        <Form.Radio
          name="available"
          text="is available"
          checked={user.profile?.available}
          disabled={true}
          aria-disabled={true}
        />
        <Form.Radio
          name="auditorRole"
          text="auditor role"
          checked={user.auditorRole}
          disabled={true}
          aria-disabled={true}
        />
        <Form.Radio
          name="auditeeRole"
          text="auditee role"
          checked={user.auditeeRole}
          disabled={true}
          aria-disabled={true}
        />
      </Row>
      {isOwner && user.auditeeRole && (
        <DynamicLink href="/audits/create">
          <Button>Create Audit</Button>
        </DynamicLink>
      )}
    </Column>
  );
};

export default UserProfileData;
