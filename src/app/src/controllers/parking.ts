import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { IParkingController } from "../interfaces/parking-controller";
import { IParkingService } from "../interfaces/parking-service";
import { PARKING_GET_QUERY_BODY } from "../validation/parking-get-query-body";

class ParkingController implements IParkingController {
  private _parkingService: IParkingService;

  public constructor(parkingService: IParkingService) {
    this._parkingService = parkingService;
  }

  public async get(ctx: Context) {
    const bounds = await PARKING_GET_QUERY_BODY.parseAsync(ctx.request.query);

    const parkings = await this._parkingService.getWithinBounds(bounds);

    ctx.status = StatusCodes.OK;
    ctx.body = parkings.map((p) => p.toJSON());
  }
}

export { ParkingController };
