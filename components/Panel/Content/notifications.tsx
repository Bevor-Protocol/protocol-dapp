import { X } from "@/assets";
import { AuditorItemSimple } from "@/components/Audit";
import { Column, HoverItem, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { usePanel } from "@/hooks/useContexts";
import { cn } from "@/utils";
import { timeSince } from "@/utils/dates";
import { UserNotificationI } from "@/utils/types/prisma";
import { ActionType } from "@prisma/client";

export const NotificationPanel = ({
  notifications,
}: {
  notifications: Record<string, { meta: string; notifications: UserNotificationI[] }>;
}): JSX.Element => {
  const { hide } = usePanel();

  return (
    <Column className="relative max-h-full">
      <div onClick={hide} className="cursor-pointer absolute top-0 right-4">
        <X height="1.25rem" width="1.25rem" />
      </div>
      <div className="mb-4">Unread Notifications</div>
      <Column className="gap-6 text-left overflow-y-scroll flex-grow w-full">
        {Object.entries(notifications).map(([auditId, data]) => (
          <div key={auditId}>
            <p>{data.meta}</p>
            <HoverItem className="flex flex-col">
              <DynamicLink className="px-2 w-full" href={`/audits/view/${auditId}`} onClick={hide}>
                <Column>
                  {data.notifications.map((notification) => (
                    <div key={notification.id}>
                      <AuditorItemSimple auditor={notification.action.membership.user} />
                      <Row className="justify-between items-center">
                        <Row className="bg-dark shadow rounded-lg p-1 w-fit text-xs items-center gap-1 m-1">
                          <span
                            className={cn(
                              "h-1 w-1 rounded-full mb-auto",
                              notification.action.type == ActionType.AUDITOR_LEFT && "bg-red-400",
                              notification.action.type == ActionType.AUDITOR_TERMS_APPROVED &&
                                "bg-green-600",
                              notification.action.type == ActionType.AUDITOR_TERMS_REJECTED &&
                                "bg-red-400",
                              notification.action.type == ActionType.OWNER_EDITED && "bg-gray-600",
                              notification.action.type == ActionType.AUDITOR_FINDINGS &&
                                "bg-green-600",
                              notification.action.type == ActionType.OWNER_LOCKED && "bg-gray-600",
                              notification.action.type == ActionType.OWNER_OPENED && "bg-gray-600",
                              notification.action.type == ActionType.OWNER_FINALIZED &&
                                "bg-green-600",
                              notification.action.type == ActionType.OWNER_REVEALED &&
                                "bg-green-600",
                            )}
                          />
                          <span>
                            {notification.action.type == ActionType.AUDITOR_LEFT && "Left Audit"}
                            {notification.action.type == ActionType.AUDITOR_TERMS_APPROVED &&
                              "Approved Terms"}
                            {notification.action.type == ActionType.AUDITOR_TERMS_REJECTED &&
                              "Rejected Audit"}
                            {notification.action.type == ActionType.OWNER_EDITED && "Edited Audit"}
                            {notification.action.type == ActionType.AUDITOR_FINDINGS &&
                              "Submitted Findings"}
                            {notification.action.type == ActionType.OWNER_LOCKED && "Locked Audit"}
                            {notification.action.type == ActionType.OWNER_OPENED &&
                              "Re-Opened Audit"}
                            {notification.action.type == ActionType.OWNER_FINALIZED &&
                              "Kicked off Audit (on-chain)"}
                            {notification.action.type == ActionType.OWNER_REVEALED &&
                              "Requested to view Findings (on-chain)"}
                          </span>
                        </Row>
                        <div className="text-xs text-white/60">
                          {timeSince(notification.createdAt)}
                        </div>
                      </Row>
                    </div>
                  ))}
                </Column>
              </DynamicLink>
            </HoverItem>
          </div>
        ))}
      </Column>
    </Column>
  );
};
