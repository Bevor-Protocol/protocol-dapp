"use client";

import { History } from "@/assets";
import { HistoryI } from "@/lib/types";
import { useModal } from "@/lib/hooks";
import { HistoryPanel } from "@/components/Panel/Content/history";

const AuditHistory = ({ history }: { history: HistoryI[] }): JSX.Element => {
  const { togglePanelOpen, setPanelContent } = useModal();

  const handleClick = (): void => {
    setPanelContent(<HistoryPanel history={history} />);
    togglePanelOpen();
  };

  return (
    <div className="absolute -right-10 top-0 cursor-pointer" onClick={handleClick}>
      <History height="1.5rem" width="1.5rem" fill="white" />
    </div>
  );
};

export default AuditHistory;