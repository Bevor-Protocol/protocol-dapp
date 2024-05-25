"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Users } from "@prisma/client";

import AuditFormEntries from "@/components/Audit/client/form";
import { createAudit } from "@/actions/audits/auditee";
import { useUser } from "@/lib/hooks";

const AuditCreation = ({ user }: { user: Users }): JSX.Element => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [auditors, setAuditors] = useState<Users[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) =>
      createAudit(user!.id, variables.formData, auditors),
    onSettled: (data) => {
      if (data?.success) {
        router.push(`/user/${user.address}`);
      }
      if (!data?.success && data?.validationErrors) {
        setErrors(data.validationErrors);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    if (!isAuthenticated) return;
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    mutate({ formData });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full w-[700px]"
      onChange={() => setErrors({})}
      onReset={() => setErrors({})}
    >
      <h3>Create an Audit</h3>
      <p className="opacity-disable text-xs my-4 border-l border-l-gray-200/20 pl-2">
        The metadata, terms, and verified auditors will be updateable. If terms are not set here,
        default ones be used.
      </p>
      <AuditFormEntries
        disabled={isPending}
        userId={user.id}
        auditors={auditors}
        setAuditors={setAuditors}
        errors={errors}
      />
    </form>
  );
};

export default AuditCreation;
