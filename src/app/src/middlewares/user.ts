import { Context, Next } from "koa";

import { User } from "../models/user";

import { IAuthService } from "../interfaces/auth-service";
import { Logger } from "../interfaces/logger";

declare module "koa" {
  interface Request {
    user: User | undefined;
  }
}

const log = (logger?: Logger) => (message: string) => {
  logger?.log(message, "koa:user", "verbose");
};

/**
 * Парсит Bearer-токен авторизации и
 * запрашивает соответствующего пользователя.
 *
 * @param authService - Сервис авторизации
 * @param logger - Логгер
 */
const userHandler =
  (authService: IAuthService, logger?: Logger) =>
  async (ctx: Context, next: Next) => {
    const { token } = ctx.request;

    if (token) {
      log(logger)("В заголовке запроса указан токен, обработка...");

      try {
        const user = await authService.getUserByToken(token);
        log(logger)(`Токен принадлежит пользователю ${user.id}`);
        ctx.request.user = user;
      } catch {
        log(logger)("Пользователь с указанным токеном не найден");
      }
    }

    await next();
  };

export { userHandler };
