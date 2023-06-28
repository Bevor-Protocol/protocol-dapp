"use client";

import { useState, useEffect } from "react";
import { audits } from "@/utils/constants";

import styles from "./styles.module.css";
import Audit from "./Audit";

type ArrI = {
  auditee: string;
  auditors: string[];
  money: number;
  description: string;
  status: string;
};

export default (): JSX.Element => {
  const [arrActive, setArrActive] = useState<ArrI[]>([]);
  const [arrSoon, setArrSoon] = useState<ArrI[]>([]);
  const [arrClosed, setArrClosed] = useState<ArrI[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    setArrActive(audits.filter((audit) => audit.status === "open"));
    setArrSoon(audits.filter((audit) => audit.status === "soon"));
    setArrClosed(audits.filter((audit) => audit.status === "closed"));
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.audit_section}>
        <h2>Open Audits</h2>
        <Audit arr={arrActive} mounted={mounted} />
      </div>
      <div className={styles.audit_section}>
        <h2>Pending Audits</h2>
        <Audit arr={arrSoon} mounted={mounted} />
      </div>
      <div className={styles.audit_section}>
        <h2>Closed Audits</h2>
        <Audit arr={arrClosed} mounted={mounted} />
      </div>
    </div>
  );
};
