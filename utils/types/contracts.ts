import { Address } from "viem";

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

export type AuditContractStructuredI = {
  protocolOwner: Address;
  token: Address;
  amount: bigint;
  duration: bigint;
  cliff: bigint;
  start: bigint;
  invalidatingProposalId: bigint;
  isActive: boolean;
};

export type VestingContractView = [
  auditor: Address,
  amount: bigint,
  withdrawn: bigint,
  auditId: bigint,
];

export type VestingContractStructuredI = {
  auditor: Address;
  amount: bigint;
  withdrawn: bigint;
  auditId: bigint;
};

export type VestingScheduleStructuredI = {
  vestingScheduleId: bigint | null;
  releasable: string | null;
  withdrawn: string | null;
};
