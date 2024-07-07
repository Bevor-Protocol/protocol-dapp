"use client";

import { useEffect, useState } from "react";
import { AuditStatus } from "@prisma/client";

import { AuditCardTruncated } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { AuditTruncatedI } from "@/utils/types/prisma";
import { checkLocalMostRecentMany } from "@/utils/browser";

const UserAudits = ({
  address,
  audits,
  isOwner,
}: {
  address: string;
  audits: AuditTruncatedI[];
  isOwner: boolean;
}): JSX.Element => {
  const auditsParsed = {
    open: audits.filter((audit) => audit.status === AuditStatus.DISCOVERY),
    locked: audits.filter((audit) => audit.status === AuditStatus.ATTESTATION),
    ongoing: audits.filter((audit) => audit.status === AuditStatus.AUDITING),
    challengeable: audits.filter((audit) => audit.status === AuditStatus.CHALLENGEABLE),
    completed: audits.filter((audit) => audit.status === AuditStatus.FINALIZED),
  };

  const [show, setShow] = useState<Record<string, boolean>>({});
  console.log(show);

  useEffect(() => {
    if (!isOwner) return;
    const out = checkLocalMostRecentMany(address, audits);
    if (out) setShow(out);
  }, [isOwner, address, audits]);

  return (
    <Column className="gap-8 w-full items-stretch">
      {auditsParsed.open.length > 0 && (
        <div className="w-full">
          <p className="my-2">Open:</p>
          <Row className="w-full justify-start flex-wrap">
            {auditsParsed.open.map((audit, ind) => (
              <AuditCardTruncated
                key={ind}
                audit={audit}
                isProtocolOwner={address == audit.auditee.address}
                showNoti={show && show[audit.id]}
              />
            ))}
          </Row>
        </div>
      )}
      {auditsParsed.locked.length > 0 && (
        <div className="w-full">
          <p className="my-2">Locked:</p>
          <Row className="w-full justify-start flex-wrap">
            {auditsParsed.locked.map((audit, ind) => (
              <AuditCardTruncated
                key={ind}
                audit={audit}
                isProtocolOwner={address == audit.auditee.address}
                showNoti={show && show[audit.id]}
              />
            ))}
          </Row>
        </div>
      )}
      {auditsParsed.ongoing.length > 0 && (
        <div className="w-full">
          <p className="my-2">Ongoing:</p>
          <Row className="w-full justify-start flex-wrap">
            {auditsParsed.ongoing.map((audit, ind) => (
              <AuditCardTruncated
                key={ind}
                audit={audit}
                isProtocolOwner={address == audit.auditee.address}
                showNoti={show && show[audit.id]}
              />
            ))}
          </Row>
        </div>
      )}
      {auditsParsed.challengeable.length > 0 && (
        <div className="w-full">
          <p className="my-2">Challengeable:</p>
          <Row className="w-full justify-start flex-wrap">
            {auditsParsed.challengeable.map((audit, ind) => (
              <AuditCardTruncated
                key={ind}
                audit={audit}
                isProtocolOwner={address == audit.auditee.address}
                showNoti={show && show[audit.id]}
              />
            ))}
          </Row>
        </div>
      )}
      {auditsParsed.completed.length > 0 && (
        <div className="w-full">
          <p className="my-2">Closed:</p>
          <Row className="w-full justify-start flex-wrap">
            {auditsParsed.completed.map((audit, ind) => (
              <AuditCardTruncated
                key={ind}
                audit={audit}
                isProtocolOwner={address == audit.auditee.address}
                showNoti={show && show[audit.id]}
              />
            ))}
          </Row>
        </div>
      )}
      {audits.length == 0 && <h2>No Active Audits</h2>}
    </Column>
  );
};

export default UserAudits;
