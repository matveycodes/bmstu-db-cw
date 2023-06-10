import { terminal } from "terminal-kit";

import { client } from "../api/client";

const pingsCreateEndpoint = async () => {
  terminal("Введите ID самоката: ");
  const scooterId = await terminal.inputField().promise;

  terminal("\nВведите широту: ");
  const latitude = await terminal.inputField().promise;

  if (!latitude || !Number.isFinite(+latitude)) {
    return terminal.red("\nШирота не является числом");
  }

  terminal("\nВведите долготу: ");
  const longitude = await terminal.inputField().promise;

  if (!longitude || !Number.isFinite(+longitude)) {
    return terminal.red("\nДолгота не является числом");
  }

  terminal("\nВведите уровень заряда: ");
  const batteryLevel = await terminal.inputField().promise;

  if (!batteryLevel || !Number.isFinite(+batteryLevel)) {
    return terminal.red("\nУровень заряда не является числом");
  }

  terminal("\nВведите состояние замка: ");
  const lockState = await terminal.inputField().promise;

  terminal("\nВведите состояние фар: ");
  const lightsState = await terminal.inputField().promise;

  const payload = {
    scooter_id: scooterId,
    location: {
      longitude: +longitude,
      latitude: +latitude,
    },
    battery_level: +batteryLevel,
    lock_state: lockState,
    lights_state: lightsState,
  };

  try {
    const { data } = await client.post("/pings/", payload);
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

export { pingsCreateEndpoint };
