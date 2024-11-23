/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleErrorResponse } from "./error";
import { ResponseI } from "./types/api";

export function handleErrors<T>(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<ResponseI<T>>>,
) {
  const method = descriptor.value;
  descriptor.value = async function (...args): Promise<ResponseI<T>> {
    try {
      if (!method) throw new Error("Method not defined");
      return await method?.apply(this, args);
    } catch (error) {
      return handleErrorResponse(error);
    }
  };
}
