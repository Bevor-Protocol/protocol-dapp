import { isFileEmpty } from "@/utils/helpers";
import { put, del, type PutBlobResult } from "@vercel/blob";

export const addBlob = (folder: string, file: File | undefined): Promise<PutBlobResult | null> => {
  const fileEmpty = isFileEmpty(file);
  if (fileEmpty) {
    return Promise.resolve(null);
  }
  const path = `${folder}/${file!.name}`;
  return put(path, file!, { access: "public" });
};

export const deleteBlob = async (url: string): Promise<void> => {
  await del(url);
};
