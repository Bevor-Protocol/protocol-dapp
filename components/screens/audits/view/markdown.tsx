"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { auditAction } from "@/actions";
import { AuditorItem } from "@/components/Audit";
import { Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { Loader } from "@/components/Loader";
import { Toggle } from "@/components/Toggle";
import { MARKDOWN } from "@/constants/queryKeys";
import { AuditI } from "@/utils/types/prisma";
import { User } from "@prisma/client";

const AuditMarkdown = ({ audit, user }: { audit: AuditI; user: User | null }): JSX.Element => {
  const { data, isPending } = useQuery({
    queryKey: [MARKDOWN, audit.id, user?.id ?? ""],
    queryFn: () => auditAction.safeMarkdown(audit),
  });

  const [active, setActive] = useState("details");
  const [findingsActive, setFindingsActive] = useState(0);

  if (isPending || !data) {
    return <Loader className="h-12 w-12" />;
  }

  const handleToggle = (index: number): void => {
    if (data.findings.length > 0) setActive("findings");
    setFindingsActive(index);
  };
  const handleDetails = (): void => {
    setActive("details");
    setFindingsActive(0);
  };

  return (
    <div>
      <Row className="gap-4 justify-start">
        <Toggle active={active === "details"} title={"details"} onClick={handleDetails} />
        {data.findings.length > 0 && (
          <Toggle
            active={active === "findings"}
            title={"findings"}
            onClick={() => handleToggle(0)}
          />
        )}
        {active == "findings" && (
          <>
            {data.findings.map((_, ind) => (
              <Toggle
                active={active === "findings" && findingsActive == ind}
                title={`findings-${ind + 1}`}
                key={ind}
                onClick={() => handleToggle(ind)}
              />
            ))}
          </>
        )}
      </Row>
      {active == "details" && !data.details && <p className="my-4">No details to show</p>}
      {active == "details" && data.details && (
        <div className="markdown" dangerouslySetInnerHTML={{ __html: data.details }} />
      )}
      {active == "findings" && data.findings[findingsActive].owner && (
        <p className="my-2">your submission</p>
      )}
      {active == "findings" && !data.globalReveal && data.findings[findingsActive].owner && (
        <p className="my-2">currently only visible to you</p>
      )}
      {active == "findings" && (
        <Row className="items-center gap-4">
          <p>Auditor:</p>
          <DynamicLink href={`/users/${data.findings[findingsActive].user.address}`}>
            <AuditorItem
              auditor={data.findings[findingsActive].user}
              className="my-4 gap-2 items-center"
            />
          </DynamicLink>
        </Row>
      )}
      {active === "findings" &&
        !data.findings[findingsActive].reveal &&
        data.findings[findingsActive].submitted &&
        !data.pendingCliff && <p className="my-4">Auditor submitted findings. Pending reveal.</p>}
      {active === "findings" &&
        !data.findings[findingsActive].reveal &&
        data.findings[findingsActive].submitted &&
        data.pendingCliff && <p className="my-4">Hidden until the Cliff period is reached.</p>}
      {active === "findings" &&
        !data.findings[findingsActive].reveal &&
        !data.findings[findingsActive].submitted && (
          <p className="my-4">Auditor has not submitted findings.</p>
        )}
      {active === "findings" &&
        data.findings[findingsActive].reveal &&
        !data.findings[findingsActive].submitted && <p className="my-4">Waiting on findings</p>}
      {active === "findings" &&
        data.findings[findingsActive].reveal &&
        data.findings[findingsActive].submitted && (
          <div
            className="markdown"
            dangerouslySetInnerHTML={{ __html: data.findings[findingsActive].markdown }}
          />
        )}
    </div>
  );
};

export default AuditMarkdown;
