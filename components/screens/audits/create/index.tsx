"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { auditAction } from "@/actions";
import AuditFormEntries from "@/components/Audit/client/form";
import ErrorToast from "@/components/Toast/Content/error";
import { useToast } from "@/hooks/useContexts";
import { ErrorTypeEnum } from "@/utils/types/enum";
import { User } from "@/utils/types/tables";

const AuditCreation = ({ user }: { user: User }): JSX.Element => {
  const router = useRouter();
  const [auditors, setAuditors] = useState<User[]>([]);
  const { show } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) =>
      auditAction.owner.createAudit(variables.formData, auditors),
    onSuccess: (response) => {
      if (response.success) {
        router.push(`/users/${user.address}`);
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
              direction: "bottom-center",
            });
        }
      }
    },
    onError: (error) => {
      console.log(error);
      show({
        content: <ErrorToast text="something went wrong, try again later" />,
        autoClose: true,
        direction: "bottom-center",
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
        disabled={isPending || !user}
        userId={user.id}
        auditors={auditors}
        setAuditors={setAuditors}
        errors={errors}
      />
    </form>
  );
};

export default AuditCreation;
