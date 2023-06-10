import Router from "@koa/router";

import { IRentalController } from "../interfaces/rental-controller";

const createRentalRouter = (controller: IRentalController) => {
  const rentalRouter = new Router({ prefix: "/rentals" });

  rentalRouter.get("/active/", controller.getActive.bind(controller));
  rentalRouter.get("/finished/", controller.getFinished.bind(controller));
  rentalRouter.post("/", controller.create.bind(controller));
  rentalRouter.post("/:id/finish/", controller.finish.bind(controller));

  return rentalRouter;
};

export { createRentalRouter };
