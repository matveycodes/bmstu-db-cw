/**
 * @group integration
 */

import { User } from "../../../models/user";
import { createPgPool } from "../../../db/pg";
import { NotFoundError } from "../../../errors/not-found-error";
import { AuthToken } from "../../../vo/auth-token";

import { AuthTokenPGRepo } from "../auth-token-repo";
import { UserPGRepo } from "../user-repo";

const pgPool = createPgPool();

const authTokenRepo = new AuthTokenPGRepo(pgPool);
const userRepo = new UserPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE auth_tokens, users CASCADE");
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
