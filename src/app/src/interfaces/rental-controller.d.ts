import { Context } from "koa";

interface IRentalController {
  getActive(ctx: Context): Promise<void>;
  getFinished(ctx: Context): Promise<void>;
  finish(ctx: Context): Promise<void>;
  create(ctx: Context): Promise<void>;
}

export { IRentalController };
