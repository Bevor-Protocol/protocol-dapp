"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { auditAction } from "@/actions";
import { AuditCard } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { AUDITS } from "@/constants/queryKeys";
import { AuditStatusEnum } from "@/utils/types/enum";
import { AuditDetailedI } from "@/utils/types/prisma";

const statusMapper = {
  [AuditStatusEnum.DISCOVERY]: "open",
  [AuditStatusEnum.ATTESTATION]: "locked",
  [AuditStatusEnum.AUDITING]: "ongoing",
  [AuditStatusEnum.CHALLENGEABLE]: "challengeable",
  [AuditStatusEnum.FINALIZED]: "completed",
};

const statusOrder = [
  AuditStatusEnum.DISCOVERY,
  AuditStatusEnum.ATTESTATION,
  AuditStatusEnum.AUDITING,
  AuditStatusEnum.CHALLENGEABLE,
  AuditStatusEnum.FINALIZED,
];

const Audits = ({ initialData }: { initialData: AuditDetailedI[] }): JSX.Element => {
  const [display, setDisplay] = useState<AuditStatusEnum>(AuditStatusEnum.DISCOVERY);

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
