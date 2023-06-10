import Router from "@koa/router";

import { IRestrictedZoneController } from "../interfaces/restricted-zone-controller";

const createRestrictedZoneRouter = (controller: IRestrictedZoneController) => {
  const restrictedZoneRouter = new Router({ prefix: "/restricted-zones" });

  restrictedZoneRouter.get("/", controller.get.bind(controller));

  return restrictedZoneRouter;
};

export { createRestrictedZoneRouter };
