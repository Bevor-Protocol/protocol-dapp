import { handleErrors } from "@/utils/decorators";
import { ResponseI, UserSearchI } from "@/utils/types";
import { AuditDetailedI, UserWithCount } from "@/utils/types/prisma";
import { parseForm, userSchema, userSchemaCreate } from "@/utils/validations";
import { Prisma, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
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
  ) {}

  async currentUser(): Promise<{ address: string; user: User | null }> {
    return await this.userService.currentUser();
  }

  async getProfile(address: string): Promise<User | null> {
    return this.userService.getProfile(address);
  }

  @handleErrors
  async createUser(address: string, formData: FormData): Promise<ResponseI<User>> {
    const parsed = parseForm(formData, userSchemaCreate);
    const { image, ...rest } = parsed;
    const dataPass: Prisma.UserCreateInput = {
      address,
      ...rest,
    };

    const blobData = await this.blobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    const data = await this.userService.createUser(dataPass);

    return { success: true, data };
  }

  @handleErrors
  async updateUser(formData: FormData): Promise<ResponseI<User>> {
    const user = await this.roleService.requireAuth();
    const parsed = parseForm(formData, userSchema);

    const { image, ...rest } = parsed;
    const dataPass: Prisma.UserUpdateInput = {
      ...rest,
    };

    const blobData = await this.blobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    const data = await this.userService.updateUser(user.id, dataPass);

    revalidatePath(`/users/${data.address}`, "page");
    return { success: true, data };
  }

  async getUserAudits(address: string): Promise<AuditDetailedI[]> {
    return this.userService.userAudits(address);
  }

  async getLeaderboard(key?: string, order?: "asc" | "desc"): Promise<UserWithCount[]> {
    return this.userService.getLeaderboard(key, order);
  }

  async searchUsers(filter: UserSearchI): Promise<User[]> {
    return this.userService.searchUsers(filter);
  }

  async searchAuditors(query?: string): Promise<User[]> {
    return this.userService.searchAuditors(query);
  }
}

const userController = new UserController(UserService, BlobService, RoleService);
export default userController;
