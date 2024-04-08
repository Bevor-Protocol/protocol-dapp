"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAudits } from "@/actions/audits/get";
import { Column, Row } from "@/components/Box";
import { AuditCard } from "@/components/Audit";
import { Toggle } from "@/components/Toggle";
import { AuditsSkeleton } from "@/components/Loader";
import { AuditViewI } from "@/lib/types";

const statuses = ["open", "locked", "ongoing", "completed"];

const Audits = ({ initialData }: { initialData: AuditViewI[] }): JSX.Element => {
  const [display, setDisplay] = useState("open");

  const { data, isFetching } = useQuery({
    queryKey: ["audits", display],
    queryFn: () => getAudits(display),
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
      {isFetching ? (
        <AuditsSkeleton nItems={data.length} />
      ) : (
        <Column className="gap-4 justify-center items-center w-full">
          {data.length == 0 && <p>Currently no {display} audits</p>}
          {data.map((audit, ind) => (
            <AuditCard audit={audit} key={ind} />
          ))}
        </Column>
      )}
    </Column>
  );
};

export default Audits;
