import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { ITariffController } from "../interfaces/tariff-controller";
import { ITariffService } from "../interfaces/tariff-service";

import { PermissionError } from "../errors/permission-error";

class TariffController implements ITariffController {
  private _tariffService: ITariffService;

  public constructor(tariffService: ITariffService) {
    this._tariffService = tariffService;
  }

  public async get(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const tariff = await this._tariffService.get(ctx.request.user.id);

    ctx.status = StatusCodes.OK;
    ctx.body = {
      start_price: tariff.startPrice,
      per_minute_price: tariff.perMinutePrice,
    };
  }
}

export { TariffController };
