import winston from "winston";

import { Logger } from "../interfaces/logger";

const format = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

/**
 * Создаёт логгер.
 *
 * @param filename - Имя файла для записи логов
 * @param level - Минимальный уровень логирования
 */
const createLogger = (filename: string, level = "verbose") => {
  const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS ZZ" }),
      format
    ),
    transports: [
      new winston.transports.Console({ level }),
      new winston.transports.File({ filename, level }),
    ],
  });

  return {
    log(message, source, level = "info") {
      logger.log(level, source ? `[${source}] ${message}` : message);
    },
  } as Logger;
};

export { createLogger };
