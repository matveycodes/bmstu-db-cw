import { ISettingService } from "../interfaces/setting-service";
import { SettingRepo } from "../interfaces/setting-repo";

import { CreateSettingServiceDto } from "../dto/create-setting-service";

class SettingService implements ISettingService {
  private _settingRepo: SettingRepo;

  public constructor(createSettingServiceDto: CreateSettingServiceDto) {
    this._settingRepo = createSettingServiceDto.settingRepo;
  }

  public async get() {
    return this._settingRepo.get();
  }
}

export { SettingService };
