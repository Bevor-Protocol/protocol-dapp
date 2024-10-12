"use client";

import { notificationAction } from "@/actions";
import { History as HistoryIcon } from "@/assets";
import { Row } from "@/components/Box";
import { Button } from "@/components/Button";
import { HistoryPanel } from "@/components/Panel/Content/history";
import { usePanel } from "@/hooks/useContexts";
import { ActionI } from "@/utils/types/prisma";
import { useMutation } from "@tanstack/react-query";

const AuditHistory = ({
  auditId,
  actions,
  hasPendingNotifications,
}: {
  auditId: string;
  actions: ActionI[];
  hasPendingNotifications: boolean;
}): JSX.Element => {
  const { show } = usePanel();
  const { mutateAsync } = useMutation({
    mutationFn: () => notificationAction.updateUserNotificationByAuditId(auditId),
  });
  const handleClick = (): void => {
    if (hasPendingNotifications) {
      mutateAsync();
    }
    show(<HistoryPanel actions={actions} />);
  };

  return (
    <Row className="w-full justify-end pb-2">
      <Button className="relative" onClick={handleClick} disabled={!actions.length}>
        History
        <HistoryIcon height="0.75rem" width="0.75rem" fill="currentColor" />
        {hasPendingNotifications && (
          <span className="h-2 w-2 rounded-full mb-auto bg-red-400 absolute top-1 right-1" />
        )}
      </Button>
    </Row>
  );
};

export default AuditHistory;
