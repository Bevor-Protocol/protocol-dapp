/* eslint-disable @typescript-eslint/no-explicit-any */
import { BlobError } from "@vercel/blob";
import { ResponseFailureI } from "./types";
import { ErrorTypeEnum } from "./types/enum";

export class ValidationError extends Error {
  validationErrors: Record<string, string>;

  type: ErrorTypeEnum;

  constructor(validationErrors: Record<string, string>) {
    super("Failed validation");
    this.validationErrors = validationErrors;
    this.type = ErrorTypeEnum.VALIDATION;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class RoleError extends Error {
  type: ErrorTypeEnum;

  constructor() {
    super("User doesn't have the proper role to take this action.");
    this.type = ErrorTypeEnum.ROLE;
  }
}

export class AuditStateError extends Error {
  type: ErrorTypeEnum;

  constructor() {
    super("Audit isn't in correct state for this action");
    this.type = ErrorTypeEnum.AUDIT_STATE;
  }
}

export class AuthError extends Error {
  type: ErrorTypeEnum;

  constructor() {
    super("User isn't authenticated");
    this.type = ErrorTypeEnum.AUTH;
  }
}

export const handleErrorResponse = (error: any): ResponseFailureI => {
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: {
        message: error.message,
        type: ErrorTypeEnum.VALIDATION,
        validationErrors: error.validationErrors,
      },
    };
  }
  if (error instanceof BlobError) {
    return {
      success: false,
      error: {
        message: error.message,
        type: ErrorTypeEnum.BLOB,
        validationErrors: { image: "error uploading, try later" },
      },
    };
  }
  if (error instanceof AuthError) {
    return {
      success: false,
      error: {
        message: error.message,
        type: ErrorTypeEnum.AUTH,
        validationErrors: {},
      },
    };
  }
  if (error instanceof RoleError) {
    return {
      success: false,
      error: {
        message: error.message,
        type: ErrorTypeEnum.ROLE,
        validationErrors: {},
      },
    };
  }
  return {
    success: false,
    error: { type: ErrorTypeEnum.OTHER, message: error.message, validationErrors: {} },
  };
};
