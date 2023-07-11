"use client";

import { useState, useRef } from "react";
import Jazzicon from "react-jazzicon";

import * as Styled from "@/styles/pages.styled";

type ArrI = {
  auditee: string;
  auditors: string[];
  money: number;
  description: string;
  status: string;
};

export default ({ arr, mounted }: { arr: ArrI[]; mounted: boolean }): JSX.Element => {
  const [cont, setCont] = useState("");
  const tooltip = useRef<HTMLDivElement>(null);

  const handleToolTip = (event: React.MouseEvent<HTMLElement>): void => {
    if (!tooltip.current) return;
    const { auditor } = event.currentTarget.dataset;
    const { x, y } = event.currentTarget.getBoundingClientRect();
    const { scrollY } = window;

    tooltip.current.style.top = `${scrollY + y - 14 - 8 - 8}px`;
    tooltip.current.style.left = `${x}px`;
    tooltip.current.style.display = "block";
    setCont(auditor || "");
  };

  const clearToolTip = (): void => {
    if (!tooltip.current) return;
    tooltip.current.style.display = "none";
    setCont("");
  };

  return (
    <Styled.AuditGroup>
      {arr.map((audit, ind) => (
        <Styled.Audit key={ind}>
          <Styled.AuditContent>
            <Styled.Icon $size="large">
              {mounted && (
                <Jazzicon
                  diameter={75}
                  seed={Math.round((ind / arr.length) * 10000000)}
                  paperStyles={{ minWidth: "75px", minHeight: "75px" }}
                />
              )}
            </Styled.Icon>
            <div className="text">
              <h4>{audit.auditee}</h4>
              <p>{audit.description}</p>
            </div>
            <div>${audit.money.toLocaleString()}</div>
          </Styled.AuditContent>
          <Styled.AuditFooter $disabled={audit.status !== "closed"}>
            <div>{audit.status}</div>
            <Styled.AuditAuditors>
              <span>auditors:</span>
              {audit.status !== "soon" ? (
                audit.auditors.map((auditor, ind2) => (
                  <Styled.Icon
                    $size="small"
                    data-auditor={auditor}
                    key={ind2}
                    onMouseOver={handleToolTip}
                    onMouseOut={clearToolTip}
                  >
                    {mounted && (
                      <Jazzicon
                        seed={Math.round((ind2 / arr.length) * 10000000)}
                        paperStyles={{
                          minWidth: "25px",
                          minHeight: "25px",
                          maxWidth: "25px",
                          maxHeight: "25px",
                        }}
                      />
                    )}
                  </Styled.Icon>
                ))
              ) : (
                <span>TBD</span>
              )}
            </Styled.AuditAuditors>
            <Styled.AuditTooltip ref={tooltip}>{cont}</Styled.AuditTooltip>
            <div className="competition">View Competition</div>
          </Styled.AuditFooter>
        </Styled.Audit>
      ))}
    </Styled.AuditGroup>
  );
};
