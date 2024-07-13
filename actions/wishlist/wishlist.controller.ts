import WishlistService from "./wishlist.service";
import { WishlistI } from "@/utils/types/prisma";
import { handleValidationErrorReturn } from "@/utils/error";
import { ValidationResponseI, ValidationSuccessI } from "@/utils/types";
import { revalidatePath } from "next/cache";

// Might want to add some revalidations here.

class WishlistController {
  constructor(private readonly wishlistService: typeof WishlistService) {}

  async isWishlisted(requestor: string, receiver: string): Promise<boolean> {
    const entry = await this.wishlistService.getWishlistEntry(requestor, receiver);
    return !!entry;
  }

  getUserWishlist(requestor: string): Promise<WishlistI[]> {
    return this.wishlistService.getUserWishlist(requestor);
  }

  addToWishlist(requestor: string, receiver: string): Promise<ValidationResponseI<WishlistI>> {
    return this.wishlistService
      .addToWishlist(requestor, receiver)
      .then((data): ValidationSuccessI<WishlistI> => {
        revalidatePath(`/user/${data.receiver.address}`, "page");
        return { success: true, data };
      })
      .catch((error) => {
        return handleValidationErrorReturn(error);
      });
  }

  async removeFromWishlist(
    requestor: string,
    receiver: string,
  ): Promise<ValidationResponseI<WishlistI>> {
    return this.wishlistService
      .removeFromWishlist(requestor, receiver)
      .then((data): ValidationSuccessI<WishlistI> => {
        revalidatePath(`/user/${data.receiver.address}`, "page");
        return { success: true, data };
      })
      .catch((error) => {
        return handleValidationErrorReturn(error);
      });
  }
}

const wishlistController = new WishlistController(WishlistService);
export default wishlistController;
