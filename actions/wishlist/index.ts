"use server";

import * as WishlistService from "./wishlist.service";
import { Wishlist } from "@prisma/client";
import { WishlistI } from "@/utils/types/prisma";
import { ValidationResponseI, ValidationSuccessI } from "@/utils/types";
import { handleValidationErrorReturn } from "@/utils/error";

// Might want to add some revalidations here.

export const isWishlisted = async (requestor: string, receiver: string): Promise<boolean> => {
  const entry = await WishlistService.getWishlistEntry(requestor, receiver);
  return !!entry;
};

export const getUserWishlist = (requestor: string): Promise<WishlistI[]> => {
  return WishlistService.getUserWishlist(requestor);
};

export const addToWishlist = (
  requestor: string,
  receiver: string,
): Promise<ValidationResponseI<Wishlist>> => {
  return WishlistService.addToWishlist(requestor, receiver)
    .then((data): ValidationSuccessI<Wishlist> => {
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

export const removeFromWishlist = (
  requestor: string,
  receiver: string,
): Promise<ValidationResponseI<Wishlist>> => {
  return WishlistService.removeFromWishlist(requestor, receiver)
    .then((data): ValidationSuccessI<Wishlist> => {
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};
