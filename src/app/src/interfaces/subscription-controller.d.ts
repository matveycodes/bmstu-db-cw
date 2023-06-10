import { Context } from "koa";

interface ISubscriptionController {
  get(ctx: Context): Promise<void>;
  getActive(ctx: Context): Promise<void>;
  getFinished(ctx: Context): Promise<void>;
  purchase(ctx: Context): Promise<void>;
}

export { ISubscriptionController };
