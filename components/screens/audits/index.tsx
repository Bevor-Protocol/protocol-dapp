"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { auditController } from "@/actions";
import { AuditCard } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { AUDITS } from "@/constants/queryKeys";
import { AuditDetailedI } from "@/utils/types/prisma";
import { AuditStatus } from "@prisma/client";

const statusMapper = {
  [AuditStatus.DISCOVERY]: "open",
  [AuditStatus.ATTESTATION]: "locked",
  [AuditStatus.AUDITING]: "ongoing",
  [AuditStatus.CHALLENGEABLE]: "challengeable",
  [AuditStatus.FINALIZED]: "completed",
};

const Audits = ({ initialData }: { initialData: AuditDetailedI[] }): JSX.Element => {
  const [display, setDisplay] = useState<AuditStatus>(AuditStatus.DISCOVERY);

  const { data, isPending } = useQuery({
    queryKey: [AUDITS, display],
    queryFn: () => auditController.getAuditsDetailed(display),
    initialData,
  });

  return (
    <Column className="gap-4 py-8 justify-start items-center w-full max-w-[1000px]">
      <div className="grad-light text-grad">
        <h2 className="text-4xl font-extrabold leading-[normal]">Audits</h2>
      </div>
      <Row className="gap-4">
        <Toggle
          active={display === AuditStatus.DISCOVERY}
          title={statusMapper[AuditStatus.DISCOVERY]}
          onClick={() => setDisplay(AuditStatus.DISCOVERY)}
        />
        <Toggle
          active={display === AuditStatus.ATTESTATION}
          title={statusMapper[AuditStatus.ATTESTATION]}
          onClick={() => setDisplay(AuditStatus.ATTESTATION)}
        />
        <Toggle
          active={display === AuditStatus.AUDITING}
          title={statusMapper[AuditStatus.AUDITING]}
          onClick={() => setDisplay(AuditStatus.AUDITING)}
        />
        <Toggle
          active={display === AuditStatus.CHALLENGEABLE}
          title={statusMapper[AuditStatus.CHALLENGEABLE]}
          onClick={() => setDisplay(AuditStatus.CHALLENGEABLE)}
        />
        <Toggle
          active={display === AuditStatus.FINALIZED}
          title={statusMapper[AuditStatus.FINALIZED]}
          onClick={() => setDisplay(AuditStatus.FINALIZED)}
        />
      </Row>
      {!isPending && (
        <Column className="gap-4 justify-center items-center w-full">
          {data.length == 0 && <p>Currently no {statusMapper[display]} audits</p>}
          {data.map((audit) => (
            <AuditCard audit={audit} key={audit.id} />
          ))}
        </Column>
      )}
    </Column>
  );
};

export default Audits;
