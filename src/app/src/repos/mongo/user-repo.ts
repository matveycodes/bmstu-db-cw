import { ObjectId, WithId } from "mongodb";

import { User, UserId, UserRole, UserStatus } from "../../models/user";

import { UserRepo } from "../../interfaces/user-repo";

import { NotFoundError } from "../../errors/not-found-error";
import { DataAccessError } from "../../errors/data-access-error";

import { MongoConnection } from "../../db/mongo";

interface Document {
  status: string;
  role: string;
  date_joined: Date;
  middle_name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string;
  birthdate: Date | null;
}

const document2model = (document: WithId<Document>) => {
  return new User({
    id: document._id.toString() as UserId,
    status: document.status as UserStatus,
    role: document.role as UserRole,
    dateJoined: document.date_joined,
    middleName: document.middle_name ?? undefined,
    firstName: document.first_name ?? undefined,
    lastName: document.last_name ?? undefined,
    email: document.email ?? undefined,
    phone: document.phone ?? undefined,
    birthdate: document.birthdate ?? undefined,
  });
};

class UserMongoRepo implements UserRepo {
  private _connection: MongoConnection;

  public constructor(connection: MongoConnection) {
    this._connection = connection;
  }

  public nextId() {
    return new ObjectId().toString() as UserId;
  }

  public async save(user: User) {
    try {
      await this._connection.collection<Document>("users").updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            status: user.status,
            date_joined: user.dateJoined,
            middle_name: user.middleName,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.email,
            phone: user.phone,
            birthdate: user.birthdate,
            role: user.role,
          },
        },
        { upsert: true }
      );
    } catch {
      throw new DataAccessError("Не удалось сохранить пользователя");
    }
  }

  public async get() {
    try {
      const documents = await this._connection
        .collection<Document>("users")
        .find()
        .toArray();

      return documents.map(document2model);
    } catch {
      throw new DataAccessError("Не удалось получить список пользователей");
    }
  }

  public async getById(id: UserId) {
    try {
      const document = await this._connection
        .collection<Document>("users")
        .findOne({ _id: new ObjectId(id) });
      if (!document) {
        throw new NotFoundError("Пользователь не найден");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError(
        "Не удалось получить пользователя по идентификатору"
      );
    }
  }

  public async getByPhone(phone: User["phone"]) {
    try {
      const document = await this._connection
        .collection<Document>("users")
        .findOne({ phone });
      if (!document) {
        throw new NotFoundError("Пользователь не найден");
      }

      return document2model(document);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      throw new DataAccessError("Не удалось получить пользователя по телефону");
    }
  }

  public async remove(id: UserId) {
    try {
      await this._connection
        .collection<Document>("users")
        .deleteOne({ _id: new ObjectId(id) });
    } catch {
      throw new DataAccessError("Не удалось удалить пользователя");
    }
  }
}

export { UserMongoRepo };
