"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import { auditAction } from "@/actions";
import { X } from "@/assets";
import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
import * as Form from "@/components/Form";
import ErrorToast from "@/components/Toast/Content/error";
import { useModal, useToast } from "@/hooks/useContexts";
import { cn } from "@/utils";
import { ErrorTypeEnum } from "@/utils/types/enum";
import { AuditI } from "@/utils/types/prisma";
import React from "react";

const AuditorAttest = ({ audit }: { audit: AuditI }): JSX.Element => {
  const { hide } = useModal(); // const [showRejected, setShowRejected] = useState(false);
  const [comment, setComment] = useState("");
  const { show } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { status: boolean }) => {
      return auditAction.auditor.attestToTerms(audit.id, variables.status, comment);
    },
    onSuccess: (response) => {
      if (response.success) {
        hide();
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
              autoCloseReady: true,
            });
        }
      }
    },
    onError: (error) => {
      console.log(error);
      show({
        content: <ErrorToast text="something went wrong, try again later" />,
        autoClose: true,
        autoCloseReady: true,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setErrors({});
    setComment(e.currentTarget.value);
  };

  return (
    <div>
      <div onClick={hide} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
        <X height="1rem" width="1rem" />
      </div>
      <p>Attest to the Terms</p>
      <p className="text-sm my-2">
        Make sure you review the audit details and the terms of the audit before agreeing to, or
        rejecting, the terms set. This is irreversible. Once all verified auditors agree to the
        terms, the audit process will begin. If you reject, the auditor will adjust the terms
        accordingly and the attestation statuses will be reset. If an auditor leaves the audit, the
        attestation statuses will be reset for everyone as well.
      </p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <div className="relative">
        <Form.TextArea
          name="comment"
          text="Comment"
          placeholder="Leave a comment"
          value={comment}
          onChange={handleChange}
          isError={"comment" in errors}
        />
        <div
          className={cn("absolute top-1 right-0 text-xs", comment.length > 160 && "text-red-500")}
        >
          {comment.length} / 160
        </div>
      </div>
      <Row className="gap-4 justify-end my-4">
        <Button
          onClick={() => mutate({ status: true })}
          disabled={isPending || comment.length > 160}
        >
          Accept Terms
        </Button>
        <Button
          onClick={() => mutate({ status: false })}
          disabled={isPending || comment.length > 160}
        >
          Reject Terms
        </Button>
      </Row>
      {errors &&
        Object.values(errors).map((error, ind) => (
          <p key={ind} className="text-xs text-red-500">
            {error}
          </p>
        ))}
    </div>
  );
};

export default AuditorAttest;
