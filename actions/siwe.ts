"use server";

import { cookies } from "next/headers";
import { generateNonce, SiweMessage } from "siwe";
import { getIronSession, type IronSession } from "iron-session";

import { sessionOptions, type SessionData } from "@/lib/session";

export const getSession = async (): Promise<IronSession<SessionData>> => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  return session;
};

export const nonce = async (): Promise<string> => {
  const session = await getSession();
  session.nonce = generateNonce();
  await session.save();

  return session.nonce;
};

export const verify = async ({
  message,
  signature,
}: {
  message: string;
  signature: string;
}): Promise<void> => {
  const session = await getSession();

  const siweMessage = new SiweMessage(message);

  return siweMessage
    .verify({ signature, nonce: session.nonce })
    .then(({ data, success, error }) => {
      if (!success) {
        session.destroy();
        throw error;
      }
      session.siwe = data;
      return session.save();
    });
};

export const getUser = async (): Promise<{ success: boolean; address?: string }> => {
  const session = await getSession();
  if (!session.siwe) {
    return {
      success: false,
    };
  }
  return {
    success: true,
    address: session.siwe.address,
  };
};

export const logout = async (): Promise<boolean> => {
  const session = await getSession();
  session.destroy();
  return true;
};
