import Router from "@koa/router";

import { IScooterController } from "../interfaces/scooter-controller";

const createScooterRouter = (controller: IScooterController) => {
  const scooterRouter = new Router({ prefix: "/scooters" });

  scooterRouter.get(
    "/discharged/",
    controller.getDischargedScooters.bind(controller)
  );
  scooterRouter.get(
    "/rentable/",
    controller.getRentableScooters.bind(controller)
  );
  scooterRouter.post(
    "/:id/turn-lights-on/",
    controller.turnLightsOn.bind(controller)
  );
  scooterRouter.post("/:id/beep/", controller.beep.bind(controller));
  scooterRouter.post("/:id/unlock/", controller.unlock.bind(controller));

  return scooterRouter;
};

export { createScooterRouter };
