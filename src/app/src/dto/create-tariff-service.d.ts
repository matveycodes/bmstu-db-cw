import { SettingRepo } from "../interfaces/setting-repo";
import { ISubscriptionService } from "../interfaces/subscription-service";

interface CreateTariffServiceDto {
  settingRepo: SettingRepo;
  subscriptionService: ISubscriptionService;
}

export { CreateTariffServiceDto };
