/**
 * @group integration
 */

import { createPgPool } from "../../../db/pg";
import { Setting } from "../../../vo/setting";

import { SettingPGRepo } from "../setting-repo";

const pgPool = createPgPool();

const settingRepo = new SettingPGRepo(pgPool);

afterEach(async () => {
  await pgPool.query("TRUNCATE settings CASCADE");
});

it("Сохраняет настройку", async () => {
  const setting: Setting = {
    name: "TEST_SETTING",
    value: "TEST_VALUE",
  };

  await settingRepo.save(setting);
});

it("Возвращает значение настройки", async () => {
  const setting: Setting = {
    name: "TEST_SETTING",
    value: "TEST_VALUE",
  };
  await settingRepo.save(setting);

  await expect(settingRepo.getByName("TEST_SETTING")).resolves.toBe(
    "TEST_VALUE"
  );
});
