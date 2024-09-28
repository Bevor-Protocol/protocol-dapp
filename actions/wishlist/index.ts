"use server";

import { ResponseI } from "@/utils/types";
import { WishlistI } from "@/utils/types/prisma";
import wishlistController from "./wishlist.controller";

const isWishlisted = async (requestorId: string, receiverId: string): Promise<boolean> => {
  return wishlistController.isWishlisted(requestorId, receiverId);
};

const getUserWishlist = async (requestorId: string): Promise<WishlistI[]> => {
  return wishlistController.getUserWishlist(requestorId);
};

const addToWishlist = async (receiverId: string): Promise<ResponseI<WishlistI>> => {
  return wishlistController.addToWishlist(receiverId);
};

const removeFromWishlist = async (receiverId: string): Promise<ResponseI<WishlistI>> => {
  return wishlistController.removeFromWishlist(receiverId);
};

export { addToWishlist, getUserWishlist, isWishlisted, removeFromWishlist };
