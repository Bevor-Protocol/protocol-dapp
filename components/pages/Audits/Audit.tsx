"use client";

import { useState, useRef } from "react";
import Jazzicon from "react-jazzicon";
import classNames from "classnames";

import styles from "./styles.module.css";

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
    <div className={styles.audit_wrapper}>
      {arr.map((audit, ind) => (
        <div key={ind} className={styles.audit}>
          <div className={styles.content}>
            <div className={styles.icon}>
              {mounted && (
                <Jazzicon
                  diameter={75}
                  seed={Math.round((ind / arr.length) * 10000000)}
                  paperStyles={{ minWidth: "75px", minHeight: "75px" }}
                />
              )}
            </div>
            <div className={styles.text}>
              <h4>{audit.auditee}</h4>
              <p>{audit.description}</p>
            </div>
            <div>${audit.money.toLocaleString()}</div>
          </div>
          <div className={styles.footer}>
            <div>{audit.status}</div>
            <div className={styles.auditors}>
              <span>auditors:</span>
              {audit.status !== "soon" ? (
                audit.auditors.map((auditor, ind2) => (
                  <div
                    className={styles.icon_small}
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
                  </div>
                ))
              ) : (
                <span>TBD</span>
              )}
            </div>
            <div className={styles.tooltip} ref={tooltip}>
              {cont}
            </div>
            <div className={classNames({ [styles.disabled]: audit.status !== "closed" })}>
              View Competition
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
