import { Setting } from "../vo/setting";

interface ISettingService {
  get(): Promise<Setting[]>;
}

export { ISettingService };
