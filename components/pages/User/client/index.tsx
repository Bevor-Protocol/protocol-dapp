/* eslint-disable @next/next/no-img-element */
"use client";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import { User, Profile, Audit, Terms } from "@prisma/client";

import { FallbackIcon } from "@/components/Icon";
import { Row, Column, Card } from "@/components/Box";
import { P, Span, Strong, H3 } from "@/components/Text";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Loader } from "@/components/Common";
import DynamicLink from "@/components/Link";
import { AuditFooter, AuditorWrapper } from "@/components/pages/Audits/styled";
import { AuditAuditor } from "@/components/pages/Audits/client";

interface UserFull extends User {
  profile?: Profile | null;
  auditee?: (Audit & {
    terms?: Terms | null;
    auditors?: (User & {
      profile: Profile | null;
    })[];
  })[];
  auditor?: (Audit & {
    terms?: Terms | null;
    auditors?: (User & {
      profile: Profile | null;
    })[];
  })[];
}

const UserProfile = ({ user, isOwner }: { user: UserFull; isOwner: boolean }): JSX.Element => {
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

export const UserClient = ({ user }: { user: UserFull }): JSX.Element => {
  const mounted = useIsMounted();
  const { address } = useAccount();

  const isOwner = useMemo(() => {
    return user.address == address;
  }, [address, user.address]);

  if (!mounted) {
    return <Loader $size="50px" />;
  }

  return (
    <Column $gap="rem2">
      <UserProfile user={user} isOwner={isOwner} />
      <H3>Audits Created:</H3>
      {user.auditee?.map((audit, ind) => (
        <Card key={ind} $hover $width="100%" $padding="0px">
          <Row $align="stretch" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
            <FallbackIcon image={user.profile?.image} address={user.address} size="lg" />
            <Column $justify="flex-start" $align="flex-start">
              <Row $justify="space-between" $width="100%">
                <P>
                  <Strong $large>{audit.title}</Strong>
                </P>
                <div>${audit.terms?.price.toLocaleString() || 0}</div>
              </Row>
              <P>{audit.description}</P>
            </Column>
          </Row>
          <AuditFooter $justify="space-between" $gap="rem2" $padding="0.5rem 1rem" $width="100%">
            <AuditorWrapper>
              <Span $secondary>auditors:</Span>
              {audit.auditors && audit.auditors.length > 0 ? (
                audit.auditors?.map((auditor, ind2) => (
                  <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={auditor} />
                ))
              ) : (
                <Span>TBD</Span>
              )}
            </AuditorWrapper>
            <DynamicLink href={`/audits/${audit.id}`} disabled={true}>
              <Span>View Audit</Span>
            </DynamicLink>
          </AuditFooter>
        </Card>
      ))}
      <H3>Audits Auditing:</H3>
      {user.auditor?.map((audit, ind) => (
        <Card key={ind} $hover $width="100%" $padding="0px">
          <Row $align="stretch" $justify="flex-start" $gap="rem2" $padding="1rem" $width="100%">
            <FallbackIcon image={user.profile?.image} address={user.address} size="lg" />
            <Column $justify="flex-start" $align="flex-start">
              <Row $justify="space-between" $width="100%">
                <P>
                  <Strong $large>{audit.title}</Strong>
                </P>
                <div>${audit.terms?.price.toLocaleString() || 0}</div>
              </Row>
              <P>{audit.description}</P>
            </Column>
          </Row>
          <AuditFooter $justify="space-between" $gap="rem2" $padding="0.5rem 1rem" $width="100%">
            <AuditorWrapper>
              <Span $secondary>auditors:</Span>
              {audit.auditors && audit.auditors.length > 0 ? (
                audit.auditors?.map((auditor, ind2) => (
                  <AuditAuditor position={`-${ind2 * 12.5}px`} key={ind2} auditor={auditor} />
                ))
              ) : (
                <Span>TBD</Span>
              )}
            </AuditorWrapper>
            <DynamicLink href={`/audits/${audit.id}`} disabled={true}>
              <Span>View Audit</Span>
            </DynamicLink>
          </AuditFooter>
        </Card>
      ))}
    </Column>
  );
};
