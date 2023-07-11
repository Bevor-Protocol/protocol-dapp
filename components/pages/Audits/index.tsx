"use client";

import { useState, useEffect } from "react";
import { audits } from "@/utils/constants";

import * as Styled from "@/styles/pages.styled";
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
    <Styled.AuditMain>
      <Styled.AuditSection>
        <h2>Open Audits</h2>
        <Audit arr={arrActive} mounted={mounted} />
      </Styled.AuditSection>
      <Styled.AuditSection>
        <h2>Pending Audits</h2>
        <Audit arr={arrSoon} mounted={mounted} />
      </Styled.AuditSection>
      <Styled.AuditSection>
        <h2>Closed Audits</h2>
        <Audit arr={arrClosed} mounted={mounted} />
      </Styled.AuditSection>
    </Styled.AuditMain>
  );
};
