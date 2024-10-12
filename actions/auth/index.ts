"use server";

import authController from "./auth.controller";

const nonce = async (): Promise<string> => {
  return authController.nonce();
};

const getCurrentUser = async (): Promise<{ address: string; id: string }> => {
  return authController.currentUser();
};

const verify = async (message: string, signature: string): Promise<void> => {
  return authController.verify(message, signature);
};

const logout = async (): Promise<boolean> => {
  return authController.logout();
};

export { getCurrentUser, logout, nonce, verify };
