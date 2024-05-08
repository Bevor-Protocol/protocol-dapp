"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { AuditorStatus, Users } from "@prisma/client";

import { useUser } from "@/lib/hooks";
import { AuditI } from "@/lib/types";
import { updateAudit } from "@/actions/audits/auditee";
import AuditFormEntries from "@/components/Audit/client/form";

const AuditEditWrapper = ({ audit }: { audit: AuditI }): JSX.Element => {
  // only show the selected auditors that were already verified.
  const initialAuditors = audit.auditors
    .filter((auditor) => auditor.status === AuditorStatus.VERIFIED)
    .map((auditor) => auditor.user);

  const { address } = useAccount();
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [auditors, setAuditors] = useState<Users[]>([...initialAuditors]);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) =>
      updateAudit(audit.id, variables.formData, auditors),
    onSettled: (data) => {
      if (data?.success) {
        router.push(`/audits/view/${audit.id}`);
      }
      if (!data?.success && data?.validationErrors) {
        setErrors(data.validationErrors);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    if (!isAuthenticated) return;
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate({ formData });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-full w-[700px]" onChange={() => setErrors({})}>
      <h3>Edit an Audit</h3>
      <p className="opacity-disable text-xs my-4 border-l border-l-gray-200/20 pl-2">
        If your audit is Open, then editing your audit is straightforward. If your audit is locked,
        then pressing Submit will remove the attestations for all verified auditors, and each
        auditor will have to re-attest.
        <br />
        Verified auditors, or auditors who have already requested or been rejected for this audit,
        will not appear in the search results. If you want to verify an auditor request, then do
        that from the main audit view.
      </p>
      <AuditFormEntries
        disabled={isPending}
        address={address as string}
        auditors={auditors}
        setAuditors={setAuditors}
        initialState={audit}
        initialAuditors={initialAuditors}
        errors={errors}
      />
    </form>
  );
};

export default AuditEditWrapper;
