"use client";

import { useMutation } from "@tanstack/react-query";

import { useModal } from "@/hooks/useContexts";
import { Row } from "@/components/Box";
import * as Form from "@/components/Form";
import { auditController } from "@/actions";
import { Button } from "@/components/Button";
import { X } from "@/assets";
import { useState } from "react";
import { ValidationError } from "@/utils/error";

const UploadFindings = ({
  auditId,
  initial = false,
}: {
  auditId: string;
  initial?: boolean;
}): JSX.Element => {
  const initialFile = initial ? new File([], "") : undefined;
  const { toggleOpen } = useModal();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(initialFile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { formData: FormData }) => {
      return auditController.auditor.addFinding(auditId, variables.formData);
    },
    onSuccess: () => toggleOpen(),
    onError: (error) => {
      if (error instanceof ValidationError) {
        setErrors(error.validationErrors);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!formData) return;
    mutate({ formData });
  };

  return (
    <div>
      <div
        onClick={(): void => toggleOpen()}
        className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10"
      >
        <X height="1rem" width="1rem" />
      </div>
      <p>Upload your Findings</p>
      <p className="text-sm my-2">
        Make sure you review the provided audit details and your submitted findings thoroughly. To
        ensure consistency, this report is FINAL. Be absolutely certain before you submit.
      </p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <form onSubmit={handleSubmit} onChange={() => setErrors({})}>
        <Form.Dropbox
          name="findings"
          disabled={isPending}
          aria-disabled={isPending}
          selected={selectedFile}
          setSelected={setSelectedFile}
        />
        <Row className="gap-4 justify-end">
          <Button disabled={isPending} type="submit">
            Upload Findings
          </Button>
          <Button disabled={isPending} onClick={(): void => toggleOpen()}>
            Cancel
          </Button>
        </Row>
      </form>
      {errors &&
        Object.values(errors).map((error, ind) => (
          <p key={ind} className="text-xs text-red-500">
            {error}
          </p>
        ))}
    </div>
  );
};

export default UploadFindings;
