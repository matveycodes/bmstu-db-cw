import { terminal } from "terminal-kit";

import { client } from "../api/client";

const rentalsGetRentableScootersEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  try {
    const { data } = await client.get("/rentals/scooters/", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const rentalsGetActiveEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  try {
    const { data } = await client.get("/rentals/active/", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const rentalsCreateEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID самоката: ");
  const scooterId = await terminal.inputField().promise;

  const payload = { scooter_id: scooterId };

  try {
    const { data } = await client.post("/rentals/", payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const rentalsFinishEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID аренды: ");
  const rentalId = await terminal.inputField().promise;

  try {
    const { data } = await client.post(
      `/rentals/${rentalId}/finish/`,
      undefined,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

export {
  rentalsGetRentableScootersEndpoint,
  rentalsGetActiveEndpoint,
  rentalsCreateEndpoint,
  rentalsFinishEndpoint,
};
