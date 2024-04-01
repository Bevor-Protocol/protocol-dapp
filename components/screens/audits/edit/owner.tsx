"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";

import { Loader } from "@/components/Loader";
import { useUser } from "@/hooks/contexts";
// import AuditFormEdit from "./form";
import { AuditFull, UserProfile } from "@/lib/types/actions";
import { updateAudit } from "@/lib/actions/audits";
import AuditForm from "@/components/Audit/client/form";

const AuditEditWrapper = ({ audit }: { audit: AuditFull }): JSX.Element => {
  const { address } = useAccount();
  const router = useRouter();
  const { user, isFetchedAfterMount, isPending } = useUser();
  const [auditors, setAuditors] = useState<UserProfile[]>([...audit.auditors]);

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
    mutationFn: (variables: { auditId: string; formData: FormData; auditors: UserProfile[] }) =>
      updateAudit(variables.auditId, variables.formData, variables.auditors),
    onSuccess: () => {
      router.push(`/audits/view/${audit.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    query.mutate({ auditId: audit.id, formData, auditors });
  };

  if (!isFetchedAfterMount || isPending) return <Loader className="h-12" />;

  if (audit.auditeeId !== user?.id) return <p>You do not own this audit</p>;

  return (
    <AuditForm
      query={query}
      handleSubmit={handleSubmit}
      address={address as string}
      auditors={auditors}
      setAuditors={setAuditors}
      initialState={audit}
    />
  );
};

export default AuditEditWrapper;
