/**
 * @group integration
 */

import { User } from "../../../models/user";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { UserRepo } from "../../../interfaces/user-repo";

import { UserMongoRepo } from "../user-repo";

let mongoConnection: MongoConnection;

let userRepo: UserRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  userRepo = new UserMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("users").deleteMany();
});

it("Сохраняет пользователя", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991234567",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });

  await userRepo.save(user);
});

it("Возвращает пользователя по идентификатору", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991234567",
    role: "customer",
    dateJoined: new Date(),
    status: "pending",
  });
  await userRepo.save(user);

  await expect(userRepo.getById(user.id)).resolves.toHaveProperty(
    "phone",
    "79991234567"
  );
});
