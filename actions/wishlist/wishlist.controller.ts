import WishlistService from "./wishlist.service";
import { Wishlist } from "@prisma/client";
import { WishlistI } from "@/utils/types/prisma";
import { ValidationResponseI, ValidationSuccessI } from "@/utils/types";
import { handleValidationErrorReturn } from "@/utils/error";

// Might want to add some revalidations here.

class WishlistController {
  constructor(private readonly wishlistService: typeof WishlistService) {}

  async isWishlisted(requestor: string, receiver: string): Promise<boolean> {
    const entry = await WishlistService.getWishlistEntry(requestor, receiver);
    return !!entry;
  }

  async getUserWishlist(requestor: string): Promise<WishlistI[]> {
    return WishlistService.getUserWishlist(requestor);
  }

  async addToWishlist(requestor: string, receiver: string): Promise<ValidationResponseI<Wishlist>> {
    return WishlistService.addToWishlist(requestor, receiver)
      .then((data): ValidationSuccessI<Wishlist> => {
        return { success: true, data };
      })
      .catch((error) => {
        return handleValidationErrorReturn(error);
      });
  }

  async removeFromWishlist(
    requestor: string,
    receiver: string,
  ): Promise<ValidationResponseI<Wishlist>> {
    return WishlistService.removeFromWishlist(requestor, receiver)
      .then((data): ValidationSuccessI<Wishlist> => {
        return { success: true, data };
      })
      .catch((error) => {
        return handleValidationErrorReturn(error);
      });
  }
}

const wishlistController = new WishlistController(WishlistService);
export default wishlistController;
