"use client";

import { useEffect, useState } from "react";

import { History } from "@/assets";
import { HistoryI } from "@/utils/types";
import { useModal } from "@/hooks/useContexts";
import { HistoryPanel } from "@/components/Panel/Content/history";
import { checkLocalMostRecent, setLocalMostRecent } from "@/utils/browser";
import { Button } from "@/components/Button";
import { Row } from "@/components/Box";

const AuditHistory = ({
  history,
  auditId,
  address,
  displayNotification,
}: {
  history: HistoryI[];
  auditId: string;
  address: string | undefined;
  displayNotification: boolean;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();
  const [show, setShow] = useState(false);

  const handleClick = (): void => {
    if (displayNotification) {
      setLocalMostRecent(history, auditId, address);
      setShow(false);
    }
    setContent(<HistoryPanel history={history} />);
    toggleOpen("panel");
  };

  useEffect(() => {
    if (!displayNotification) return;
    const shouldShowNoti = checkLocalMostRecent(history, auditId, address);
    setShow(shouldShowNoti);
  }, [auditId, displayNotification, history, address]);

  return (
    <Row className="w-full justify-end pb-2">
      <Button className="relative" onClick={handleClick} disabled={!history.length}>
        History
        <History height="0.75rem" width="0.75rem" fill="currentColor" />
        {show && (
          <span className="h-2 w-2 rounded-full mb-auto bg-red-400 absolute top-1 right-1" />
        )}
      </Button>
    </Row>
  );
};

export default AuditHistory;
