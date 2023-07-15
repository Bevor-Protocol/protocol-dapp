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
  open: AuditI[];
  soon: AuditI[];
  closed: AuditI[];
};
