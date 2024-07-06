import type { SessionOptions } from "iron-session";
import type { SiweMessage } from "siwe";

export const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_PSWD as string,
  cookieName: "siwe",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
export interface SessionData {
  siwe?: SiweMessage;
  nonce?: string;
}
