import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";

import { sessionOptions, type SessionData } from "@/utils/session";
import UserService from "../user/user.service";

class AuthService {
  constructor(private readonly userService: typeof UserService) {}

  async currentUser(): Promise<{ address: string; id: string }> {
    const session = await this.getSession();
    if (!session?.siwe) {
      return {
        address: "",
        id: "",
      };
    }
    const { siwe, userId } = session;
    const { address } = siwe;

    return {
      address,
      id: userId ?? "",
    };
  }

  async getSession(): Promise<IronSession<SessionData>> {
    const cookieStore = await cookies();
    return await getIronSession<SessionData>(cookieStore, sessionOptions);
  }

  async updateSession(session: IronSession<SessionData>, userId: string): Promise<void> {
    session.userId = userId;
    await session.save();
  }

  async verifyMessage(
    message: string,
    signature: string,
    session: IronSession<SessionData>,
    domain: string,
  ): Promise<void> {
    // SIWE verification + adding userId to session (if user exists)
    const siweMessage = new SiweMessage(message);

    const { data, success, error } = await siweMessage.verify({
      signature,
      nonce: session.nonce,
      domain,
    });
    if (!success) {
      session.destroy();
      throw error;
    }
    session.siwe = data;

    const curUser = await this.userService.getProfile(data.address);
    session.userId = curUser?.id ?? "";

    await session.save();
  }
}

const authService = new AuthService(UserService);
export default authService;
