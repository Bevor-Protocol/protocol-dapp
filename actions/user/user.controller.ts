import { handleErrors } from "@/utils/decorators";
import { ResponseI, UserSearchI } from "@/utils/types";
import { Leaderboard, UserAudit } from "@/utils/types/custom";
import { User, UserInsert } from "@/utils/types/tables";
import { parseForm, userSchema, userSchemaCreate } from "@/utils/validations";
import { revalidatePath } from "next/cache";
import AuthService from "../auth/auth.service";
import BlobService from "../blob/blob.service";
import RoleService from "../roles/roles.service";
import UserService from "./user.service";

/*
Mutations will return a Generic ResponseI type object.

We can't send 4xx/5xx responses in server actions, so we destructure
responses to handle { success: boolean, data: T}, which we can handle client side.

Most mutations will require revalidation of cache.
*/

class UserController {
  constructor(
    private readonly userService: typeof UserService,
    private readonly blobService: typeof BlobService,
    private readonly roleService: typeof RoleService,
    private readonly authService: typeof AuthService,
  ) {}

  getProfile(address: string): Promise<User | undefined> {
    return this.userService.getProfile(address);
  }

  async getCurrentUser(): Promise<{ address: string; user: User | undefined }> {
    const { address } = await this.authService.currentUser();
    const user = await this.getProfile(address);
    return {
      address,
      user,
    };
  }

  @handleErrors
  async createUser(address: string, formData: FormData): Promise<ResponseI<User>> {
    const parsed = parseForm(formData, userSchemaCreate);
    const { image, ...rest } = parsed;
    const dataPass: UserInsert = {
      address,
      ...rest,
    };

    const blobData = await this.blobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    const data = await this.userService.createUser(dataPass);
    // inject the userId into the session data, for quick access and prevent
    // having to go to DB every time to verify that an SIWE authenticated address
    // has a Bevor account.
    const session = await this.authService.getSession();
    await this.authService.updateSession(session, data.id);

    return { success: true, data };
  }

  @handleErrors
  async updateUser(formData: FormData): Promise<ResponseI<User>> {
    const { id } = await this.roleService.requireAccount();
    const parsed = parseForm(formData, userSchema);

    const { image, ...rest } = parsed;
    const dataPass: UserInsert = {
      ...rest,
    };

    const blobData = await this.blobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    const data = await this.userService.updateUser(id, dataPass);

    revalidatePath(`/users/${data.address}`, "page");
    return { success: true, data };
  }

  getUserAudits(address: string): Promise<UserAudit[]> {
    return this.userService.userAudits(address);
  }

  getLeaderboard(key?: string, order?: "asc" | "desc"): Promise<Leaderboard[]> {
    return this.userService.getLeaderboard(key, order);
  }

  searchUsers(filter: UserSearchI): Promise<User[]> {
    return this.userService.searchUsers(filter);
  }

  searchAuditors(query?: string): Promise<User[]> {
    return this.userService.searchAuditors(query);
  }
}

const userController = new UserController(UserService, BlobService, RoleService, AuthService);
export default userController;
