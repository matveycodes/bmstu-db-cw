import Router from "@koa/router";

import { ITariffController } from "../interfaces/tariff-controller";

const createTariffRouter = (controller: ITariffController) => {
  const tariffRouter = new Router({ prefix: "/tariff" });

  tariffRouter.get("/", controller.get.bind(controller));

  return tariffRouter;
};

export { createTariffRouter };
