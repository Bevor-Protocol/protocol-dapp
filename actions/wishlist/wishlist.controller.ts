import WishlistService from "./wishlist.service";
import { Wishlist } from "@prisma/client";
import { WishlistI } from "@/utils/types/prisma";

// Might want to add some revalidations here.

class WishlistController {
  constructor(private readonly wishlistService: typeof WishlistService) {}

  async isWishlisted(requestor: string, receiver: string): Promise<boolean> {
    const entry = await this.wishlistService.getWishlistEntry(requestor, receiver);
    return !!entry;
  }

  async getUserWishlist(requestor: string): Promise<WishlistI[]> {
    return this.wishlistService.getUserWishlist(requestor);
  }

  async addToWishlist(requestor: string, receiver: string): Promise<Wishlist> {
    return this.wishlistService.addToWishlist(requestor, receiver);
  }

  async removeFromWishlist(requestor: string, receiver: string): Promise<Wishlist> {
    return this.wishlistService.removeFromWishlist(requestor, receiver);
  }
}

const wishlistController = new WishlistController(WishlistService);
export default wishlistController;
