import { terminal } from "terminal-kit";

import { SERVICES } from "./services";

const terminate = () => {
  terminal.grabInput(false);
  setTimeout(() => terminal.processExit(0), 100);
};

const selectService = async () => {
  const { selectedIndex: selectedServiceIndex } =
    await terminal.singleColumnMenu(
      SERVICES.map((s) => s.title),
      { submittedStyle: terminal.bold.inverse }
    ).promise;

  return SERVICES[selectedServiceIndex];
};

const selectEndpoint = async (service: (typeof SERVICES)[number]) => {
  const { selectedIndex: selectedEndpointIndex } =
    await terminal.singleColumnMenu(
      service.endpoints.map((e) => e.title),
      { submittedStyle: terminal.bold.inverse }
    ).promise;

  return service.endpoints[selectedEndpointIndex];
};

const run = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    terminal("Выберите сервис:\n");
    const selectedService = await selectService();

    terminal("\nВыберите эндпоинт:\n");
    const selectedEndpoint = await selectEndpoint(selectedService);

    terminal("\n");
    await selectedEndpoint.handler();
    terminal("\n\n");
  }
};

terminal.on("key", (name: string) => {
  if (name === "CTRL_C") {
    terminate();
  }
});

void run();
