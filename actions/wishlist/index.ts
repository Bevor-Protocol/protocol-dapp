"use server";

import { WishlistI } from "@/utils/types/prisma";
import wishlistController from "./wishlist.controller";
import { ValidationResponseI } from "@/utils/types";

const isWishlisted = async (requestor: string, receiver: string): Promise<boolean> => {
  return wishlistController.isWishlisted(requestor, receiver);
};

const getUserWishlist = async (requestor: string): Promise<WishlistI[]> => {
  return wishlistController.getUserWishlist(requestor);
};

const addToWishlist = async (
  requestor: string,
  receiver: string,
): Promise<ValidationResponseI<WishlistI>> => {
  return wishlistController.addToWishlist(requestor, receiver);
};

const removeFromWishlist = async (
  requestor: string,
  receiver: string,
): Promise<ValidationResponseI<WishlistI>> => {
  return wishlistController.removeFromWishlist(requestor, receiver);
};

export { isWishlisted, getUserWishlist, addToWishlist, removeFromWishlist };
