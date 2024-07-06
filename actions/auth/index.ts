"use server";

import { generateNonce } from "siwe";
import * as AuthService from "./auth.service";
import { headers } from "next/headers";

export const nonce = async (): Promise<string> => {
  const session = await AuthService.getSession();
  session.nonce = generateNonce();
  await session.save();

  return session.nonce;
};

export const getUser = async (): Promise<{ success: boolean; address?: string }> => {
  const session = await AuthService.getSession();

  return {
    success: !!session.siwe,
    address: session.siwe?.address,
  };
};

export const verify = async (message: string, signature: string): Promise<void> => {
  const session = await AuthService.getSession();
  const domain = headers().get("x-forwarded-host") ?? "";

  await AuthService.verifyMessage(message, signature, session, domain);
};

export const logout = async (): Promise<boolean> => {
  const session = await AuthService.getSession();
  session.destroy();
  return true;
};
