"use server";

import { Prisma, Users } from "@prisma/client";
import * as BlobService from "../blob/blob.service";
import * as UserService from "./user.service";
import * as AuthService from "../auth/auth.service";
import { AuditTruncatedI, UserWithCount } from "@/utils/types/prisma";
import { revalidatePath } from "next/cache";
import { ValidationResponseI } from "@/utils/types";
import { handleValidationErrorReturn } from "@/utils/error";

export const currentUser = async (): Promise<{ address: string; user: Users | null }> => {
  const session = await AuthService.getSession();
  if (!session?.siwe) {
    return {
      address: "",
      user: null,
    };
  }
  const { address } = session.siwe;

  return UserService.getProfile(address)
    .then((user) => {
      return { address, user };
    })
    .catch(() => {
      return { address, user: null };
    });
};

export const getProfile = (address: string): Promise<Users | null> => {
  return UserService.getProfile(address);
};

export const createUser = async (
  address: string,
  formData: FormData,
): Promise<ValidationResponseI<Users>> => {
  try {
    const parsed = UserService.parseCreateUserForm(formData);

    const { image, ...rest } = parsed;
    const dataPass: Prisma.UsersCreateInput = {
      address,
      ...rest,
    };

    const blobData = await BlobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    return await UserService.createUser(dataPass).then((data) => {
      return { success: true, data };
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleValidationErrorReturn(error);
  }
};

export const updateUser = async (
  id: string,
  formData: FormData,
): Promise<ValidationResponseI<Users>> => {
  try {
    const parsed = UserService.parseUpdateUserForm(formData);

    const { image, ...rest } = parsed;
    const dataPass: Prisma.UsersUpdateInput = {
      ...rest,
    };

    const blobData = await BlobService.addBlob("profile-images", image);
    if (blobData) {
      dataPass.image = blobData.url;
    }

    return UserService.updateUser(id, dataPass).then((data) => {
      revalidatePath(`/user/${id}`);
      return { success: true, data };
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return handleValidationErrorReturn(error);
  }
};

export const getUserAudits = (address: string): Promise<AuditTruncatedI[]> => {
  return UserService.userAudits(address);
};

export const getLeaderboard = async (key?: string, order?: string): Promise<UserWithCount[]> => {
  return UserService.getLeaderboard(key, order);
};

export const searchAuditors = (query?: string): Promise<Users[]> => {
  return UserService.searchAuditors(query);
};
