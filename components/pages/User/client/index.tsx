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

const UserProfile = ({
  user,
  isOwner,
}: {
  user: UserWithProfile;
  isOwner: boolean;
}): JSX.Element => {
  return (
    <form>
      {isOwner && <h2>My Account</h2>}
      <Row $gap="rem2">
        {user.profile?.image ? (
          <Icon $size="lg">
            <img
              src={user.profile.image}
              alt="user icon"
              style={{ height: "100%", width: "100%" }}
            />
          </Icon>
        ) : (
          <Avatar $size="lg" $seed={user.address.replace(/\s/g, "")} />
        )}
        <Column $align="flex-start">
          <P>
            <Span>{user.profile?.name}</Span>
            <Span> | </Span>
            <Span>{user.address}</Span>
          </P>
          <P>
            Member Since:
            <Span>{user.createdAt.toDateString()}</Span>
          </P>
          <P>
            Last Profile Update:
            <Span>{user.profile?.updatedAt.toDateString()}</Span>
          </P>
        </Column>
      </Row>
    </form>
  );
};

export const UserClient = ({ user }: { user: UserWithProfile }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  if (!mounted) {
    return <Loader $size="50px" />;
  }

  return <UserProfile user={user} isOwner={isOwner} />;
};
