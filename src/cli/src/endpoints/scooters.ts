import { terminal } from "terminal-kit";

import { client } from "../api/client";

const scootersGetEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID самоката: ");
  const scooterId = await terminal.inputField().promise;

  try {
    const { data } = await client.get(`/scooters/${scooterId}/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const scootersTurnLightsOnEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID самоката: ");
  const scooterId = await terminal.inputField().promise;

  try {
    const { data } = await client.get(
      `/scooters/${scooterId}/turn-lights-on/`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const scootersBeepEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID самоката: ");
  const scooterId = await terminal.inputField().promise;

  try {
    const { data } = await client.get(`/scooters/${scooterId}/beep/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const scootersUnlockEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID самоката: ");
  const scooterId = await terminal.inputField().promise;

  try {
    const { data } = await client.get(`/scooters/${scooterId}/unlock/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

export {
  scootersGetEndpoint,
  scootersTurnLightsOnEndpoint,
  scootersUnlockEndpoint,
  scootersBeepEndpoint,
};
