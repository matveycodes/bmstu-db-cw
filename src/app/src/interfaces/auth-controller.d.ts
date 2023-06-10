import { Context } from "koa";

interface IAuthController {
  request(ctx: Context): Promise<void>;
  proceed(ctx: Context): Promise<void>;
}

export { IAuthController };
