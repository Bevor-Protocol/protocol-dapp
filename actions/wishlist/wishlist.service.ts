import { WishlistI } from "@/utils/types/prisma";
import { Wishlist } from "@prisma/client";
import { prisma } from "@/db/prisma.server";

export const getWishlistEntry = (requestor: string, receiver: string): Promise<Wishlist | null> => {
  return prisma.wishlist.findUnique({
    where: {
      uniqueWishlistEntry: {
        requestorId: requestor,
        receiverId: receiver,
      },
    },
  });
};

export const getUserWishlist = (requestor: string): Promise<WishlistI[]> => {
  return prisma.wishlist.findMany({
    where: {
      requestorId: requestor,
    },
    select: {
      receiver: true,
    },
  });
};

export const addToWishlist = (requestor: string, receiver: string): Promise<Wishlist> => {
  return prisma.wishlist.create({
    data: {
      receiverId: receiver,
      requestorId: requestor,
    },
  });
};

export const removeFromWishlist = (requestor: string, receiver: string): Promise<Wishlist> => {
  return prisma.wishlist.delete({
    where: {
      uniqueWishlistEntry: {
        requestorId: requestor,
        receiverId: receiver,
      },
    },
  });
};
