import { handleErrors } from "@/utils/decorators";
import { ResponseI } from "@/utils/types";
import { WishlistWithReceiver } from "@/utils/types/relations";
import { revalidatePath } from "next/cache";
import RoleService from "../roles/roles.service";
import UserService from "../user/user.service";
import WishlistService from "./wishlist.service";

// Might want to add some revalidations here.

class WishlistController {
  constructor(
    private readonly wishlistService: typeof WishlistService,
    private readonly roleService: typeof RoleService,
    private readonly userService: typeof UserService,
  ) {}

  async isWishlisted(requestor: string, receiver: string): Promise<boolean> {
    const entry = await this.wishlistService.getWishlistEntry(requestor, receiver);
    return !!entry;
  }

  getUserWishlist(requestor: string): Promise<WishlistWithReceiver[]> {
    return this.wishlistService.getUserWishlist(requestor);
  }

  @handleErrors
  async addToWishlist(receiver: string): Promise<ResponseI<boolean>> {
    const { id } = await this.roleService.requireAccount();
    await this.wishlistService.addToWishlist(id, receiver);
    const userReceiver = await this.userService.getUserById(receiver);

    revalidatePath(`/users/${userReceiver!.address}`, "page");
    return { success: true, data: true };
  }

  @handleErrors
  async removeFromWishlist(receiver: string): Promise<ResponseI<boolean>> {
    const { id } = await this.roleService.requireAccount();
    await this.wishlistService.removeFromWishlist(id, receiver);
    const userReceiver = await this.userService.getUserById(receiver);

    revalidatePath(`/users/${userReceiver!.address}`, "page");
    return { success: true, data: true };
  }
}

const wishlistController = new WishlistController(WishlistService, RoleService, UserService);
export default wishlistController;
