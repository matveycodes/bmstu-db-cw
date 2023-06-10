import { isAxiosError } from "axios";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import { ResponseError } from "../types/error";

const handleErrors = <TFormData extends FieldValues>(
  error: unknown,
  callback?: (message: string) => void,
  form?: UseFormReturn<TFormData>
) => {
  if (!isAxiosError(error) || !error.response?.data) {
    return callback?.("Произошла неизвестная ошибка");
  }

  const errors = (error.response.data as ResponseError).errors;

  if (!form || !errors.some((e) => e.path)) {
    return callback?.(errors.map((e) => e.message).join(", "));
  }

  for (const error of errors) {
    const path = error.path?.length === 1 ? error.path[0] : error.path;

    if (path) {
      form.setError(path as unknown as FieldPath<TFormData>, {
        message: error.message,
      });
    }
  }
};

export { handleErrors };
