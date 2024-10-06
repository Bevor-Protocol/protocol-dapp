import { User } from "@prisma/client";
import { AuditStateEnum, ErrorTypeEnum } from "./enum";
import { AuditI } from "./prisma";

export type UserSearchI = {
  search: string;
  isOwner: boolean;
  isAuditor: boolean;
};

export type LeaderboardI = {
  name: string;
  money: number;
  active: number;
  completed: number;
  available: boolean;
};

export type SortLeaderI = {
  key: string;
  decrease: boolean;
  arr: LeaderboardI[];
};

export type MarkdownAuditsI = {
  details: string;
  globalReveal: boolean;
  pendingCliff: boolean;
  findings: {
    user: User;
    submitted: boolean;
    owner: boolean;
    reveal: boolean;
    markdown: string;
  }[];
};

export type HomeStatI = {
  action: () => Promise<number>;
  symbol?: string;
  text: string;
  queryKey: string;
};

export type AuditStateI = {
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

export interface UserStats {
  moneyPaid: number;
  moneyEarned: number;
  numAuditsCreated: number;
  numAuditsAudited: number;
  numWishlist: number;
}

export interface ErrorTypeI {
  type: ErrorTypeEnum;
  message: string;
  validationErrors: Record<string, string>;
}

export interface ResponseSuccessI<T> {
  success: true;
  data: T;
  error?: never;
  type?: never;
  validationErrors?: never;
}
export interface ResponseFailureI {
  success: false;
  data?: never;
  error: ErrorTypeI;
}

export type ResponseI<T> = ResponseSuccessI<T> | ResponseFailureI;

export interface RoleSuccess {
  allowed: true;
  audit: AuditI;
}

export interface RoleFailure {
  allowed: false;
  audit: AuditI | null;
}

export type RoleI = RoleSuccess | RoleFailure;

export type CustomErrorType = Error & {
  type: ErrorTypeEnum;
};
