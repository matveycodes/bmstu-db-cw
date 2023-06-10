import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { SubscriptionId } from "../models/subscription";

import { ISubscriptionController } from "../interfaces/subscription-controller";
import { ISubscriptionService } from "../interfaces/subscription-service";

import { PermissionError } from "../errors/permission-error";

import { PurchasedSubscription } from "../vo/purchased-subscription";

class SubscriptionController implements ISubscriptionController {
  private _subscriptionService: ISubscriptionService;

  public constructor(subscriptionService: ISubscriptionService) {
    this._subscriptionService = subscriptionService;
  }

  private async serializePurchasedSubscription(
    purchasedSubscription: PurchasedSubscription
  ) {
    const subscription = await this._subscriptionService.getById(
      purchasedSubscription.subscriptionId
    );

    return {
      subscription: subscription.toJSON(),
      date_started: purchasedSubscription.dateStarted,
      date_finished: purchasedSubscription.dateFinished,
      date_purchased: purchasedSubscription.datePurchased,
    };
  }

  private async serializePurchasedSubscriptions(
    purchasedSubscriptions: PurchasedSubscription[]
  ) {
    return Promise.all(
      purchasedSubscriptions.map((s) => this.serializePurchasedSubscription(s))
    );
  }

  public async get(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "customer") {
      throw new PermissionError("Ошибка авторизации");
    }

    const subscriptions = await this._subscriptionService.get();

    ctx.body = subscriptions.map((s) => s.toJSON());
    ctx.status = StatusCodes.OK;
  }

  public async purchase(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "customer") {
      throw new PermissionError("Ошибка авторизации");
    }

    await this._subscriptionService.purchase(
      ctx.params.id as SubscriptionId,
      ctx.request.user.id
    );

    ctx.status = StatusCodes.OK;
  }

  public async getActive(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "customer") {
      throw new PermissionError("Ошибка авторизации");
    }

    const subscriptions = await this._subscriptionService.getActive(
      ctx.request.user.id
    );

    ctx.body = await this.serializePurchasedSubscriptions(subscriptions);
    ctx.status = StatusCodes.OK;
  }

  public async getFinished(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "customer") {
      throw new PermissionError("Ошибка авторизации");
    }

    const subscriptions = await this._subscriptionService.getFinished(
      ctx.request.user.id
    );

    ctx.body = await this.serializePurchasedSubscriptions(subscriptions);
    ctx.status = StatusCodes.OK;
  }
}

export { SubscriptionController };
