import { ObjectId, WithId } from "mongodb";

import { Parking, ParkingId } from "../../models/parking";

import { ParkingRepo } from "../../interfaces/parking-repo";

import { Location } from "../../types/location";
import { Bounds } from "../../types/bounds";

import { DataAccessError } from "../../errors/data-access-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

const document2model = (document: WithId<Document>) => {
  return new Parking({
    id: document._id.toString() as ParkingId,
    location: {
      longitude: document.location.coordinates[0],
      latitude: document.location.coordinates[1],
    },
  });
};

class ParkingMongoRepo implements ParkingRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("parkings")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch (err) {
      throw new DataAccessError("Не удалось получить список парковок");
    }
  }

  public async getNear(location: Location) {
    try {
      const documents = await this._connection
        .collection<Document>("parkings")
        .find({
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [location.longitude, location.latitude],
              },
              $maxDistance: 10,
            },
          },
        })
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError(
        "Не удалось получить список ближайших парковок"
      );
    }
  }

  public nextId() {
    return new ObjectId().toString() as ParkingId;
  }

  public async remove(id: ParkingId) {
    try {
      await this._connection
        .collection<Document>("parkings")
        .deleteOne({ _id: new ObjectId(id) });
    } catch {
      throw new DataAccessError("Не удалось удалить парковку");
    }
  }

  public async getWithin(bounds: Bounds) {
    try {
      const documents = await this._connection
        .collection<Document>("parkings")
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
      throw new DataAccessError("Не удалось получить список парковок");
    }
  }

  public async save(parking: Parking) {
    try {
      await this._connection.collection<Document>("parkings").updateOne(
        { _id: new ObjectId(parking.id) },
        {
          $set: {
            location: {
              type: "Point",
              coordinates: [
                parking.location.longitude,
                parking.location.latitude,
              ],
            },
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError("Не удалось сохранить парковку");
    }
  }
}

export { ParkingMongoRepo };
