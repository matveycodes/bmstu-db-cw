import { formatPrice } from "utils/price";

import { Tariff } from "../types/tariff";

const formatTariff = (tariff: Tariff) => {
  const startPrice = formatPrice(tariff.start_price);
  const perMinutePrice = formatPrice(tariff.per_minute_price);

  return `${startPrice} + ${perMinutePrice}/мин`;
};

export { formatTariff };
