import Router from "@koa/router";

import { IAuthController } from "../interfaces/auth-controller";

const createAuthRouter = (controller: IAuthController) => {
  const authRouter = new Router({ prefix: "/auth" });

  authRouter.post("/request/", controller.request.bind(controller));
  authRouter.post("/proceed/", controller.proceed.bind(controller));

  return authRouter;
};

export { createAuthRouter };
