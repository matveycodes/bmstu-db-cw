import { Context, Next } from "koa";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

import { Logger } from "../interfaces/logger";

import { ValidationError } from "../errors/validation-error";
import { NotFoundError } from "../errors/not-found-error";
import { PermissionError } from "../errors/permission-error";
import { InvalidStateError } from "../errors/invalid-state-error";
import { LimitError } from "../errors/limit-error";

/**
 * Обрабатывает ошибки koa.
 *
 * @param logger - Логгер
 */
const errorHandler = (logger?: Logger) => async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ZodError) {
      ctx.status = StatusCodes.BAD_REQUEST;

      const pathErrors = error.errors.map((error) => ({
        path: error.path.length === 1 ? error.path[0] : error.path,
        message: error.message,
      }));

      ctx.body = {
        type: "SchemaValidationError",
        errors: pathErrors,
      };
    } else if (error instanceof ValidationError) {
      ctx.status = StatusCodes.BAD_REQUEST;
      ctx.body = {
        type: "ValidationError",
        errors: [{ path: null, message: error.message }],
      };
    } else if (error instanceof NotFoundError) {
      ctx.status = StatusCodes.NOT_FOUND;
      ctx.body = {
        type: "NotFoundError",
        errors: [{ path: null, message: error.message }],
      };
    } else if (error instanceof PermissionError) {
      ctx.status = StatusCodes.FORBIDDEN;
      ctx.body = {
        type: "PermissionError",
        errors: [{ path: null, message: error.message }],
      };
    } else if (error instanceof InvalidStateError) {
      ctx.status = StatusCodes.CONFLICT;
      ctx.body = {
        type: "InvalidStateError",
        errors: [{ path: null, message: error.message }],
      };
    } else if (error instanceof LimitError) {
      ctx.status = StatusCodes.BAD_REQUEST;
      ctx.body = {
        type: "LimitError",
        errors: [{ path: null, message: error.message }],
      };
    } else {
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = {
        type: "UnknownError",
        errors: [{ path: null, message: "Произошла неизвестная ошибка" }],
      };
    }

    if (error instanceof Error) {
      const serialized = JSON.stringify(
        error,
        Object.getOwnPropertyNames(error)
      );
      logger?.log(serialized, "app", "error");
    }
  }
};

export { errorHandler };
