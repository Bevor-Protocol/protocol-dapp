"use client";

import { useEffect, useState } from "react";

import { History } from "@/assets";
import { HistoryI } from "@/lib/types";
import { useModal } from "@/lib/hooks";
import { HistoryPanel } from "@/components/Panel/Content/history";
import { checkLocalMostRecent, setLocalMostRecent } from "@/lib/utils";

const AuditHistory = ({
  history,
  auditId,
  user,
  displayNotification,
}: {
  history: HistoryI[];
  auditId: string;
  user: string | undefined;
  displayNotification: boolean;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();
  const [show, setShow] = useState(false);

  const handleClick = (): void => {
    if (displayNotification) {
      setLocalMostRecent(history, auditId, user);
      setShow(false);
    }
    setContent(<HistoryPanel history={history} />);
    toggleOpen("panel");
  };

  useEffect(() => {
    if (!displayNotification) return;
    const shouldShowNoti = checkLocalMostRecent(history, auditId, user);
    setShow(shouldShowNoti);
  }, [auditId, displayNotification, history, user]);

  return (
    <div className="absolute -right-10 top-0 cursor-pointer" onClick={handleClick}>
      <History height="1.5rem" width="1.5rem" fill="white" />
      {show && (
        <span className="h-2 w-2 rounded-full mb-auto bg-red-400 absolute -top-1 -right-1" />
      )}
    </div>
  );
};

export default AuditHistory;
