import { Context } from "koa";

interface IRestrictedZoneController {
  get(ctx: Context): Promise<void>;
}

export { IRestrictedZoneController };
