import { ObjectId, WithId } from "mongodb";

import { ScooterId } from "../../models/scooter";

import { PingRepo } from "../../interfaces/ping-repo";

import { LightsState, LockState, Ping } from "../../vo/ping";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { Bounds } from "../../types/bounds";

import { MongoConnection } from "../../db/mongo";

interface Document {
  scooter_id: ObjectId;
  date: Date;
  meta_info: object | null;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  battery_level: number;
  lock_state: string;
  lights_state: string;
}

const document2model = (document: WithId<Document>) => {
  return {
    scooterId: document.scooter_id.toString() as ScooterId,
    date: document.date,
    metaInfo: document.meta_info,
    location: {
      longitude: document.location.coordinates[0],
      latitude: document.location.coordinates[1],
    },
    batteryLevel: document.battery_level,
    lockState: document.lock_state as LockState,
    lightsState: document.lights_state as LightsState,
  } as Ping;
};

class PingMongoRepo implements PingRepo {
  private _connection: MongoConnection;

  constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async save(ping: Ping) {
    try {
      await this._connection.collection<Document>("pings").insertOne({
        scooter_id: new ObjectId(ping.scooterId),
        date: ping.date,
        meta_info: ping.metaInfo || null,
        location: {
          type: "Point",
          coordinates: [ping.location.longitude, ping.location.latitude],
        },
        battery_level: ping.batteryLevel,
        lock_state: ping.lockState,
        lights_state: ping.lightsState,
      });
    } catch {
      throw new DataAccessError("Не удалось сохранить пинг");
    }
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("pings")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список пингов");
    }
  }

  public async getWithin(bounds: Bounds) {
    try {
      const documents = await this._connection
        .collection<Document>("pings")
        .find({
          location: {
            $geoWithin: {
              $box: [
                [bounds.min_longitude, bounds.min_latitude],
                [bounds.max_longitude, bounds.max_latitude],
              ],
            },
          },
        })
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список пингов");
    }
  }

  public async getLatestByScooter(scooterId: ScooterId) {
    try {
      const document = await this._connection
        .collection<Document>("pings")
        .findOne(
          { scooter_id: new ObjectId(scooterId) },
          { sort: { date: "desc" } }
        );
      if (!document) {
        throw new NotFoundError("Пинг не найден");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить последний пинг по идентификатору самоката"
      );
    }
  }
}

export { PingMongoRepo };
