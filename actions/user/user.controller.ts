import { Prisma, Users } from "@prisma/client";
import BlobService from "../blob/blob.service";
import UserService from "./user.service";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import { parseForm, userSchema, userSchemaCreate } from "@/utils/validations";

class UserController {
  constructor(
    private readonly userService: typeof UserService,
    private readonly blobService: typeof BlobService,
  ) {}

  async currentUser(): Promise<{ address: string; user: Users | null }> {
    return await this.userService.currentUser();
  }

  async getProfile(address: string): Promise<Users | null> {
    return UserService.getProfile(address);
  }

  async createUser(address: string, formData: FormData): Promise<Users> {
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

    return this.userService.createUser(dataPass);
  }

  async updateUser(id: string, formData: FormData): Promise<Users> {
    const parsed = parseForm(formData, userSchema);

    const { image, ...rest } = parsed;
    const dataPass: Prisma.UsersUpdateInput = {
      ...rest,
    };

    const blobData = await this.blobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    return this.userService.updateUser(id, dataPass);
  }

  async getUserAudits(address: string): Promise<AuditTruncatedI[]> {
    return UserService.userAudits(address);
  }

  async getLeaderboard(key?: string, order?: string): Promise<UserWithCount[]> {
    return UserService.getLeaderboard(key, order);
  }

  async searchAuditors(query?: string): Promise<Users[]> {
    return UserService.searchAuditors(query);
  }
}

const userController = new UserController(UserService, BlobService);
export default userController;
