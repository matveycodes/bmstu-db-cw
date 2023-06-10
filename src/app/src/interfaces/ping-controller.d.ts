import { Context } from "koa";

interface IPingController {
  create(ctx: Context): Promise<void>;
}

export { IPingController };
