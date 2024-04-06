"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useModal } from "@/lib/hooks";
import { Column, Row } from "@/components/Box";
import { AuditViewDetailedI } from "@/lib/types";
// import * as Form from "@/components/Form";
import { auditUpdateApprovalStatus } from "@/actions/audits";
import { Auditors, AuditorStatus } from "@prisma/client";
import { AuditorItem } from "@/components/Audit";
import { Button } from "@/components/Button";
import { X } from "@/assets";

const RequestsEdit = ({ audit }: { audit: AuditViewDetailedI }): JSX.Element => {
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
      auditorsApprove: Auditors[];
      auditorsReject: Auditors[];
    }) => {
      return auditUpdateApprovalStatus(
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

  const handleSubmit = (): void => {
    // Need to explicitly control for checkbox inputs, especially those that can be disabled.
    const toApprove = requestedAuditors.filter((_, ind) => checked[ind] == 1);
    const toReject = requestedAuditors.filter((_, ind) => checked[ind] == -1);
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
    <div>
      <div onClick={toggleOpen} className="absolute top-4 right-4 w-5 h-5 cursor-pointer z-10">
        <X height="1rem" width="1rem" />
      </div>
      <p>Reject or Verify Auditors</p>
      <Column className="items-stretch gap-2 pr-4 my-4 h-[calc(5*32px)] overflow-y-scroll">
        {requestedAuditors.map((auditor, ind) => (
          <Row key={ind} className="gap-2">
            <AuditorItem auditor={auditor.user} style={{ cursor: "default" }} />
            <input
              type="checkbox"
              onChange={() => handleChange(ind, "reject")}
              checked={checked[ind] == -1}
              className="cursor-pointer"
              disabled={isPending}
            />
            <input
              type="checkbox"
              onChange={() => handleChange(ind, "verify")}
              checked={checked[ind] == 1}
              className="cursor-pointer"
              disabled={isPending}
            />
          </Row>
        ))}
      </Column>
      <hr className="w-full h-[1px] border-gray-200/20 my-4" />
      <Row className="gap-4 justify-end">
        <Button onClick={handleSubmit} disabled={isPending}>
          Submit
        </Button>
        <Button onClick={handleReset} disabled={isPending}>
          Reset
        </Button>
      </Row>
    </div>
  );
};

export default RequestsEdit;
