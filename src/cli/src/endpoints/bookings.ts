import { terminal } from "terminal-kit";

import { client } from "../api/client";

const bookingsGetActiveEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  try {
    const { data } = await client.get("/bookings/active/", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const bookingsCreateEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID самоката: ");
  const scooterId = await terminal.inputField().promise;

  const payload = { scooter_id: scooterId };

  try {
    const { data } = await client.post("/bookings/", payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const bookingsCancelEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID бронирования: ");
  const bookingId = await terminal.inputField().promise;

  try {
    const { data } = await client.delete(`/bookings/${bookingId}/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

export {
  bookingsGetActiveEndpoint,
  bookingsCreateEndpoint,
  bookingsCancelEndpoint,
};
