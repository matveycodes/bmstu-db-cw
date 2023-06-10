import {
  scootersBeepEndpoint,
  scootersGetEndpoint,
  scootersTurnLightsOnEndpoint,
  scootersUnlockEndpoint,
} from "../endpoints/scooters";

const SCOOTERS_SERVICE = {
  key: "scooters",
  title: "Самокаты (scooters)",
  endpoints: [
    {
      title: "GET /:id/",
      handler: scootersGetEndpoint,
    },
    {
      title: "POST /:id/turn-lights-on/",
      handler: scootersTurnLightsOnEndpoint,
    },
    {
      title: "POST /:id/beep/",
      handler: scootersBeepEndpoint,
    },
    {
      title: "POST /:id/unlock/",
      handler: scootersUnlockEndpoint,
    },
  ],
};

export { SCOOTERS_SERVICE };
