import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { ScooterId } from "../models/scooter";

import { IPingController } from "../interfaces/ping-controller";
import { IPingService } from "../interfaces/ping-service";

import { PING_SAVE_BODY } from "../validation/ping-save-body";

class PingController implements IPingController {
  private _pingService: IPingService;

  public constructor(pingService: IPingService) {
    this._pingService = pingService;
  }

  public async create(ctx: Context) {
    const body = await PING_SAVE_BODY.parseAsync(ctx.request.body);

    await this._pingService.save({
      scooterId: body.scooter_id as ScooterId,
      metaInfo: body.meta_info,
      location: body.location,
      batteryLevel: body.battery_level,
      lockState: body.lock_state,
      lightsState: body.lights_state,
    });

    ctx.status = StatusCodes.CREATED;
  }
}

export { PingController };
