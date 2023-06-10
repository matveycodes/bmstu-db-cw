import {
  rentalsCreateEndpoint,
  rentalsFinishEndpoint,
  rentalsGetActiveEndpoint,
  rentalsGetRentableScootersEndpoint,
} from "../endpoints/rentals";

const RENTALS_SERVICE = {
  key: "rentals",
  title: "Аренды (rentals)",
  endpoints: [
    {
      title: "GET /rentals/scooters/",
      handler: rentalsGetRentableScootersEndpoint,
    },
    {
      title: "GET /rentals/active/",
      handler: rentalsGetActiveEndpoint,
    },
    {
      title: "POST /rentals/",
      handler: rentalsCreateEndpoint,
    },
    {
      title: "POST /rentals/:id/finish/",
      handler: rentalsFinishEndpoint,
    },
  ],
};

export { RENTALS_SERVICE };
