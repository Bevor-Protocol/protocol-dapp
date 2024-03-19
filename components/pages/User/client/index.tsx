/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { User, Profile, Audit, Terms } from "@prisma/client";

import { FallbackIcon } from "@/components/Icon";
import { Row, Column } from "@/components/Box";
import { P, Span } from "@/components/Text";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader } from "@/components/Common";

interface UserFull extends User {
  profile?: Profile | null;
  auditee?: (Audit & {
    auditee: User & {
      profile: Profile | null;
    };
    terms?: Terms | null;
    auditors?: (User & {
      profile: Profile | null;
    })[];
  })[];
  auditor?: (Audit & {
    auditee: User & {
      profile: Profile | null;
    };
    terms?: Terms | null;
    auditors?: (User & {
      profile: Profile | null;
    })[];
  })[];
}

export const UserProfile = ({ user }: { user: UserFull }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  if (!mounted) {
    return <Loader $size="50px" />;
  }
  return (
    <form>
      {isOwner && <h2>My Account</h2>}
      <Row $gap="rem2">
        <FallbackIcon size="lg" image={user.profile?.image} address={user.address} />
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
