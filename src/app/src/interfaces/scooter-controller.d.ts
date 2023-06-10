import { Context } from "koa";

interface IScooterController {
  getDischargedScooters(ctx: Context): Promise<void>;
  getRentableScooters(ctx: Context): Promise<void>;
  turnLightsOn(ctx: Context): Promise<void>;
  beep(ctx: Context): Promise<void>;
  unlock(ctx: Context): Promise<void>;
}

export { IScooterController };
