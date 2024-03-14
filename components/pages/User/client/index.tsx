/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { User, Profile } from "@prisma/client";

import { Icon, Avatar } from "@/components/Icon";
import { Row, Column } from "@/components/Box";
import { P, Span } from "@/components/Text";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader } from "@/components/Common";

interface UserWithProfile extends User {
  profile?: Profile | null;
}

export const UserIsOwner = ({ user }: { user: UserWithProfile }): JSX.Element => {
  return (
    <Row>
      {user.profile?.image ? (
        <Icon $size="lg">
          <img src={user.profile.image} alt="user icon" />
        </Icon>
      ) : (
        <Avatar $size="lg" $seed={user.address.replace(/\s/g, "")} />
      )}
      <Column>
        <P>
          <Span>{user.profile?.name}</Span>
          <Span> | </Span>
          <Span>{user.address}</Span>
        </P>
        <P>
          Member Since:
          <Span>{user.createdAt.toDateString()}</Span>
        </P>
      </Column>
    </Row>
  );
};

export const UseClient = ({ user }: { user: UserWithProfile }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  if (!mounted) {
    return <Loader $size="50px" />;
  }

  if (isOwner) {
    return <UserIsOwner user={user} />;
  }

  return <h2>You don`t own this address, what you see is limited.</h2>;
};
