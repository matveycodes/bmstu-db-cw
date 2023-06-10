import { Setting } from "../vo/setting";

interface SettingRepo {
  get(): Promise<Setting[]>;
  save(setting: Setting): Promise<void>;
  getByName<TValue>(
    name: Setting["name"],
    transformer: (arg0: unknown) => TValue
  ): Promise<TValue>;
  remove(name: Setting["name"]): Promise<void>;
}

export { SettingRepo };
