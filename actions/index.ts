export * as wishlistController from "./wishlist";
export * as userController from "./user";
export * as authController from "./auth";
export * as contractController from "./contract";
export * as statController from "./stat";

import * as auditControllerTemp from "./audit";
import * as auditorController from "./audit/auditor";
import * as ownerController from "./audit/owner";

export const auditController = {
  ...auditControllerTemp,
  owner: ownerController,
  auditor: auditorController,
};
