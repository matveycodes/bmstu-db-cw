import { Context, Next } from "koa";
import koaLogger from "koa-logger";

import { Logger } from "../interfaces/logger";

/**
 * Логирует запросы koa до
 * их обработки.
 *
 * @param logger - Логгер
 */
const onReceiveLogger =
  (logger: Logger) => async (ctx: Context, next: Next) => {
    const { method, url, body } = ctx.request;

    if (["POST", "PATCH", "PUT"].includes(method)) {
      logger.log(`=> ${method} ${url} ${JSON.stringify(body)}`, "koa", "info");
    } else {
      logger.log(`=> ${method} ${url}`, "koa", "info");
    }

    await next();
  };

/**
 * Логирует запросы koa до
 * после обработки.
 *
 * @param logger - Логгер
 */
const onResponseLogger = (logger: Logger) =>
  koaLogger((_, [, method, url, status, time]) => {
    if (status) {
      logger.log(`<= ${method} ${url} ${time} ${status}`, "koa", "info");
    }
  });

export { onReceiveLogger, onResponseLogger };
