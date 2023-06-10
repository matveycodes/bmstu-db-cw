import { UserRepo } from "../interfaces/user-repo";
import { SettingRepo } from "../interfaces/setting-repo";
import { Logger } from "../interfaces/logger";

interface CreateUserServiceDto {
  userRepo: UserRepo;
  settingRepo: SettingRepo;
  logger?: Logger;
}

export { CreateUserServiceDto };
