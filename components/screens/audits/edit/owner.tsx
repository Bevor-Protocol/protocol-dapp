"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { AuditorStatus, Users } from "@prisma/client";

import { Loader } from "@/components/Loader";
import { useUser } from "@/hooks/contexts";
import { AuditViewDetailedI } from "@/lib/types/actions";
import { updateAudit } from "@/lib/actions/audits";
import AuditForm from "@/components/Audit/client/form";

const AuditEditWrapper = ({ audit }: { audit: AuditViewDetailedI }): JSX.Element => {
  const { address } = useAccount();
  const router = useRouter();
  const { user, isFetchedAfterMount, isPending } = useUser();

  // only show the selected auditors that were already verified.
  const initialAuditors = audit.auditors
    .filter((auditor) => auditor.status === AuditorStatus.VERIFIED)
    .map((auditor) => auditor.user);
  const [auditors, setAuditors] = useState<Users[]>([...initialAuditors]);

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
    mutationFn: (variables: { auditId: string; formData: FormData; auditors: Users[] }) =>
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
      initialAuditors={initialAuditors}
    />
  );
};

export default AuditEditWrapper;
