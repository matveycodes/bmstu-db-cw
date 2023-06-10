import { Context } from "koa";

interface ITariffController {
  get(ctx: Context): Promise<void>;
}

export { ITariffController };
