import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { UserId } from "../models/user";

import { IUserController } from "../interfaces/user-controller";
import { IUserService } from "../interfaces/user-service";

import { USER_UPDATE_INFO_BODY } from "../validation/user-update-info-body";

import { PermissionError } from "../errors/permission-error";

class UserController implements IUserController {
  private _userService: IUserService;

  public constructor(userService: IUserService) {
    this._userService = userService;
  }

  public async get(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "admin") {
      throw new PermissionError("Ошибка авторизации");
    }

    const users = await this._userService.get();

    ctx.body = users.map((u) => u.toJSON());
    ctx.status = StatusCodes.OK;
  }

  public async getCurrent(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const user = await this._userService.getInfo(ctx.request.user.id);

    ctx.status = StatusCodes.OK;
    ctx.body = user.toJSON();
  }

  public async updateCurrent(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const info = await USER_UPDATE_INFO_BODY.parseAsync(ctx.request.body);
    await this._userService.updateInfo(ctx.request.user.id, {
      middleName: info.middle_name,
      firstName: info.first_name,
      lastName: info.last_name,
      birthdate: info.birthdate,
      email: info.email,
    });

    ctx.status = StatusCodes.OK;
  }

  public async block(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "admin") {
      throw new PermissionError("Ошибка авторизации");
    }

    await this._userService.block(ctx.params.id as UserId);

    ctx.status = StatusCodes.OK;
  }
}

export { UserController };
