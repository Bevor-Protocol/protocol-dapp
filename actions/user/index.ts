"use server";

import { ValidationResponseI } from "@/utils/types";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import { Users } from "@prisma/client";
import userController from "./user.controller";

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
  return userController.createUser(address, formData);
};

const updateUser = async (formData: FormData): Promise<ValidationResponseI<Users>> => {
  return userController.updateUser(formData);
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
  createUser,
  currentUser,
  getLeaderboard,
  getProfile,
  getUserAudits,
  searchAuditors,
  updateUser,
};
