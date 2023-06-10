/**
 * @group integration
 */

import { User } from "../../../models/user";
import { AuthToken } from "../../../vo/auth-token";
import { AuthTokenRepo } from "../../../interfaces/auth-token-repo";
import { UserRepo } from "../../../interfaces/user-repo";
import { NotFoundError } from "../../../errors/not-found-error";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";

import { AuthTokenMongoRepo } from "../auth-token-repo";
import { UserMongoRepo } from "../user-repo";

let mongoConnection: MongoConnection;
let authTokenRepo: AuthTokenRepo, userRepo: UserRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  authTokenRepo = new AuthTokenMongoRepo(mongoConnection);
  userRepo = new UserMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("authTokens").deleteMany();
  await mongoConnection.collection("users").deleteMany();
});

it("Получает токен по значению", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991112233",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
  await userRepo.save(user);
  await authTokenRepo.save({
    userId: user.id,
    value: "ABC",
    dateExpired: new Date("2022-01-01"),
  });

  await expect(authTokenRepo.getByValue("ABC")).resolves.toHaveProperty(
    "userId",
    user.id
  );
});

it("Получает токен по идентификатору пользователя", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991112233",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
  await userRepo.save(user);
  await authTokenRepo.save({
    userId: user.id,
    value: "DEF",
    dateExpired: new Date("2022-01-01"),
  });

  const tokens = await authTokenRepo.getByUser(user.id);
  expect(tokens).toHaveLength(1);
  expect(tokens[0]).toHaveProperty("value", "DEF");
});

it("Сохраняет токен", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991112233",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
  const token: AuthToken = {
    userId: user.id,
    value: "GHI",
    dateExpired: new Date("2022-01-01"),
  };
  await userRepo.save(user);

  await authTokenRepo.save(token);
});

it("Удаляет токен", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991112233",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
  await userRepo.save(user);
  await authTokenRepo.save({
    userId: user.id,
    value: "XYZ",
    dateExpired: new Date("2022-01-01"),
  });

  await authTokenRepo.remove("XYZ");

  await expect(authTokenRepo.getByValue("XYZ")).rejects.toThrow(NotFoundError);
});
