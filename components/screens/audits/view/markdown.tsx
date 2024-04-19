"use client";
import { useState } from "react";

import { Row } from "@/components/Box";
import { Toggle } from "@/components/Toggle";
import { MarkdownAuditsI } from "@/lib/types";
import { AuditorItem } from "@/components/Audit";
import DynamicLink from "@/components/Link";

const AuditMarkdown = ({
  markdownObject,
  showFindings,
}: {
  markdownObject: MarkdownAuditsI;
  showFindings: boolean;
}): JSX.Element => {
  const initialUserShow = showFindings
    ? Object.values(markdownObject.findings)[0].user.address
    : "";
  const [active, setActive] = useState("details");
  const [findingsActive, setFindingsActive] = useState(initialUserShow);

  const handleToggle = (userId?: string): void => {
    if (showFindings) setActive("findings");
    if (userId) setFindingsActive(userId);
  };
  const handleDetails = (): void => {
    setActive("details");
    setFindingsActive(initialUserShow);
  };

  return (
    <div>
      <Row className="gap-4 justify-start">
        <Toggle active={active === "details"} title={"details"} onClick={handleDetails} />
        {showFindings && (
          <Toggle
            active={active === "findings"}
            title={"findings"}
            onClick={() => handleToggle()}
          />
        )}
        {active == "findings" && (
          <>
            {Object.keys(markdownObject.findings).map((userId, ind) => (
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
      {!markdownObject.details && active == "details" && <p className="my-4">No details to show</p>}
      {active == "findings" && (
        <Row className="items-center gap-4">
          <p>Auditor:</p>
          <DynamicLink href={`/user/${markdownObject.findings[findingsActive].user.address}`}>
            <AuditorItem
              auditor={markdownObject.findings[findingsActive].user}
              className="my-4 gap-2 items-center"
            />
          </DynamicLink>
        </Row>
      )}
      {active == "details" && markdownObject.details && (
        <div className="markdown" dangerouslySetInnerHTML={{ __html: markdownObject.details }} />
      )}
      {active == "findings" && markdownObject.findings[findingsActive].markdown && (
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: markdownObject.findings[findingsActive].markdown }}
        />
      )}
      {active == "findings" && !markdownObject.findings[findingsActive].markdown && (
        <p className="my-4">Waiting on findings</p>
      )}
    </div>
  );
};

export default AuditMarkdown;
