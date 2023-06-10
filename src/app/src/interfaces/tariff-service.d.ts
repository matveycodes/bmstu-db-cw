import { UserId } from "../models/user";

import { Tariff } from "../vo/tariff";

interface ITariffService {
  get(userId: UserId): Promise<Tariff>;
}

export { ITariffService };
