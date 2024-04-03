"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { Users } from "@prisma/client";

import DynamicLink from "@/components/Link";
import { Column } from "@/components/Box";
import { Button } from "@/components/Button";
import { Loader } from "@/components/Loader";
import { Arrow } from "@/assets";
import { useUser } from "@/hooks/contexts";
import AuditForm from "@/components/Audit/client/form";
import { createAudit } from "@/lib/actions/audits";

const AuditCreation = (): JSX.Element => {
  const { address } = useAccount();
  const router = useRouter();
  const { user, isFetchedAfterMount, isPending } = useUser();
  const [auditors, setAuditors] = useState<Users[]>([]);

  useEffect(() => {
    if (!isFetchedAfterMount || isPending) return;
    if (!address) {
      router.push("/");
    }
    if (!user) {
      router.push(`/user/${address}`);
    }
  }, [isFetchedAfterMount, isPending, router, user, address]);

  const query = useMutation({
    mutationFn: (variables: { userId: string; formData: FormData; auditors: Users[] }) =>
      createAudit(variables.userId, variables.formData, variables.auditors),
    onSuccess: () => {
      router.push(`/user/${address}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    query.mutate({ userId: user.id, formData, auditors });
  };

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

  return (
    <AuditForm
      query={query}
      handleSubmit={handleSubmit}
      address={address as string}
      auditors={auditors}
      setAuditors={setAuditors}
    />
  );
};

export default AuditCreation;
