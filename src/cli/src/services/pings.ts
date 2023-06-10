import { pingsCreateEndpoint } from "../endpoints/pings";

const PINGS_SERVICE = {
  key: "pings",
  title: "Пинги (pings)",
  endpoints: [
    {
      title: "POST /pings/",
      handler: pingsCreateEndpoint,
    },
  ],
};

export { PINGS_SERVICE };
