import toNumber from "lodash/toNumber";

import { UserId } from "../models/user";

import { SettingRepo } from "../interfaces/setting-repo";
import { ITariffService } from "../interfaces/tariff-service";
import { ISubscriptionService } from "../interfaces/subscription-service";

import { CreateTariffServiceDto } from "../dto/create-tariff-service";

class TariffService implements ITariffService {
  private _settingRepo: SettingRepo;
  private _subscriptionService: ISubscriptionService;

  public constructor(createTariffServiceDto: CreateTariffServiceDto) {
    this._settingRepo = createTariffServiceDto.settingRepo;
    this._subscriptionService = createTariffServiceDto.subscriptionService;
  }

  /**
   * Возвращает действующий для пользователя тариф.
   */
  public async get(userId: UserId) {
    const hasActiveSubscription =
      await this._subscriptionService.hasUserActiveSubscription(userId);

    const startPrice = hasActiveSubscription
      ? 0
      : await this._settingRepo.getByName("START_PRICE", toNumber);

    const perMinutePrice = await this._settingRepo.getByName(
      "PER_MINUTE_PRICE",
      toNumber
    );

    return { startPrice, perMinutePrice };
  }
}

export { TariffService };
