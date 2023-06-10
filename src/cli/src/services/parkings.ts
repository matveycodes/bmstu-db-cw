import { parkingsGetEndpoint } from "../endpoints/parkings";

const PARKINGS_SERVICE = {
  key: "parkings",
  title: "Парковки (parkings)",
  endpoints: [
    {
      title: "GET /parkings/",
      handler: parkingsGetEndpoint,
    },
  ],
};

export { PARKINGS_SERVICE };
