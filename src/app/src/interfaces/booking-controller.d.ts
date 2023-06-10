import { Context } from "koa";

interface IBookingController {
  getActive(ctx: Context): Promise<void>;
  create(ctx: Context): Promise<void>;
  cancel(ctx: Context): Promise<void>;
}

export { IBookingController };
