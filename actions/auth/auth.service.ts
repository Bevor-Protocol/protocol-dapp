"use server";

import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { getIronSession, type IronSession } from "iron-session";

import { sessionOptions, type SessionData } from "@/utils/session";

export const getSession = async (): Promise<IronSession<SessionData>> => {
  return await getIronSession<SessionData>(cookies(), sessionOptions);
};

export const verifyMessage = (
  message: string,
  signature: string,
  session: IronSession<SessionData>,
  domain: string,
): Promise<void> => {
  const siweMessage = new SiweMessage(message);
  return siweMessage
    .verify({ signature, nonce: session.nonce, domain })
    .then(({ data, success, error }) => {
      if (!success) {
        session.destroy();
        throw error;
      }
      session.siwe = data;
      return session.save();
    });
};
