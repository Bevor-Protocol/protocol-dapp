"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { AuditI } from "@/lib/types";
import { AuditorItem } from "@/components/Audit";
import DynamicLink from "@/components/Link";
import { useUser } from "@/lib/hooks";
import { safeGetMarkdown } from "@/actions/audits/general";
import { Loader } from "@/components/Loader";

const AuditMarkdown = ({ audit }: { audit: AuditI }): JSX.Element => {
  const { user, isFetchedAfterMount } = useUser();

  const { data, isPending } = useQuery({
    queryKey: ["markdown", audit.id, user?.id ?? ""],
    queryFn: () => {
      return safeGetMarkdown(audit.id, user?.id);
    },
  });

  const [active, setActive] = useState("details");
  const [findingsActive, setFindingsActive] = useState("");

  if (!isFetchedAfterMount || isPending || !data) {
    return <Loader className="h-12 w-12" />;
  }

  const handleToggle = (userId?: string): void => {
    if (Object.keys(data.findings).length > 0) setActive("findings");
    if (userId) {
      setFindingsActive(userId);
    } else {
      setFindingsActive(Object.keys(data.findings)[0]);
    }
  };
  const handleDetails = (): void => {
    setActive("details");
    setFindingsActive("");
  };

  return (
    <div>
      <Row className="gap-4 justify-start">
        <Toggle active={active === "details"} title={"details"} onClick={handleDetails} />
        {Object.keys(data.findings).length > 0 && (
          <Toggle
            active={active === "findings"}
            title={"findings"}
            onClick={() => handleToggle()}
          />
        )}
        {active == "findings" && (
          <>
            {Object.keys(data.findings).map((userId, ind) => (
              <Toggle
                active={active === "findings" && findingsActive == userId}
                title={`findings-${ind + 1}`}
                key={userId}
                onClick={() => handleToggle(userId)}
              />
            ))}
          </>
        )}
      </Row>
      {!data.details && active == "details" && <p className="my-4">No details to show</p>}
      {active == "findings" && (
        <Row className="items-center gap-4">
          <p>Auditor:</p>
          <DynamicLink href={`/user/${data.findings[findingsActive].user.address}`}>
            <AuditorItem
              auditor={data.findings[findingsActive].user}
              className="my-4 gap-2 items-center"
            />
          </DynamicLink>
        </Row>
      )}
      {active == "details" && data.details && (
        <div className="markdown" dangerouslySetInnerHTML={{ __html: data.details }} />
      )}
      {active == "findings" && data.findings[findingsActive].markdown && (
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: data.findings[findingsActive].markdown }}
        />
      )}
      {active == "findings" && !data.findings[findingsActive].markdown && (
        <p className="my-4">Waiting on findings</p>
      )}
    </div>
  );
};

export default AuditMarkdown;
