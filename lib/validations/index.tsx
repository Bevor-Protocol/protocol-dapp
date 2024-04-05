import { z } from "zod";

export const userSchema = z.object({
  image: z
    .custom<File>((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return "This isn't a file";
      if (!file.name || file.size <= 0) return true;
      if (file.size > 4.5 * 1024 * 1024) return "Max file size in 4.5MB";
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        return ".jpg, .jpeg, .png and .webp files are accepted.";
      }
      return true;
    })
    .optional(),
  name: z.string().max(100).trim().optional(),
  available: z.coerce.boolean(),
  auditorRole: z.coerce.boolean(),
  auditeeRole: z.coerce.boolean(),
});
