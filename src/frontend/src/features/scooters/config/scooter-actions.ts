import {
  beepScooter,
  turnScooterLightsOn,
  unlockScooter,
} from "../api/scooters";

const SCOOTER_ACTIONS = {
  unlock: {
    title: "Открыть замок",
    callback: unlockScooter,
  },
  beep: {
    title: "Издать звук",
    callback: beepScooter,
  },
  "turn-lights-on": {
    title: "Включить фары",
    callback: turnScooterLightsOn,
  },
};

export { SCOOTER_ACTIONS };
