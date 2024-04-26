import { X } from "@/assets";
import { Column, Row } from "@/components/Box";
import { useModal } from "@/lib/hooks";
import { HistoryI } from "@/lib/types";
import { cn, timeSince } from "@/lib/utils";
import { AuditorItemSimple } from "@/components/Audit";
import { HistoryAction, UserType } from "@prisma/client";

export const HistoryPanel = ({ history }: { history: HistoryI[] }): JSX.Element => {
  const { toggleOpen } = useModal();

  return (
    <Column className="relative max-h-full">
      <div onClick={(): void => toggleOpen()} className="w-fit ml-auto mr-4 cursor-pointer">
        <X height="1.25rem" width="1.25rem" />
      </div>
      <div className="mb-4">Audit History</div>
      <Column className="gap-6 text-left overflow-y-scroll flex-grow">
        {history.map((item) => (
          <div key={item.id} className="pr-4">
            <Row className="justify-between items-center">
              <div className="text-sm">
                {item.userType == UserType.AUDITEE ? "Auditee" : "Auditor"}
              </div>
              <div className="text-xs text-white/60">{timeSince(item.createdAt)}</div>
            </Row>
            {item.userType == UserType.AUDITEE && (
              <AuditorItemSimple auditor={item.audit.auditee} />
            )}
            {item.userType == UserType.AUDITOR && (
              <AuditorItemSimple auditor={item.auditor!.user} />
            )}
            <Row className="bg-dark shadow rounded-lg p-1 w-fit text-xs items-center gap-1 m-1">
              <span
                className={cn(
                  "h-1 w-1 rounded-full mb-auto",
                  item.action == HistoryAction.LEFT && "bg-red-400",
                  item.action == HistoryAction.APPROVED && "bg-green-600",
                  item.action == HistoryAction.REJECTED && "bg-red-400",
                  item.action == HistoryAction.EDITED && "bg-gray-600",
                  item.action == HistoryAction.FINDINGS && "bg-green-600",
                  item.action == HistoryAction.LOCKED && "bg-gray-600",
                  item.action == HistoryAction.OPENED && "bg-gray-600",
                  item.action == HistoryAction.FINALIZED && "bg-green-600",
                )}
              />
              <span>
                {item.action == HistoryAction.LEFT && "Left Audit"}
                {item.action == HistoryAction.APPROVED && "Approved Terms"}
                {item.action == HistoryAction.REJECTED && "Rejected Audit"}
                {item.action == HistoryAction.EDITED && "Edited Audit"}
                {item.action == HistoryAction.FINDINGS && "Submitted Findings"}
                {item.action == HistoryAction.LOCKED && "Locked Audit"}
                {item.action == HistoryAction.OPENED && "Re-Opened Audit"}
                {item.action == HistoryAction.FINALIZED && "Kicked off Audit (on-chain)"}
              </span>
            </Row>
            {item.comment && <div className="text-xs text-white/60 mt-2">{item.comment}</div>}
          </div>
        ))}
      </Column>
    </Column>
  );
};
