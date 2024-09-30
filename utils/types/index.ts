import { HistoryAction, User, UserType } from "@prisma/client";
import { Address } from "viem";
import { ErrorTypeEnum } from "./enum";
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

export type HistoryI = {
  id: string;
  auditId: string;
  action: HistoryAction;
  userType: UserType;
  comment: string | null;
  createdAt: Date;
  user: User;
};

export type AuditStateI = {
  isTheAuditee: boolean;
  isAnAuditor: boolean;
  userIsVerified: boolean;
  userIsRequested: boolean;
  userIsRejected: boolean;
  auditeeCanManageAuditors: boolean;
  auditeeCanLock: boolean;
  userAttested: boolean;
  userAccepted: boolean;
  userSubmitted: boolean;
  allAttested: boolean;
  allSubmitted: boolean;
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

export type AuditContractView = [
  protocolOwner: Address,
  token: Address,
  amount: bigint,
  duration: bigint,
  cliff: bigint,
  start: bigint,
  invalidatingProposalId: bigint,
  isActive: boolean,
];

export type VestingContractView = [
  auditor: Address,
  amount: bigint,
  withdrawn: bigint,
  auditId: bigint,
];

export type CustomErrorType = Error & {
  type: ErrorTypeEnum;
};
