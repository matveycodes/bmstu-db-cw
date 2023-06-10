import Router from "@koa/router";

import { ISubscriptionController } from "../interfaces/subscription-controller";

const createSubscriptionRouter = (controller: ISubscriptionController) => {
  const subscriptionController = new Router({ prefix: "/subscriptions" });

  subscriptionController.get("/", controller.get.bind(controller));
  subscriptionController.get("/active/", controller.getActive.bind(controller));
  subscriptionController.get(
    "/finished/",
    controller.getFinished.bind(controller)
  );
  subscriptionController.post(
    "/:id/purchase/",
    controller.purchase.bind(controller)
  );

  return subscriptionController;
};

export { createSubscriptionRouter };
