"use server";

import { ResponseI, UserSearchI } from "@/utils/types";
import { Leaderboard, UserAudit } from "@/utils/types/custom";
import { User } from "@/utils/types/tables";
import userController from "./user.controller";

const getProfile = async (address: string): Promise<User | undefined> => {
  return userController.getProfile(address);
};

const getCurrentUser = async (): Promise<{ address: string; user: User | undefined }> => {
  return userController.getCurrentUser();
};

const createUser = async (address: string, formData: FormData): Promise<ResponseI<User>> => {
  return userController.createUser(address, formData);
};

const updateUser = async (formData: FormData): Promise<ResponseI<User>> => {
  return userController.updateUser(formData);
};

const getUserAudits = async (address: string): Promise<UserAudit[]> => {
  return userController.getUserAudits(address);
};

const getLeaderboard = async (key?: string, order?: "asc" | "desc"): Promise<Leaderboard[]> => {
  return userController.getLeaderboard(key, order);
};

const searchUsers = async (filter: UserSearchI): Promise<User[]> => {
  return userController.searchUsers(filter);
};

const searchAuditors = async (query?: string): Promise<User[]> => {
  return userController.searchAuditors(query);
};

export {
  createUser,
  getCurrentUser,
  getLeaderboard,
  getProfile,
  getUserAudits,
  searchAuditors,
  searchUsers,
  updateUser,
};
