/**
 * @group integration
 */

import toString from "lodash/toString";

import { Setting } from "../../../vo/setting";
import { createMongoConnection, MongoConnection } from "../../../db/mongo";
import { SettingRepo } from "../../../interfaces/setting-repo";

import { SettingMongoRepo } from "../setting-repo";

let mongoConnection: MongoConnection;

let settingRepo: SettingRepo;

beforeAll(async () => {
  mongoConnection = await createMongoConnection();

  settingRepo = new SettingMongoRepo(mongoConnection);
});

afterEach(async () => {
  await mongoConnection.collection("settings").deleteMany();
});

it("Сохраняет настройку", async () => {
  const setting: Setting = {
    name: "TEST_SETTING",
    value: "TEST_VALUE",
  };

  await settingRepo.save(setting);
});

it.only("Возвращает значение настройки", async () => {
  const setting: Setting = {
    name: "TEST_SETTING",
    value: "TEST_VALUE",
  };
  await settingRepo.save(setting);

  await expect(settingRepo.getByName("TEST_SETTING", toString)).resolves.toBe(
    "TEST_VALUE"
  );
});
