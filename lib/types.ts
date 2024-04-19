import { Auditors, AuditStatus, Prisma, Users } from "@prisma/client";
import { Address } from "viem";

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
  findings: Record<
    string,
    {
      user: Users;
      markdown: string;
    }
  >;
};

export type AuditDashI = {
  // beneficiary of tokens after they are released
  auditor: Address;
  // beneficiary of tokens after they are released
  auditee: Address;
  // cliff period in seconds
  cliff: number;
  // start time of the vesting period
  start: number;
  // duration of the vesting period in seconds
  duration: number;
  // duration of a slice period for the vesting in seconds
  slicePeriodSeconds: number;
  // whether the vesting is revocable
  withdrawlPaused: boolean;
  // total amount of tokens to be released at the end of the vesting
  amountTotal: number;
  // amount of tokens withdrawn
  withdrawn: number;
  // amount of tokens in escrow for payment
  auditInvalidated: boolean;
  // address of the ERC20 token vesting
  token: Address;
  // address of the ERC721 audit NFT
  tokenId: number;
};

export type HomeStatI = {
  action: () => Promise<number>;
  symbol?: string;
  text: string;
  queryKey: string;
};

export type ModalStateI = {
  toggleOpen: () => void;
  setContent: (content: React.ReactNode) => void;
};

export type UserStateI = {
  user: Users | null | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isPending: boolean;
  isFetched: boolean;
  isFetchedAfterMount: boolean;
};

export interface UserWithCount extends Users {
  stats: {
    valuePotential: number;
    valueComplete: number;
    numActive: number;
    numComplete: number;
  };
}

export type AuditTruncatedI = Prisma.AuditsGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    auditee: true;
  };
}>;

export type AuditDetailedI = Prisma.AuditsGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    price: true;
    duration: true;
    createdAt: true;
    auditee: true;
    auditors: {
      select: {
        user: true;
      };
    };
  };
}>;

export type AuditI = Prisma.AuditsGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    price: true;
    duration: true;
    createdAt: true;
    status: true;
    auditee: true;
    auditors: {
      select: {
        user: true;
        status: true;
        attestedTerms: true;
        acceptedTerms: true;
      };
    };
  };
}>;

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

export type AuditViewI = {
  title: string;
  description: string;
  details: string | null;
  price: number;
  duration: number;
  status: AuditStatus;
  auditee: Users;
  auditors: Auditors[];
  allFindingsExist: boolean;
};

export type UserAuditsI = Prisma.UsersGetPayload<{
  select: {
    auditees: {
      select: {
        auditors: {
          include: {
            user: true;
          };
        };
      };
    };
  };
}>;

export interface UserStats {
  moneyPaid: number;
  moneyEarned: number;
  numAuditsCreated: number;
  numAuditsAudited: number;
}

interface GenericSuccess<T> {
  success: boolean;
  data: T;
  error?: never;
  validationErrors?: never;
}
interface GenericFailure {
  success: boolean;
  data?: never;
  error: string;
  validationErrors?: Record<string, string>;
}

export type GenericUpdateI<T> = GenericSuccess<T> | GenericFailure;
