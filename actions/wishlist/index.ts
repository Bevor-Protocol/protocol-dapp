"use server";

import { WishlistI } from "@/utils/types/prisma";
import wishlistController from "./wishlist.controller";
import { Wishlist } from "@prisma/client";
import { ValidationResponseI } from "@/utils/types";
import { errorWrapperMutation } from "@/utils/error";
import { revalidatePath } from "next/cache";

const isWishlisted = async (requestor: string, receiver: string): Promise<boolean> => {
  return wishlistController.isWishlisted(requestor, receiver);
};

const getUserWishlist = async (requestor: string): Promise<WishlistI[]> => {
  return wishlistController.getUserWishlist(requestor);
};

const addToWishlist = async (
  requestor: string,
  receiver: string,
  receiverAdress: string,
): Promise<ValidationResponseI<Wishlist>> => {
  return errorWrapperMutation(
    () => wishlistController.addToWishlist(requestor, receiver),
    () => revalidatePath(`/user/${receiverAdress}`, "page"),
  );
};

const removeFromWishlist = async (
  requestor: string,
  receiver: string,
  receiverAdress: string,
): Promise<ValidationResponseI<Wishlist>> => {
  return errorWrapperMutation(
    () => wishlistController.removeFromWishlist(requestor, receiver),
    () => revalidatePath(`/user/${receiverAdress}`, "page"),
  );
};

export { isWishlisted, getUserWishlist, addToWishlist, removeFromWishlist };
