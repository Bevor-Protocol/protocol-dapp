import { SessionData, sessionOptions } from "@/utils/session";
import { getIronSession, sealData } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";

export async function GET(): Promise<Response> {
  const cookieList = await cookies();
  const session = await getIronSession<SessionData>(cookieList, sessionOptions);
  if (session.siwe) {
    return Response.json({ user: session.siwe });
  } else {
    return Response.json({ message: "Not authenticated" });
  }
}

export async function POST(): Promise<Response> {
  const cookieList = await cookies();
  const session = await getIronSession<SessionData>(cookieList, sessionOptions);
  if (session.userId) {
    return Response.json({ message: "Already logged in" });
  } else {
    const nonce = "123";
    const chainId = 1337;
    const address = "0x371dD800749329f81Ca39AFD856f90419C62Be15";
    session.siwe = {
      domain: "localhost",
      address,
      statement: "Sign in with Ethereum.",
      uri: "localhost:3000",
      version: "1",
      chainId,
      nonce,
    } as SiweMessage;
    const sealed = await sealData(session, { password: process.env.COOKIE_PSWD as string });
    return Response.json({ cookie: sealed });
  }
}

export async function DELETE(): Promise<Response> {
  const cookieList = await cookies();
  const session = await getIronSession<SessionData>(cookieList, sessionOptions);
  session.destroy();
  return Response.json({ message: "Logged out successfully" });
}
