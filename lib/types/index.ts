import { Address } from "wagmi";

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

export type AuditI = {
  auditee: string;
  auditors: string[];
  money: number;
  description: string;
  status: string;
};

export type AuditSSRI = {
  auditShow: AuditI[];
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
};
