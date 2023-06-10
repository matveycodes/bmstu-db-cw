import { terminal } from "terminal-kit";

import { client } from "../api/client";

const usersGetCurrentEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  try {
    const { data } = await client.get("/users/current/", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const usersUpdateCurrentEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите отчество (middle_name): ");
  const middleName = (await terminal.inputField().promise) || undefined;

  terminal("\nВведите имя (first_name): ");
  const firstName = (await terminal.inputField().promise) || undefined;

  terminal("\nВведите фамилию (last_name): ");
  const lastName = (await terminal.inputField().promise) || undefined;

  terminal("\nВведите почту (email): ");
  const email = (await terminal.inputField().promise) || undefined;

  terminal("\nВведите дату рождения (birthdate): ");
  const birthdate = (await terminal.inputField().promise) || undefined;

  const payload = {
    middle_name: middleName,
    first_name: firstName,
    last_name: lastName,
    email,
    birthdate,
  };

  try {
    const { data } = await client.patch("/users/current/", payload, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const usersBlockEndpoint = async () => {
  terminal("Введите токен авторизации (Bearer): ");
  const authToken = await terminal.inputField().promise;

  terminal("\nВведите ID пользователя: ");
  const userId = await terminal.inputField().promise;

  try {
    const { data } = await client.post(`/users/${userId}/block/`, undefined, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

export {
  usersGetCurrentEndpoint,
  usersUpdateCurrentEndpoint,
  usersBlockEndpoint,
};
