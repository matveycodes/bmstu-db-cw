import Router from "@koa/router";

import { IParkingController } from "../interfaces/parking-controller";

const createParkingRouter = (controller: IParkingController) => {
  const parkingRouter = new Router({ prefix: "/parkings" });

  parkingRouter.get("/", controller.get.bind(controller));

  return parkingRouter;
};

export { createParkingRouter };
