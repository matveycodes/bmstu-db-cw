import { Context } from "koa";

interface IParkingController {
  get(ctx: Context): Promise<void>;
}

export { IParkingController };
