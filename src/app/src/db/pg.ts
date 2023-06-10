import pgp from "pg-promise";

import { Logger } from "../interfaces/logger";

const CONFIG = {
  host: process.env.POSTGRES_HOST,
  port: +(process.env.POSTGRES_PORT ?? 5432),
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  allowExitOnIdle: process.env.NODE_ENV === "test",
};

/**
 * Создаёт пул соединений к базе данных PostgreSQL.
 *
 * @param logger - Логгер
 */
const createPgPool = (logger?: Logger) =>
  pgp({
    query(e) {
      logger?.log(e.query, "pg", "verbose");
    },
    receive(e) {
      logger?.log(JSON.stringify(e.data), "pg", "debug");
    },
    error(e) {
      logger?.log(JSON.stringify(e), "pg", "error");
    },
  })(CONFIG);

type PgPool = ReturnType<typeof createPgPool>;

export { createPgPool };
export type { PgPool };
