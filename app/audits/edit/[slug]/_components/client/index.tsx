"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import { Loader } from "@/components/Loader";
import { useUser } from "@/hooks/contexts";
import { AuditFormEdit } from "@/components/Audit/client/form";
import { AuditFull } from "@/lib/types/actions";

export const AuditEditWrapper = ({ audit }: { audit: AuditFull }): JSX.Element => {
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

  if (audit.auditeeId !== user?.id) return <p>You do not own this audit</p>;

  return <AuditFormEdit address={address as string} audit={audit} />;
};
