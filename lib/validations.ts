import { isAddress } from "viem";
import { z } from "zod";

const customFormToggleValidation = (value: string, ctx: z.RefinementCtx): boolean => {
  // transforms the form input strings (coming from value prop) into booleans.
  switch (value) {
    case "yes":
      return true;
    case "no":
      return false;
    default:
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "invalid form value used",
      });
      return z.NEVER;
  }
};

export const userSchema = z.object({
  image: z
    .custom<File>((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return "This isn't a file";
      if (!file.name || file.size <= 0) return true;
      if (file.size > 4.5 * 1024 * 1024) return "Max file size is 4.5MB";
      if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
        return ".jpg, .jpeg, .png and .webp files are accepted.";
      }
      return true;
    })
    .optional(),
  name: z.string().max(100).trim().optional(),
  available: z.string().transform(customFormToggleValidation).optional(),
  auditorRole: z
    .string()
    .transform((value) => value == "yes")
    .optional(),
  auditeeRole: z
    .string()
    .transform((value) => value == "yes")
    .optional(),
});

export const userSchemaCreate = userSchema
  .required({ available: true, auditeeRole: true, auditorRole: true })
  .refine(
    (schema) => {
      if (!schema.auditeeRole && !schema.auditorRole) {
        return false;
      }
      return true;
    },
    { message: "must claim at least 1 role", path: ["auditorRole"] },
  );

export const auditFormSchema = z
  .object({
    title: z.string().min(1, { message: "A Title is required" }).max(100).trim(),
    description: z.string().min(1, { message: "A Description is required" }).trim(),
    details: z
      .custom<File>((file) => {
        if (!file) return true;
        if (!(file instanceof File)) return "This isn't a file";
        if (!file.name || file.size <= 0) return true;
        if (file.size > 4.5 * 1024 * 1024) return "Max file size is 4.5MB";
        return true;
      })
      .optional(),
    price: z
      .string()
      .min(1)
      .catch("1000")
      .pipe(z.coerce.number({ invalid_type_error: "Price must be a number" }).nonnegative()),
    duration: z
      .string()
      .min(1)
      .catch("30")
      .pipe(z.coerce.number({ invalid_type_error: "Duration must be a number" }).nonnegative()),
    cliff: z
      .string()
      .min(1)
      .catch("3")
      .pipe(z.coerce.number({ invalid_type_error: "Cliff must be a number" }).nonnegative()),
    token: z.string().refine(isAddress, "A token must be selected"),
  })
  .refine((data) => data.cliff < data.duration, {
    message: "Cliff must be less than duration",
    path: ["cliff"],
  });
