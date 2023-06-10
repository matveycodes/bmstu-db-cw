import { MongoClient } from "mongodb";
import mongoUriBuilder from "mongo-uri-builder";

import { Logger } from "../interfaces/logger";

const connectionString = mongoUriBuilder({
  username: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT ? +process.env.MONGO_PORT : undefined,
});

/**
 * Создаёт соединение с базой MongoDB.
 *
 * @param logger - Логгер
 */
const createMongoConnection = async (logger?: Logger) => {
  const client = new MongoClient(connectionString, { monitorCommands: true });

  client.on("commandStarted", (event) =>
    logger?.log(JSON.stringify(event), "mongo", "debug")
  );
  client.on("commandSucceeded", (event) =>
    logger?.log(JSON.stringify(event), "mongo", "verbose")
  );
  client.on("commandFailed", (event) =>
    logger?.log(JSON.stringify(event), "mongo", "error")
  );

  await client.connect();

  return client.db(process.env.MONGO_DB);
};

export { Db as MongoConnection } from "mongodb";
export { createMongoConnection };
