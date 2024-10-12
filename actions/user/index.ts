"use server";

import { ResponseI, UserSearchI } from "@/utils/types";
import { AuditDetailedI, UserWithCount } from "@/utils/types/prisma";
import { User } from "@prisma/client";
import userController from "./user.controller";

const getProfile = async (address: string): Promise<User | null> => {
  return userController.getProfile(address);
};

const getCurrentUser = async (): Promise<{ address: string; user: User | null }> => {
  return userController.getCurrentUser();
};

const createUser = async (address: string, formData: FormData): Promise<ResponseI<User>> => {
  return userController.createUser(address, formData);
};

const updateUser = async (formData: FormData): Promise<ResponseI<User>> => {
  return userController.updateUser(formData);
};

const getUserAudits = async (address: string): Promise<AuditDetailedI[]> => {
  return userController.getUserAudits(address);
};

const getLeaderboard = async (key?: string, order?: "asc" | "desc"): Promise<UserWithCount[]> => {
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
