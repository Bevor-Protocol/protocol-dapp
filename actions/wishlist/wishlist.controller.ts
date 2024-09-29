import { handleErrors } from "@/utils/decorators";
import { ResponseI } from "@/utils/types";
import { WishlistI } from "@/utils/types/prisma";
import { revalidatePath } from "next/cache";
import RoleService from "../roles/roles.service";
import WishlistService from "./wishlist.service";

// Might want to add some revalidations here.

class WishlistController {
  constructor(
    private readonly wishlistService: typeof WishlistService,
    private readonly roleService: typeof RoleService,
  ) {}

  async isWishlisted(requestor: string, receiver: string): Promise<boolean> {
    const entry = await this.wishlistService.getWishlistEntry(requestor, receiver);
    return !!entry;
  }

  getUserWishlist(requestor: string): Promise<WishlistI[]> {
    return this.wishlistService.getUserWishlist(requestor);
  }

  @handleErrors
  async addToWishlist(receiver: string): Promise<ResponseI<WishlistI>> {
    const user = await this.roleService.requireAuth();
    const data = await this.wishlistService.addToWishlist(user.id, receiver);

    revalidatePath(`/users/${data.receiver.address}`, "page");
    return { success: true, data };
  }

  @handleErrors
  async removeFromWishlist(receiver: string): Promise<ResponseI<WishlistI>> {
    const user = await this.roleService.requireAuth();
    const data = await this.wishlistService.removeFromWishlist(user.id, receiver);

    revalidatePath(`/users/${data.receiver.address}`, "page");
    return { success: true, data };
  }
}

const wishlistController = new WishlistController(WishlistService, RoleService);
export default wishlistController;
