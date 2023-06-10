import Router from "@koa/router";

import { IUserController } from "../interfaces/user-controller";

const createUserRouter = (controller: IUserController) => {
  const userRouter = new Router({ prefix: "/users" });

  userRouter.get("/", controller.get.bind(controller));
  userRouter.get("/current/", controller.getCurrent.bind(controller));
  userRouter.patch("/current/", controller.updateCurrent.bind(controller));
  userRouter.post("/:id/block/", controller.block.bind(controller));

  return userRouter;
};

export { createUserRouter };
