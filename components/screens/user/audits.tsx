"use client";

import { AuditStatus } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";

import { AuditCardTruncated } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { cn } from "@/utils";
import { checkLocalMostRecentMany } from "@/utils/browser";
import { AuditTruncatedI } from "@/utils/types/prisma";

const initialStateType = {
  [AuditStatus.DISCOVERY]: true,
  [AuditStatus.ATTESTATION]: true,
  [AuditStatus.AUDITING]: true,
  [AuditStatus.CHALLENGEABLE]: true,
  [AuditStatus.FINALIZED]: true,
};

const statusMapper = {
  [AuditStatus.DISCOVERY]: "open",
  [AuditStatus.ATTESTATION]: "locked",
  [AuditStatus.AUDITING]: "ongoing",
  [AuditStatus.CHALLENGEABLE]: "challengeable",
  [AuditStatus.FINALIZED]: "completed",
};

const initialOwnerState = {
  owner: true,
  auditor: true,
};

const UserAudits = ({
  address,
  audits,
  isOwner,
}: {
  address: string;
  audits: AuditTruncatedI[];
  isOwner: boolean;
}): JSX.Element => {
  const [show, setShow] = useState<Record<string, boolean>>({});

  const [typeFilter, setTypeFilter] = useState(initialStateType);
  const [ownerFilter, setOwnerFilter] = useState(initialOwnerState);
  const [unreadOnlyFilter, setUnreadOnlyFilter] = useState(false);

  const auditsShow = useMemo(() => {
    return audits.filter((audit) => {
      if (!typeFilter[audit.status]) {
        return false;
      }
      if (!ownerFilter.owner) {
        if (address == audit.auditee.address) {
          return false;
        }
      }
      if (!ownerFilter.auditor) {
        if (address !== audit.auditee.address) {
          return false;
        }
      }
      if (unreadOnlyFilter) {
        if (!show[audit.id]) {
          return false;
        }
      }
      return true;
    });
  }, [address, audits, show, typeFilter, ownerFilter, unreadOnlyFilter]);

  useEffect(() => {
    if (!isOwner) return;
    const out = checkLocalMostRecentMany(address, audits);
    if (out) setShow(out);
  }, [isOwner, address, audits]);

  return (
    <div className="grid grid-cols-5 relative">
      <Column className="gap-2 sticky top-10 self-start">
        <div>
          <p className="mb-1">Status</p>
          <ul>
            {Object.entries(typeFilter).map(([k, v]) => (
              <li key={k}>
                <label className="flex gap-2 *:text-sm w-fit *:cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className={cn(
                      "appearance-none bg-transparent checked:bg-primary-light-50",
                      "border border-1 border-white",
                      "h-3 w-3 rounded-sm",
                    )}
                    name={k}
                    checked={v}
                    onChange={() => setTypeFilter((prev) => ({ ...prev, [k]: !v }))}
                    onKeyDownCapture={() => setTypeFilter((prev) => ({ ...prev, [k]: !v }))}
                  />
                  <p>{statusMapper[k as keyof typeof AuditStatus]}</p>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1">Owner</p>
          <ul>
            {Object.entries(ownerFilter).map(([k, v]) => (
              <li key={k}>
                <label className="flex gap-2 *:text-sm w-fit *:cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name={k}
                    className={cn(
                      "appearance-none bg-transparent checked:bg-primary-light-50",
                      "border border-1 border-white",
                      "h-3 w-3 rounded-sm",
                    )}
                    checked={v}
                    onChange={() => setOwnerFilter((prev) => ({ ...prev, [k]: !v }))}
                    onKeyDownCapture={() => setOwnerFilter((prev) => ({ ...prev, [k]: !v }))}
                  />
                  <p>{k}</p>
                </label>
              </li>
            ))}
          </ul>
        </div>
        {isOwner && (
          <div>
            <p className="mb-1">Unread Notifications</p>
            <label className="flex gap-2 *:text-sm w-fit *:cursor-pointer items-center">
              <input
                type="checkbox"
                name="unread_only"
                className={cn(
                  "appearance-none bg-transparent checked:bg-primary-light-50",
                  "border border-1 border-white",
                  "h-3 w-3 rounded-sm",
                )}
                checked={unreadOnlyFilter}
                onChange={() => setUnreadOnlyFilter(!unreadOnlyFilter)}
                onKeyDownCapture={() => setUnreadOnlyFilter(!unreadOnlyFilter)}
              />
              <p>Unread Only</p>
            </label>
          </div>
        )}
      </Column>
      <Row className="col-start-2 col-end-6 flex-wrap">
        {auditsShow.map((audit) => (
          <AuditCardTruncated
            key={audit.id}
            audit={audit}
            isProtocolOwner={address == audit.auditee.address}
            showNoti={show && show[audit.id]}
          />
        ))}
      </Row>
    </div>
  );
};

export default UserAudits;
