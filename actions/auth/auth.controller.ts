import { headers } from "next/headers";
import { generateNonce } from "siwe";
import AuthService from "./auth.service";

class AuthController {
  constructor(private readonly authService: typeof AuthService) {}

  async nonce(): Promise<string> {
    const session = await this.authService.getSession();
    session.nonce = generateNonce();
    await session.save();

    return session.nonce;
  }

  async getUser(): Promise<{ success: boolean; address?: string }> {
    const session = await this.authService.getSession();

    return {
      success: !!session.siwe,
      address: session.siwe?.address,
    };
  }

  async verify(message: string, signature: string): Promise<void> {
    const session = await this.authService.getSession();
    const domain = headers().get("x-forwarded-host") ?? "";

    await this.authService.verifyMessage(message, signature, session, domain);
  }

  async logout(): Promise<boolean> {
    const session = await this.authService.getSession();
    session.destroy();
    return true;
  }
}

const authController = new AuthController(AuthService);
export default authController;
