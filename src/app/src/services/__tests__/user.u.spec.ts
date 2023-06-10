/**
 * @group unit
 */

import { UserMockRepo } from "../../repos/__mocks__/user-repo";
import { SettingMockRepo } from "../../repos/__mocks__/setting-repo";
import { User } from "../../models/user";
import { ValidationError } from "../../errors/validation-error";

import { UserService } from "../user";

const getMocks = () => {
  const userRepo = new UserMockRepo();
  const settingRepo = new SettingMockRepo();
  const userService = new UserService({ userRepo, settingRepo });

  return { userRepo, settingRepo, userService };
};

beforeAll(() => {
  jest.useFakeTimers({ now: new Date("2022-01-01") });
});

afterAll(() => {
  jest.useRealTimers();
});

describe("updateInfo", () => {
  it("Бросает исключение при сохранении несовершеннолетнего пользователя", async () => {
    const { userRepo, userService, settingRepo } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "799912345678",
      role: "customer",
      dateJoined: new Date(),
      status: "pending",
    });
    await settingRepo.save({ name: "MIN_AGE", value: 18 });
    await userRepo.save(user);

    await expect(
      userService.updateInfo(user.id, {
        birthdate: new Date("2015-05-05"),
      })
    ).rejects.toThrow(ValidationError);
  });

  it("Активирует пользователя, если он совершеннолетний", async () => {
    const { userRepo, userService, settingRepo } = getMocks();
    const user = new User({
      id: userRepo.nextId(),
      phone: "799912345678",
      role: "customer",
      dateJoined: new Date(),
      status: "pending",
    });
    await settingRepo.save({ name: "MIN_AGE", value: 18 });
    await userRepo.save(user);

    await expect(
      userService.updateInfo(user.id, {
        birthdate: new Date("2001-05-05"),
      })
    ).resolves;
    const newUser = await userRepo.getById(user.id);
    expect(newUser).toHaveProperty("status", "active");
  });
});
