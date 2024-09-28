import { handleErrors } from "@/utils/decorators";
import { ValidationResponseI } from "@/utils/types";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import { parseForm, userSchema, userSchemaCreate } from "@/utils/validations";
import { Prisma, Users } from "@prisma/client";
import { revalidatePath } from "next/cache";
import BlobService from "../blob/blob.service";
import RoleService from "../roles/roles.service";
import UserService from "./user.service";

/*
Mutations will return a Generic ValidationResponseI type object.

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

  async currentUser(): Promise<{ address: string; user: Users | null }> {
    return await this.userService.currentUser();
  }

  async getProfile(address: string): Promise<Users | null> {
    return this.userService.getProfile(address);
  }

  @handleErrors
  async createUser(address: string, formData: FormData): Promise<ValidationResponseI<Users>> {
    const parsed = parseForm(formData, userSchemaCreate);
    const { image, ...rest } = parsed;
    const dataPass: Prisma.UsersCreateInput = {
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
  async updateUser(formData: FormData): Promise<ValidationResponseI<Users>> {
    const user = await this.roleService.requireAuth();
    const parsed = parseForm(formData, userSchema);

    const { image, ...rest } = parsed;
    const dataPass: Prisma.UsersUpdateInput = {
      ...rest,
    };

    const blobData = await this.blobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    const data = await this.userService.updateUser(user.id, dataPass);

    revalidatePath(`/user/${data.address}`, "page");
    return { success: true, data };
  }

  async getUserAudits(address: string): Promise<AuditTruncatedI[]> {
    return this.userService.userAudits(address);
  }

  async getLeaderboard(key?: string, order?: string): Promise<UserWithCount[]> {
    return this.userService.getLeaderboard(key, order);
  }

  async searchAuditors(query?: string): Promise<Users[]> {
    return this.userService.searchAuditors(query);
  }
}

const userController = new UserController(UserService, BlobService, RoleService);
export default userController;
