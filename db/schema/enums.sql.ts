/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ActionEnum,
  AuditStatusEnum,
  MembershipStatusEnum,
  RoleTypeEnum,
} from "@/utils/types/enum";
import { pgEnum } from "drizzle-orm/pg-core";

const enumToPgEnum = <T extends Record<string, any>>(myEnum: T): [T[keyof T], ...T[keyof T][]] => {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
};

export const actionType = pgEnum("ActionType", enumToPgEnum(ActionEnum));
export const auditStatusType = pgEnum("AuditStatusType", enumToPgEnum(AuditStatusEnum));
export const membershipStatusType = pgEnum(
  "MembershipStatusType",
  enumToPgEnum(MembershipStatusEnum),
);
export const roleType = pgEnum("RoleType", enumToPgEnum(RoleTypeEnum));
