"use server";

import { ResponseI } from "@/utils/types/api";
import { WishlistWithReceiver } from "@/utils/types/relations";
import wishlistController from "./wishlist.controller";

const isWishlisted = async (requestorId: string, receiverId: string): Promise<boolean> => {
  return wishlistController.isWishlisted(requestorId, receiverId);
};

const getUserWishlist = async (requestorId: string): Promise<WishlistWithReceiver[]> => {
  return wishlistController.getUserWishlist(requestorId);
};

const addToWishlist = async (receiverId: string): Promise<ResponseI<boolean>> => {
  return wishlistController.addToWishlist(receiverId);
};

const removeFromWishlist = async (receiverId: string): Promise<ResponseI<boolean>> => {
  return wishlistController.removeFromWishlist(receiverId);
};

export { addToWishlist, getUserWishlist, isWishlisted, removeFromWishlist };
