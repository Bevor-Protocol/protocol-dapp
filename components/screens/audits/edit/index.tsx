"use client";

import { MembershipStatusType, RoleType, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { auditAction } from "@/actions";
import AuditFormEntries from "@/components/Audit/client/form";
import ErrorToast from "@/components/Toast/Content/error";
import { useToast } from "@/hooks/useContexts";
import { ErrorTypeEnum } from "@/utils/types/enum";
import { AuditI } from "@/utils/types/prisma";

const AuditEditWrapper = ({ audit, user }: { audit: AuditI; user: User }): JSX.Element => {
  // only show the selected auditors that were already verified.
  const initialAuditors = audit.memberships
    .filter(
      (member) =>
        member.status === MembershipStatusType.VERIFIED &&
        member.role === RoleType.AUDITOR &&
        member.isActive,
    )
    .map((member) => member.user);

  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { show } = useToast();
  const [auditors, setAuditors] = useState<User[]>([...initialAuditors]);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) =>
      auditAction.owner.updateAudit(audit.id, variables.formData, auditors),
    onSuccess: (response) => {
      if (response.success) {
        router.push(`/audits/view/${audit.id}`);
      } else {
        const error = response.error;
        switch (error.type) {
          case ErrorTypeEnum.VALIDATION:
          case ErrorTypeEnum.BLOB:
            setErrors(error.validationErrors);
            break;
          default:
            show({
              content: <ErrorToast text="something went wrong, try again later" />,
              autoClose: true,
            });
        }
      }
    },
    onError: (error) => {
      console.log(error);
      show({
        content: <ErrorToast text="something went wrong, try again later" />,
        autoClose: true,
      });
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
