import { Context } from "koa";

interface IUserController {
  get(ctx: Context): Promise<void>;
  getCurrent(ctx: Context): Promise<void>;
  updateCurrent(ctx: Context): Promise<void>;
  block(ctx: Context): Promise<void>;
}

export { IUserController };
