import { Context } from "koa";

interface ISettingController {
  get(ctx: Context): Promise<void>;
}

export { ISettingController };
