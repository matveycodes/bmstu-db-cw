import { terminal } from "terminal-kit";

import { client } from "../api/client";

const authRequestEndpoint = async () => {
  terminal("Введите номер телефона: ");
  const phone = await terminal.inputField().promise;

  const payload = { phone };

  try {
    const { data } = await client.post("/auth/request/", payload);
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

const authProceedEndpoint = async () => {
  terminal("Введите подпись: ");
  const signature = await terminal.inputField().promise;

  terminal("\nВведите код: ");
  const code = await terminal.inputField().promise;

  if (!code || !Number.isFinite(+code)) {
    return terminal.red("\nКод не является числом");
  }

  const payload = { signature, code: +code };

  try {
    const { data } = await client.post("/auth/proceed/", payload);
    terminal.green(`\n\n${JSON.stringify(data, null, 2)}`);
  } catch (error) {
    terminal.red(`\n\n${error}`);
  }
};

export { authRequestEndpoint, authProceedEndpoint };
