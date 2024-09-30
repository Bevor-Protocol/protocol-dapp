export * as authAction from "./auth";
export * as contractAction from "./contract";
export * as historyAction from "./history";
export * as statAction from "./stat";
export * as userAction from "./user";
export * as wishlistAction from "./wishlist";

import * as auditActionTemp from "./audit";
import * as auditorAction from "./audit/auditor";
import * as ownerAction from "./audit/owner";

export const auditAction = {
  ...auditActionTemp,
  owner: ownerAction,
  auditor: auditorAction,
};
