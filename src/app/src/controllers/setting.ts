import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { ISettingController } from "../interfaces/setting-controller";
import { ISettingService } from "../interfaces/setting-service";

import { PermissionError } from "../errors/permission-error";

class SettingController implements ISettingController {
  private _settingService: ISettingService;

  public constructor(settingService: ISettingService) {
    this._settingService = settingService;
  }

  public async get(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "admin") {
      throw new PermissionError("Ошибка авторизации");
    }

    ctx.body = await this._settingService.get();
    ctx.status = StatusCodes.OK;
  }
}

export { SettingController };
