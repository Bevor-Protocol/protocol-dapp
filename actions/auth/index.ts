"use server";

import authController from "./auth.controller";

const nonce = async (): Promise<string> => {
  return authController.nonce();
};

const getUser = async (): Promise<{ success: boolean; address?: string }> => {
  return authController.getUser();
};

const verify = async (message: string, signature: string): Promise<void> => {
  return authController.verify(message, signature);
};

const logout = async (): Promise<boolean> => {
  return authController.logout();
};

export { nonce, getUser, verify, logout };
