import { isFileEmpty } from "@/utils/helpers";
import { del, put, type PutBlobResult } from "@vercel/blob";

class BlobService {
  addBlob(folder: string, file: File | undefined): Promise<PutBlobResult | null> {
    const fileEmpty = isFileEmpty(file);
    if (fileEmpty) {
      return Promise.resolve(null);
    }
    const path = `${folder}/${file!.name}`;
    return put(path, file!, { access: "public" });
  }

  async deleteBlob(url: string): Promise<void> {
    await del(url);
  }
}

const blobService = new BlobService();
export default blobService;
