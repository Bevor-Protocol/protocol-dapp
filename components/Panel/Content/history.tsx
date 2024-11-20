import { X } from "@/assets";
import { AuditorItemSimple } from "@/components/Audit";
import { Column, Row } from "@/components/Box";
import { usePanel } from "@/hooks/useContexts";
import { cn } from "@/utils";
import { timeSince } from "@/utils/dates";
import { ActionEnum, RoleTypeEnum } from "@/utils/types/enum";
import { ActionI } from "@/utils/types/prisma";

export const HistoryPanel = ({ actions }: { actions: ActionI[] }): JSX.Element => {
  const { hide } = usePanel();

  return (
    <Column className="relative max-h-full">
      <div onClick={hide} className="cursor-pointer absolute top-0 right-4">
        <X height="1.25rem" width="1.25rem" />
      </div>
      <div className="mb-4">Audit History</div>
      <Column className="gap-6 text-left overflow-y-scroll flex-grow">
        {actions.map((action) => (
          <div key={action.id} className="pr-4">
            <Row className="justify-between items-center">
              <div className="text-sm">
                {action.membership.role == RoleTypeEnum.OWNER ? "Protocol Owner" : "Auditor"}
              </div>
              <div className="text-xs text-white/60">{timeSince(action.createdAt)}</div>
            </Row>
            <AuditorItemSimple auditor={action.membership.user} />
            <Row className="bg-dark shadow rounded-lg p-1 w-fit text-xs items-center gap-1 m-1">
              <span
                className={cn(
                  "h-1 w-1 rounded-full mb-auto",
                  action.type == ActionEnum.AUDITOR_LEFT && "bg-red-400",
                  action.type == ActionEnum.AUDITOR_TERMS_APPROVED && "bg-green-600",
                  action.type == ActionEnum.AUDITOR_TERMS_REJECTED && "bg-red-400",
                  action.type == ActionEnum.OWNER_EDITED && "bg-gray-600",
                  action.type == ActionEnum.AUDITOR_FINDINGS && "bg-green-600",
                  action.type == ActionEnum.OWNER_LOCKED && "bg-gray-600",
                  action.type == ActionEnum.OWNER_OPENED && "bg-gray-600",
                  action.type == ActionEnum.OWNER_FINALIZED && "bg-green-600",
                  action.type == ActionEnum.OWNER_REVEALED && "bg-green-600",
                )}
              />
              <span>
                {action.type == ActionEnum.AUDITOR_LEFT && "Left Audit"}
                {action.type == ActionEnum.AUDITOR_TERMS_APPROVED && "Approved Terms"}
                {action.type == ActionEnum.AUDITOR_TERMS_REJECTED && "Rejected Audit"}
                {action.type == ActionEnum.OWNER_EDITED && "Edited Audit"}
                {action.type == ActionEnum.AUDITOR_FINDINGS && "Submitted Findings"}
                {action.type == ActionEnum.OWNER_LOCKED && "Locked Audit"}
                {action.type == ActionEnum.OWNER_OPENED && "Re-Opened Audit"}
                {action.type == ActionEnum.OWNER_FINALIZED && "Kicked off Audit (on-chain)"}
                {action.type == ActionEnum.OWNER_REVEALED &&
                  "Requested to view Findings (on-chain)"}
              </span>
            </Row>
            {action.comment && <div className="text-xs text-white/60 mt-2">{action.comment}</div>}
          </div>
        ))}
      </Column>
    </Column>
  );
};
