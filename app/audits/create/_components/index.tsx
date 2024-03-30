"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import DynamicLink from "@/components/Link";
import { Column } from "@/components/Box";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { Arrow } from "@/assets";
import { useUser } from "@/hooks/contexts";
import { AuditForm } from "@/components/Audit/client/form";

export const AuditCreation = (): JSX.Element => {
  const { address } = useAccount();
  const router = useRouter();
  const { user, isFetchedAfterMount, isPending } = useUser();

  useEffect(() => {
    if (!isFetchedAfterMount || isPending) return;
    if (!address) {
      router.push("/");
    }
    if (!user) {
      router.push(`/user/${address}`);
    }
  }, [isFetchedAfterMount, isPending, router, user, address]);

  if (!isFetchedAfterMount || isPending) return <Loader className="h-12" />;

  if (!user?.auditeeRole)
    return (
      <Column className="items-center gap-4">
        <p>Claim the Auditee role before creating an audit</p>
        <DynamicLink href={`/user/${address}`}>
          <Button>
            <span>Dashboard</span>
            <Arrow height="0.75rem" width="0.75rem" />
          </Button>
        </DynamicLink>
      </Column>
    );

  return <AuditForm address={address as string} userId={user.id} />;
};
