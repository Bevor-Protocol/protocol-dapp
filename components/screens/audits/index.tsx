"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { auditController } from "@/actions";
import { AuditCard } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { AUDITS } from "@/constants/queryKeys";
import { AuditDetailedI } from "@/utils/types/prisma";

const statuses = ["open", "locked", "ongoing", "challengeable", "completed"];

const Audits = ({ initialData }: { initialData: AuditDetailedI[] }): JSX.Element => {
  const [display, setDisplay] = useState("open");

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
        {statuses.map((status) => (
          <Toggle
            active={display === status}
            title={status}
            onClick={() => setDisplay(status)}
            key={status}
          />
        ))}
      </Row>
      {!isPending && (
        <Column className="gap-4 justify-center items-center w-full">
          {data.length == 0 && <p>Currently no {display} audits</p>}
          {data.map((audit) => (
            <AuditCard audit={audit} key={audit.id} />
          ))}
        </Column>
      )}
    </Column>
  );
};

export default Audits;
