import { put, del, type PutBlobResult } from "@vercel/blob";

import type { GenericUpdateI } from "@/lib/types";

export const putBlob = (
  folder: string,
  file: File | undefined,
): Promise<GenericUpdateI<PutBlobResult>> => {
  // Takes an arbitrary File type and adds it to blob storage.
  // If no file is provided, or it's empty (which controlled HTML behave as),
  // Then it returns as unsuccessful.
  if (!file || file.size <= 0 || !file.name) {
    return Promise.resolve({
      success: false,
      error: "no file exists",
    });
  }
  // Don't need an explicit catch here, as it is always chained into a thenable
  // and will be caught regardless.

  return put(`${folder}/${file.name}`, file, { access: "public" }).then((data) => {
    return {
      success: true,
      data,
    };
  });
};

export const deleteBlob = async (url: string): Promise<void> => {
  // returns a void response. A delete action is always successful if the blob url exists.
  // A delete action won't throw if the blob url doesn't exists.
  await del(url);
};
