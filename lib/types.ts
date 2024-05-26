import { HistoryAction, Prisma, Users, UserType } from "@prisma/client";
import { Address } from "viem";
import { Connector } from "wagmi";

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
    user: Users;
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

export type ModalStateI = {
  toggleOpen: (s?: string) => void;
  setContent: (content: React.ReactNode) => void;
};

export type EventStateI = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setTxn: React.Dispatch<React.SetStateAction<string>>;
  txn: string;
};

export type UserStateI = {
  login: ({ connector }: { connector: Connector }) => void;
  logout: () => void;
  isPendingSign: boolean;
  isPendingConnect: boolean;
  isAuthenticated: boolean;
  isRequestingAccountChange: boolean;
  isRejected: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRequestingAccountChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface UserWithCount extends Users {
  stats: {
    valuePotential: number;
    valueComplete: number;
    numActive: number;
    numComplete: number;
    numWishlist: number;
  };
}

export type AuditFindingsI = Prisma.AuditsGetPayload<{
  select: {
    onchainAuditInfoId: true;
    duration: true;
    price: true;
    cliff: true;
    auditors: {
      select: {
        findings: true;
        user: {
          select: {
            address: true;
          };
        };
      };
    };
  };
}>;

export type AuditTruncatedI = Prisma.AuditsGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    status: true;
    auditee: true;
    history: {
      select: {
        id: true;
      };
    };
  };
}>;

export type AuditDetailedI = Prisma.AuditsGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    price: true;
    duration: true;
    cliff: true;
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
    cliff: true;
    createdAt: true;
    status: true;
    auditee: true;
    details: true;
    onchainAuditInfoId: true;
    onchainNftId: true;
    auditors: {
      select: {
        user: true;
        status: true;
        attestedTerms: true;
        acceptedTerms: true;
      };
    };
    history: {
      select: {
        id: true;
        action: true;
        userType: true;
        comment: true;
        createdAt: true;
        audit: {
          select: {
            auditee: true;
          };
        };
        auditor: {
          select: {
            user: true;
          };
        };
      };
    };
  };
}>;

export type HistoryI = {
  id: string;
  action: HistoryAction;
  userType: UserType;
  comment: string | null;
  createdAt: Date;
  audit: {
    auditee: Users;
  };
  auditor: {
    user: Users;
  } | null;
};

export type WishlistI = Prisma.WishlistGetPayload<{
  select: {
    receiver: true;
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

export interface UserStats {
  moneyPaid: number;
  moneyEarned: number;
  numAuditsCreated: number;
  numAuditsAudited: number;
  numWishlist: number;
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
