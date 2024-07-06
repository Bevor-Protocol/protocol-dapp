"use server";

import { Users } from "@prisma/client";
import userController from "./user.controller";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import { ValidationResponseI, ValidationSuccessI } from "@/utils/types";
import { revalidatePath } from "next/cache";
import { handleValidationErrorReturn } from "@/utils/error";

const currentUser = async (): Promise<{ address: string; user: Users | null }> => {
  return userController.currentUser();
};

const getProfile = async (address: string): Promise<Users | null> => {
  return userController.getProfile(address);
};

const createUser = async (
  address: string,
  formData: FormData,
): Promise<ValidationResponseI<Users>> => {
  return userController
    .createUser(address, formData)
    .then((data): ValidationSuccessI<Users> => {
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
};

const updateUser = async (id: string, formData: FormData): Promise<ValidationResponseI<Users>> => {
  return userController
    .updateUser(id, formData)
    .then((data): ValidationSuccessI<Users> => {
      revalidatePath(`/user/${id}`);
      return { success: true, data };
    })
    .catch((error) => {
      return handleValidationErrorReturn(error);
    });
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
