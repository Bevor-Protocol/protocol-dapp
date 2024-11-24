import { AuditStateEnum, ErrorTypeEnum } from "./enum";
import { Audit, User } from "./tables";

export type Leaderboard = User & {
  stats: {
    value_potential: number;
    value_complete: number;
    num_complete: number;
    num_active: number;
    num_wishlist: number;
  };
};

export type ProtocolStat = {
  action: () => Promise<number>;
  text: string;
  queryKey: string;
  symbol?: string;
};

export type AuditState = {
  isAuditOwner: boolean;
  isAuditAuditor: boolean;
  states: {
    [AuditStateEnum.CAN_ADD_REQUEST]: boolean;
    [AuditStateEnum.CAN_MANAGE_REQUESTS]: boolean;
    [AuditStateEnum.CAN_LOCK_AUDIT]: boolean;
    [AuditStateEnum.CAN_REMOVE_VERIFICATION]: boolean;
    [AuditStateEnum.CAN_REMOVE_REQUEST]: boolean;
    [AuditStateEnum.IS_REJECTED]: boolean;
    [AuditStateEnum.CAN_FINALIZE]: boolean;
    [AuditStateEnum.CAN_SUBMIT_FINDINGS]: boolean;
    [AuditStateEnum.CAN_UNLOCK]: boolean;
    [AuditStateEnum.CAN_ATTEST]: boolean;
  };
};

export type MarkdownAudits = {
  details: string;
  globalReveal: boolean;
  pendingCliff: boolean;
  findings: {
    user: User;
    isOwner: boolean;
    reveal: boolean;
    submitted: boolean;
    markdown: string;
  }[];
};

export interface UserStats {
  moneyPaid: number;
  moneyEarned: number;
  numAuditsCreated: number;
  numAuditsAudited: number;
  numWishlist: number;
}

export type UserSearch = {
  search: string;
  isOwner: boolean;
  isAuditor: boolean;
};

export interface RoleSuccess {
  allowed: true;
  audit: Audit;
}

export interface RoleFailure {
  allowed: false;
  audit: Audit | null;
}

export type RoleI = RoleSuccess | RoleFailure;

export type CustomErrorType = Error & {
  type: ErrorTypeEnum;
};
