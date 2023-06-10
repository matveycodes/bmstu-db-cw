import round from "lodash/round";

const formatPrice = (price: number) => {
  return `${round(price / 100, 2)} ₽`;
};

export { formatPrice };
