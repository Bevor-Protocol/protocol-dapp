"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useModal } from "@/hooks/useContexts";
import { Column, Row } from "@/components/Box";
import { AuditI } from "@/utils/types/prisma";
// import * as Form from "@/components/Form";
import { auditController } from "@/actions";
import { AuditorStatus } from "@prisma/client";
import { AuditorItem } from "@/components/Audit";
import { Button } from "@/components/Button";
import { X } from "@/assets";

const RequestsEdit = ({ audit }: { audit: AuditI }): JSX.Element => {
  const requestedAuditors = audit.auditors.filter(
    (auditor) => auditor.status !== AuditorStatus.VERIFIED,
  );
  const initialState = requestedAuditors.map((auditor) => {
    switch (auditor.status) {
      case AuditorStatus.REJECTED:
        return -1;
      case AuditorStatus.REQUESTED:
        return 0;
    }
    return 0;
  });

  const { toggleOpen } = useModal();
  const [checked, setChecked] = useState<(1 | -1 | 0)[]>([...initialState]);
  // const [showRejected, setShowRejected] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: {
      id: string;
      auditorsApprove: string[];
      auditorsReject: string[];
    }) => {
      return auditController.owner.updateRequestors(
        variables.id,
        variables.auditorsApprove,
        variables.auditorsReject,
      );
    },
    onSettled: (data) => {
      console.log(data);
      toggleOpen();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Need to explicitly control for checkbox inputs, especially those that can be disabled.
    const toApprove = requestedAuditors
      .filter((_, ind) => checked[ind] == 1)
      .map((auditor) => auditor.user.id);
    const toReject = requestedAuditors
      .filter((_, ind) => checked[ind] == -1)
      .map((auditor) => auditor.user.id);
    mutate({ id: audit.id, auditorsApprove: toApprove, auditorsReject: toReject });
  };

  const handleReset = (): void => {
    setChecked([...initialState]);
  };

  const handleChange = (ind: number, action: string): void => {
    const data = [...checked];
    const newCheck = action == "reject" ? -1 : 1;
    if (initialState[ind] !== 0 && newCheck == data[ind]) {
      return;
    }
    if (data[ind] === newCheck) {
      data[ind] = 0;
    } else {
      data[ind] = newCheck;
    }
    setChecked(data);
  };

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <div
        onClick={(): void => toggleOpen()}
        className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10"
      >
        <X height="1rem" width="1rem" />
      </div>
      <p>Reject or Verify Auditors</p>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <div className="grid grid-cols-6 text-sm">
        <p style={{ gridColumn: "1/5" }}>Auditor</p>
        <p style={{ gridColumn: "5/6" }} className="justify-self-center">
          Reject
        </p>
        <p style={{ gridColumn: "6/7" }} className="justify-self-center">
          Verify
        </p>
      </div>
      <Column className="items-stretch gap-2 my-2 h-[calc(5*32px)] overflow-y-scroll">
        {requestedAuditors.map((auditor, ind) => (
          <div className="grid grid-cols-6 text-sm" key={ind}>
            <AuditorItem auditor={auditor.user} style={{ cursor: "default", gridColumn: "1/5" }} />
            <input
              type="checkbox"
              onChange={() => handleChange(ind, "reject")}
              checked={checked[ind] == -1}
              className="cursor-pointer justify-self-center"
              disabled={isPending}
              style={{ gridColumn: "5/6" }}
            />
            <input
              type="checkbox"
              onChange={() => handleChange(ind, "verify")}
              checked={checked[ind] == 1}
              className="cursor-pointer justify-self-center"
              disabled={isPending}
              style={{ gridColumn: "6/7" }}
            />
          </div>
        ))}
      </Column>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Row className="gap-4 justify-end">
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
        <Button type="reset" disabled={isPending}>
          Reset
        </Button>
      </Row>
    </form>
  );
};

export default RequestsEdit;
