"use client";

import { useMemo, useState } from "react";

import { AuditCardTruncated } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { cn } from "@/utils";
import { AuditStatusEnum } from "@/utils/types/enum";
import { UserAudit } from "@/utils/types/relations";

const initialStateType: Record<AuditStatusEnum, boolean> = {
  [AuditStatusEnum.DISCOVERY]: true,
  [AuditStatusEnum.ATTESTATION]: true,
  [AuditStatusEnum.AUDITING]: true,
  [AuditStatusEnum.CHALLENGEABLE]: true,
  [AuditStatusEnum.FINALIZED]: true,
};

const statusMapper: Record<AuditStatusEnum, string> = {
  [AuditStatusEnum.DISCOVERY]: "open",
  [AuditStatusEnum.ATTESTATION]: "locked",
  [AuditStatusEnum.AUDITING]: "ongoing",
  [AuditStatusEnum.CHALLENGEABLE]: "challengeable",
  [AuditStatusEnum.FINALIZED]: "completed",
};

const initialOwnerState = {
  owner: true,
  auditor: true,
};

const UserAudits = ({
  address,
  audits,
  isOwner,
  pendingNotifications,
}: {
  address: string;
  audits: UserAudit[];
  isOwner: boolean;
  pendingNotifications: string[];
}): JSX.Element => {
  const [typeFilter, setTypeFilter] = useState(initialStateType);
  const [ownerFilter, setOwnerFilter] = useState(initialOwnerState);
  const [unreadOnlyFilter, setUnreadOnlyFilter] = useState(false);

  // elected to just do filtering client-side
  const auditsShow = useMemo(() => {
    return audits.filter((audit) => {
      if (!typeFilter[audit.status]) {
        return false;
      }
      if (!ownerFilter.owner) {
        if (address == audit.owner.address) {
          return false;
        }
      }
      if (!ownerFilter.auditor) {
        if (address !== audit.owner.address) {
          return false;
        }
      }
      if (unreadOnlyFilter) {
        if (!pendingNotifications.includes(audit.id)) {
          return false;
        }
      }
      return true;
    });
  }, [address, audits, typeFilter, ownerFilter, unreadOnlyFilter, pendingNotifications]);

  return (
    <div className="grid grid-cols-5 relative">
      <Column className="gap-2 sticky top-10 self-start sm:hidden">
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
                  <p>{statusMapper[k as keyof typeof AuditStatusEnum]}</p>
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
      <Row className="col-start-2 col-end-6 flex-wrap sm:col-start-1">
        {auditsShow.map((audit) => (
          <AuditCardTruncated
            key={audit.id}
            audit={audit}
            isProtocolOwner={address == audit.owner.address}
            showNoti={pendingNotifications.includes(audit.id)}
          />
        ))}
        {auditsShow.length === 0 && <p className="w-full text-center">no audits to show</p>}
      </Row>
    </div>
  );
};

export default UserAudits;
