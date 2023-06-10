import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { IAuthService } from "../interfaces/auth-service";
import { IAuthController } from "../interfaces/auth-controller";

import { AUTH_REQUEST_AUTH_BODY_SCHEMA } from "../validation/auth-request-auth-body";
import { AUTH_AUTH_BODY_SCHEMA } from "../validation/auth-auth-body";

class AuthController implements IAuthController {
  private _authService: IAuthService;

  public constructor(authService: IAuthService) {
    this._authService = authService;
  }

  public async request(ctx: Context) {
    const { phone } = await AUTH_REQUEST_AUTH_BODY_SCHEMA.parseAsync(
      ctx.request.body
    );

    const signature = await this._authService.requestAuth(phone);

    ctx.status = StatusCodes.OK;
    ctx.body = { signature };
  }

  public async proceed(ctx: Context) {
    const { signature, code } = await AUTH_AUTH_BODY_SCHEMA.parseAsync(
      ctx.request.body
    );

    const token = await this._authService.auth(signature, code);

    ctx.status = StatusCodes.OK;
    ctx.body = { token };
  }
}

export { AuthController };
