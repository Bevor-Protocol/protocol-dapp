/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlobError } from "@vercel/blob";
import { ValidationFailureI } from "./types";

export class ValidationError extends Error {
  name = "ValidationError";

  validationErrors: Record<string, string>;

  constructor(message: string, validationErrors: Record<string, string>) {
    super(message);
    this.validationErrors = validationErrors;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class RoleError extends Error {
  name = "RoleError";

  message = "User does not have role";
}

export class AuthError extends Error {
  name = "AuthError";

  message = "User not authenticated";
}

export const handleValidationErrorReturn = (error: any): ValidationFailureI => {
  if (error instanceof ValidationError) {
    return { success: false, error: error.message, validationErrors: error.validationErrors };
  }
  if (error instanceof BlobError) {
    return {
      success: false,
      error: error.message,
      validationErrors: { image: "error uploading, try later" },
    };
  }
  return { success: false, error: error.message };
};
