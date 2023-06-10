import Router from "@koa/router";

import { ISettingController } from "../interfaces/setting-controller";

const createSettingRouter = (controller: ISettingController) => {
  const settingRouter = new Router({ prefix: "/settings" });

  settingRouter.get("/", controller.get.bind(controller));

  return settingRouter;
};

export { createSettingRouter };
