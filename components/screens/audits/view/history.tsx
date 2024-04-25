"use client";

import { History } from "@/assets";
import { AuditI } from "@/lib/types";

const HistoryDiv = ({ audit }: { audit: AuditI }): JSX.Element => {
  const handleClick = (): void => {
    console.log(audit.history.length);
  };

  return (
    <div className="absolute -right-6 -top-6 cursor-pointer" onClick={handleClick}>
      <History height="1.5rem" width="1.5rem" fill="white" />
    </div>
  );
};

export default HistoryDiv;
