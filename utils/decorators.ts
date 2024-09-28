/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { handleValidationErrorReturn } from "./error";
import { ValidationResponseI } from "./types";

export function handleErrors<T>(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<ValidationResponseI<T>>>,
) {
  const method = descriptor.value;
  descriptor.value = async function (...args): Promise<ValidationResponseI<T>> {
    try {
      if (!method) throw new Error("Method not defined");
      return await method?.apply(this, args);
    } catch (error) {
      return handleValidationErrorReturn(error);
    }
  };
}
