/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { User } from "../../../models/user";

import { UserPGRepo } from "../user-repo";

const pgPool = createPgPool();

const userRepo = new UserPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE users CASCADE");
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
