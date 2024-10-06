import { prisma } from "@/db/prisma.server";
import { WishlistI } from "@/utils/types/prisma";
import { Wishlist } from "@prisma/client";

class WishlistService {
  getWishlistEntry(requestor: string, receiver: string): Promise<Wishlist | null> {
    return prisma.wishlist.findUnique({
      where: {
        uniqueWishlistEntry: {
          senderId: requestor,
          receiverId: receiver,
        },
      },
    });
  }

  getUserWishlist(requestor: string): Promise<WishlistI[]> {
    return prisma.wishlist.findMany({
      where: {
        senderId: requestor,
      },
      include: {
        receiver: true,
      },
    });
  }

  addToWishlist(requestor: string, receiver: string): Promise<WishlistI> {
    return prisma.wishlist.create({
      data: {
        receiverId: receiver,
        senderId: requestor,
      },
      include: {
        receiver: true,
      },
    });
  }

  removeFromWishlist(requestor: string, receiver: string): Promise<WishlistI> {
    return prisma.wishlist.delete({
      where: {
        uniqueWishlistEntry: {
          senderId: requestor,
          receiverId: receiver,
        },
      },
      include: {
        receiver: true,
      },
    });
  }
}

const wishlistService = new WishlistService();
export default wishlistService;
