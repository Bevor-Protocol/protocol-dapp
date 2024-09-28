import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";

import { sessionOptions, type SessionData } from "@/utils/session";

class AuthService {
  async getSession(): Promise<IronSession<SessionData>> {
    return await getIronSession<SessionData>(cookies(), sessionOptions);
  }

  verifyMessage(
    message: string,
    signature: string,
    session: IronSession<SessionData>,
    domain: string,
  ): Promise<void> {
    const siweMessage = new SiweMessage(message);
    return siweMessage
      .verify({ signature, nonce: session.nonce, domain })
      .then(({ data, success, error }) => {
        if (!success) {
          session.destroy();
          throw error;
        }
        session.siwe = data;
        session.save();
      });
  }
}

const authService = new AuthService();
export default authService;
