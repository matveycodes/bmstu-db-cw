/**
 * @group integration
 */
import dayjs from "dayjs";

import { UserPGRepo, SettingPGRepo } from "../../repos/pg/";
import { createPgPool } from "../../db/pg";
import { User } from "../../models/user";

import { UserService } from "../user";

const pgPool = createPgPool();

afterEach(async () => {
  await pgPool.query("TRUNCATE users, settings CASCADE");
});

const userRepo = new UserPGRepo(pgPool);
const settingRepo = new SettingPGRepo(pgPool);
const userService = new UserService({
  userRepo,
  settingRepo,
});

it("Активирует пользователя, когда он указывает дату рождения и ему >=18 лет", async () => {
  const user = new User({
    id: userRepo.nextId(),
    phone: "79991234567",
    status: "pending",
    role: "customer",
    dateJoined: new Date(),
  });
  await userRepo.save(user);
  await settingRepo.save({ name: "MIN_AGE", value: 18 });

  await userService.updateInfo(user.id, {
    birthdate: dayjs().subtract(18, "years").toDate(),
  });

  await expect(userRepo.getById(user.id)).resolves.toHaveProperty(
    "status",
    "active"
  );
});
