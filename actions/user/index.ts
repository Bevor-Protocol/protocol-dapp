"use server";

import { Users } from "@prisma/client";
import userController from "./user.controller";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import { ValidationResponseI } from "@/utils/types";
import { revalidatePath, unstable_cache } from "next/cache";
import { errorWrapperMutation } from "@/utils/error";

const currentUser = async (): Promise<{ address: string; user: Users | null }> => {
  return userController.currentUser();
};

const getProfile = async (address: string): Promise<Users | null> => {
  const action = userController.getProfile(address);
  return unstable_cache(async () => action, ["profile"], { tags: [`profile ${address}`] })();
};

const createUser = async (
  address: string,
  formData: FormData,
): Promise<ValidationResponseI<Users>> => {
  return errorWrapperMutation(() => userController.createUser(address, formData));
};

const updateUser = async (id: string, formData: FormData): Promise<ValidationResponseI<Users>> => {
  return errorWrapperMutation(
    () => userController.updateUser(id, formData),
    // () => revalidateTag("profile 0x9C3f8EF6079C493aD85D59D53E10995B934eEf1d"),
    () => revalidatePath("/user", "layout"),
  );
};

const getUserAudits = async (address: string): Promise<AuditTruncatedI[]> => {
  return userController.getUserAudits(address);
};

const getLeaderboard = async (key?: string, order?: string): Promise<UserWithCount[]> => {
  return userController.getLeaderboard(key, order);
};

const searchAuditors = async (query?: string): Promise<Users[]> => {
  return userController.searchAuditors(query);
};

export {
  currentUser,
  getProfile,
  createUser,
  updateUser,
  getUserAudits,
  getLeaderboard,
  searchAuditors,
};
