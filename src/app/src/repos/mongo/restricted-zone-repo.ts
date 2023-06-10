import { ObjectId, WithId } from "mongodb";

import { RestrictedZone, RestrictedZoneId } from "../../models/restricted-zone";

import { RestrictedZoneRepo } from "../../interfaces/restricted-zone-repo";

import { Location } from "../../types/location";

import { DataAccessError } from "../../errors/data-access-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  polygon: {
    type: "Polygon";
    coordinates: [[number, number][]];
  };
  speed_limit: number;
}

const document2model = (document: WithId<Document>) => {
  return new RestrictedZone({
    id: document._id.toString() as RestrictedZoneId,
    polygon: document.polygon.coordinates[0].map(([longitude, latitude]) => ({
      longitude,
      latitude,
    })),
    speedLimit: document.speed_limit,
  });
};

class RestrictedZoneMongoRepo implements RestrictedZoneRepo {
  private _connection: MongoConnection;

  constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public nextId() {
    return new ObjectId().toString() as RestrictedZoneId;
  }

  public async save(restrictedZone: RestrictedZone) {
    try {
      await this._connection.collection<Document>("restrictedZones").updateOne(
        { _id: new ObjectId(restrictedZone.id) },
        {
          $set: {
            polygon: {
              type: "Polygon",
              coordinates: [
                restrictedZone.polygon.map(({ latitude, longitude }) => [
                  longitude,
                  latitude,
                ]),
              ],
            },
            speed_limit: restrictedZone.speedLimit,
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError(
        "Не удалось сохранить зону ограничения скорости"
      );
    }
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("restrictedZones")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список зон ограничения скорости"
      );
    }
  }

  public async getByLocation(location: Location) {
    try {
      const documents = await this._connection
        .collection<Document>("restrictedZones")
        .find({
          polygon: {
            $geoIntersects: {
              $geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
              },
            },
          },
        })
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список зон ограничения скорости для указанной локации"
      );
    }
  }

  public async remove(id: RestrictedZoneId) {
    try {
      await this._connection
        .collection<Document>("restrictedZones")
        .deleteOne({ _id: new ObjectId(id) });
    } catch {
      throw new DataAccessError("Не удалось удалить зону ограничения скорости");
    }
  }
}

export { RestrictedZoneMongoRepo };
