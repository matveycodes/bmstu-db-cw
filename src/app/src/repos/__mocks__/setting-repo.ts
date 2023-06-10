import identity from "lodash/identity";

import { SettingRepo } from "../../interfaces/setting-repo";

import { Setting } from "../../vo/setting";

import { NotFoundError } from "../../errors/not-found-error";

class SettingMockRepo implements SettingRepo {
  private _settings: Record<Setting["name"], unknown> = {};

  public async get() {
    return Object.entries(this._settings).map(([name, value]) => {
      return { name, value };
    });
  }

  public async getByName<TValue>(
    name: Setting["name"],
    transformer: (arg0: unknown) => TValue = identity
  ) {
    const value = this._settings[name];

    if (!value) {
      throw new NotFoundError("Настройка не найдена");
    }

    return transformer(value);
  }

  public async remove(name: Setting["name"]) {
    delete this._settings[name];
  }

  public async save(setting: Setting) {
    this._settings[setting.name] = setting.value;
  }
}

export { SettingMockRepo };
