"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { auditController } from "@/actions";
import AuditFormEntries from "@/components/Audit/client/form";
import ErrorToast from "@/components/Toast/Content/error";
import { useToast } from "@/hooks/useContexts";
import { ErrorTypeEnum } from "@/utils/types/enum";
import { User } from "@prisma/client";

const AuditCreation = ({ user }: { user: User }): JSX.Element => {
  const router = useRouter();
  const [auditors, setAuditors] = useState<User[]>([]);
  const { toggleOpen: toggleToast, setContent, setReadyAutoClose } = useToast({ autoClose: true });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) =>
      auditController.owner.createAudit(variables.formData, auditors),
    onSuccess: (response) => {
      if (response.success) {
        router.push(`/user/${user.address}`);
      } else {
        const error = response.error;
        switch (error.type) {
          case ErrorTypeEnum.VALIDATION:
          case ErrorTypeEnum.BLOB:
            setErrors(error.validationErrors);
            break;
          default:
            setContent(<ErrorToast text="something went wrong, try again later" />);
            toggleToast();
            setReadyAutoClose(true);
        }
      }
    },
    onError: (error) => {
      console.log(error);
      setContent(<ErrorToast text="something went wrong, try again later" />);
      toggleToast();
      setReadyAutoClose(true);
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
