import { X } from "@/assets";
import { AuditorItemSimple } from "@/components/Audit";
import { Column, HoverItem, Row } from "@/components/Box";
import DynamicLink from "@/components/Link";
import { useModal } from "@/hooks/useContexts";
import { cn } from "@/utils";
import { timeSince } from "@/utils/dates";
import { HistoryI } from "@/utils/types";
import { HistoryAction } from "@prisma/client";

export const NotificationPanel = ({
  history,
}: {
  history: Record<string, { meta: string; history: HistoryI[] }>;
}): JSX.Element => {
  const { toggleOpen } = useModal();

  return (
    <Column className="relative max-h-full">
      <div onClick={(): void => toggleOpen()} className="cursor-pointer absolute top-0 right-4">
        <X height="1.25rem" width="1.25rem" />
      </div>
      <div className="mb-4">Unread Notifications</div>
      <Column className="gap-6 text-left overflow-y-scroll flex-grow w-full">
        {Object.entries(history).map(([auditId, data]) => (
          <div key={auditId}>
            <p>{data.meta}</p>
            <HoverItem className="flex flex-col">
              <DynamicLink
                className="px-2 w-full"
                href={`/audits/view/${auditId}`}
                onClick={(): void => toggleOpen()}
              >
                <Column>
                  {data.history.map((h) => (
                    <>
                      <AuditorItemSimple auditor={h.user} />
                      <Row className="justify-between items-center">
                        <Row className="bg-dark shadow rounded-lg p-1 w-fit text-xs items-center gap-1 m-1">
                          <span
                            className={cn(
                              "h-1 w-1 rounded-full mb-auto",
                              h.action == HistoryAction.LEFT && "bg-red-400",
                              h.action == HistoryAction.APPROVED && "bg-green-600",
                              h.action == HistoryAction.REJECTED && "bg-red-400",
                              h.action == HistoryAction.EDITED && "bg-gray-600",
                              h.action == HistoryAction.FINDINGS && "bg-green-600",
                              h.action == HistoryAction.LOCKED && "bg-gray-600",
                              h.action == HistoryAction.OPENED && "bg-gray-600",
                              h.action == HistoryAction.FINALIZED && "bg-green-600",
                              h.action == HistoryAction.MINTED && "bg-green-600",
                            )}
                          />
                          <span>
                            {h.action == HistoryAction.LEFT && "Left Audit"}
                            {h.action == HistoryAction.APPROVED && "Approved Terms"}
                            {h.action == HistoryAction.REJECTED && "Rejected Audit"}
                            {h.action == HistoryAction.EDITED && "Edited Audit"}
                            {h.action == HistoryAction.FINDINGS && "Submitted Findings"}
                            {h.action == HistoryAction.LOCKED && "Locked Audit"}
                            {h.action == HistoryAction.OPENED && "Re-Opened Audit"}
                            {h.action == HistoryAction.FINALIZED && "Kicked off Audit (on-chain)"}
                            {h.action == HistoryAction.MINTED &&
                              "Requested to view Findings (on-chain)"}
                          </span>
                        </Row>
                        <div className="text-xs text-white/60">{timeSince(h.createdAt)}</div>
                      </Row>
                    </>
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
