"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AuditorStatus, Users } from "@prisma/client";

import { AuditI } from "@/utils/types/prisma";
import { auditController } from "@/actions";
import AuditFormEntries from "@/components/Audit/client/form";

const AuditEditWrapper = ({ audit, user }: { audit: AuditI; user: Users }): JSX.Element => {
  // only show the selected auditors that were already verified.
  const initialAuditors = audit.auditors
    .filter((auditor) => auditor.status === AuditorStatus.VERIFIED)
    .map((auditor) => auditor.user);

  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [auditors, setAuditors] = useState<Users[]>([...initialAuditors]);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) =>
      auditController.owner.updateAudit(audit.id, variables.formData, auditors),
    onSuccess: (data) => {
      if (data.success) {
        router.push(`/audits/view/${audit.id}`);
      } else {
        if (data.validationErrors) {
          setErrors(data.validationErrors);
        }
      }
    },
    onError: (error) => {
      console.log(error);
      setErrors({ arbitrary: "something went wrong, try again later" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!user) return;
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
        disabled={isPending || !user}
        userId={user.id}
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
