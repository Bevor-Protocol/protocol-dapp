"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { auditAction } from "@/actions";
import { AuditCard } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { AUDITS } from "@/constants/queryKeys";
import { AuditDetailedI } from "@/utils/types/prisma";
import { AuditStatusType } from "@prisma/client";

const statusMapper = {
  [AuditStatusType.DISCOVERY]: "open",
  [AuditStatusType.ATTESTATION]: "locked",
  [AuditStatusType.AUDITING]: "ongoing",
  [AuditStatusType.CHALLENGEABLE]: "challengeable",
  [AuditStatusType.FINALIZED]: "completed",
};

const statusOrder = [
  AuditStatusType.DISCOVERY,
  AuditStatusType.ATTESTATION,
  AuditStatusType.AUDITING,
  AuditStatusType.CHALLENGEABLE,
  AuditStatusType.FINALIZED,
];

const Audits = ({ initialData }: { initialData: AuditDetailedI[] }): JSX.Element => {
  const [display, setDisplay] = useState<AuditStatusType>(AuditStatusType.DISCOVERY);

  const { data, isPending } = useQuery({
    queryKey: [AUDITS, display],
    queryFn: () => auditAction.getAuditsDetailed(display),
    initialData,
    refetchOnMount: false,
  });

  return (
    <>
      <Row className="gap-4">
        {statusOrder.map((status, ind) => (
          <Toggle
            key={ind}
            active={display === status}
            title={statusMapper[status]}
            onClick={() => setDisplay(status)}
          />
        ))}
      </Row>
      {!isPending && (
        <Column className="gap-4 justify-center items-center w-full">
          {data.length == 0 && <p>Currently no {statusMapper[display]} audits</p>}
          {data.map((audit) => (
            <AuditCard audit={audit} key={audit.id} />
          ))}
        </Column>
      )}
    </>
  );
};

export default Audits;
