/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlobError } from "@vercel/blob";
import { ValidationFailureI, ValidationResponseI, ValidationSuccessI } from "./types";

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

export const errorWrapperMutation = <T>(
  fn: () => Promise<T>,
  onSuccess?: () => void,
  onError?: () => void,
): Promise<ValidationResponseI<T>> => {
  return fn()
    .then((data): ValidationSuccessI<T> => {
      if (onSuccess) onSuccess();
      return { success: true, data };
    })
    .catch((error) => {
      if (onError) onError();
      return handleValidationErrorReturn(error);
    });
};
