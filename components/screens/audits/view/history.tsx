"use client";

import { historyAction } from "@/actions";
import { History } from "@/assets";
import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { HistoryPanel } from "@/components/Panel/Content/history";
import { useModal } from "@/hooks/useContexts";
import { HistoryI } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";

const AuditHistory = ({
  auditId,
  history,
  hasPendingNotifications,
}: {
  auditId: string;
  history: HistoryI[];
  hasPendingNotifications: boolean;
}): JSX.Element => {
  const { toggleOpen, setContent } = useModal();
  const { mutateAsync } = useMutation({
    mutationFn: () => historyAction.updateUserHistoryByAuditId(auditId),
  });
  const handleClick = (): void => {
    if (hasPendingNotifications) {
      mutateAsync();
    }
    setContent(<HistoryPanel history={history} />);
    toggleOpen("panel");
  };

  return (
    <Row className="w-full justify-end pb-2">
      <Button className="relative" onClick={handleClick} disabled={!history.length}>
        History
        <History height="0.75rem" width="0.75rem" fill="currentColor" />
        {hasPendingNotifications && (
          <span className="h-2 w-2 rounded-full mb-auto bg-red-400 absolute top-1 right-1" />
        )}
      </Button>
    </Row>
  );
};

export default AuditHistory;
