import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { IRestrictedZoneController } from "../interfaces/restricted-zone-controller";
import { IRestrictedZoneService } from "../interfaces/restricted-zone-service";

class RestrictedZoneController implements IRestrictedZoneController {
  private _restrictedZoneService: IRestrictedZoneService;

  public constructor(restrictedZoneService: IRestrictedZoneService) {
    this._restrictedZoneService = restrictedZoneService;
  }

  public async get(ctx: Context) {
    const restrictedZones = await this._restrictedZoneService.getAll();

    ctx.status = StatusCodes.OK;
    ctx.body = restrictedZones.map((z) => z.toJSON());
  }
}

export { RestrictedZoneController };
