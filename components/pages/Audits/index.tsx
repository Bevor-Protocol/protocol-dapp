"use client";

import styled from "styled-components";

import { useState, useEffect } from "react";
import { audits } from "@/utils/constants";
import { Column } from "@/components/Box";
import { H2 } from "@/components/Text";

import Audit from "./Audit";

const AuditSection = styled.div`
  width: 100%;
  margin: 2rem;

  & ${H2} {
    margin-bottom: 1rem;
  }
`;

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
    <Column $gap="rem2">
      <AuditSection>
        <H2>Open Audits</H2>
        <Audit arr={arrActive} mounted={mounted} />
      </AuditSection>
      <AuditSection>
        <H2>Pending Audits</H2>
        <Audit arr={arrSoon} mounted={mounted} />
      </AuditSection>
      <AuditSection>
        <H2>Closed Audits</H2>
        <Audit arr={arrClosed} mounted={mounted} />
      </AuditSection>
    </Column>
  );
};
