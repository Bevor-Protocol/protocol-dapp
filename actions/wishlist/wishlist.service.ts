import { WishlistI } from "@/utils/types/prisma";
import { Wishlist } from "@prisma/client";
import { prisma } from "@/db/prisma.server";

class WishlistService {
  getWishlistEntry(requestor: string, receiver: string): Promise<Wishlist | null> {
    return prisma.wishlist.findUnique({
      where: {
        uniqueWishlistEntry: {
          requestorId: requestor,
          receiverId: receiver,
        },
      },
    });
  }

  getUserWishlist(requestor: string): Promise<WishlistI[]> {
    return prisma.wishlist.findMany({
      where: {
        requestorId: requestor,
      },
      select: {
        receiver: true,
      },
    });
  }

  addToWishlist(requestor: string, receiver: string): Promise<Wishlist> {
    return prisma.wishlist.create({
      data: {
        receiverId: receiver,
        requestorId: requestor,
      },
    });
  }

  removeFromWishlist(requestor: string, receiver: string): Promise<Wishlist> {
    return prisma.wishlist.delete({
      where: {
        uniqueWishlistEntry: {
          requestorId: requestor,
          receiverId: receiver,
        },
      },
    });
  }
}

const wishlistService = new WishlistService();
export default wishlistService;
