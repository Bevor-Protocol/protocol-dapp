import { ErrorTypeEnum } from "./enum";

export interface ErrorTypeI {
  type: ErrorTypeEnum;
  message: string;
  validationErrors: Record<string, string>;
}

export interface ResponseSuccessI<T> {
  success: true;
  data: T;
  error?: never;
  type?: never;
  validationErrors?: never;
}
export interface ResponseFailureI {
  success: false;
  data?: never;
  error: ErrorTypeI;
}

export type ResponseI<T> = ResponseSuccessI<T> | ResponseFailureI;
