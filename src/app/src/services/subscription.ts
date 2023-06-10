import dayjs from "dayjs";

import { SubscriptionId } from "../models/subscription";
import { UserId } from "../models/user";

import { ISubscriptionService } from "../interfaces/subscription-service";
import { SubscriptionRepo } from "../interfaces/subscription-repo";
import { PurchasedSubscriptionRepo } from "../interfaces/purchased-subscription-repo";
import { BillingGateway } from "../interfaces/billing-gateway";
import { UserRepo } from "../interfaces/user-repo";

import { PermissionError } from "../errors/permission-error";

import { CreateSubscriptionServiceDto } from "../dto/create-subscription-service";

class SubscriptionService implements ISubscriptionService {
  private _subscriptionRepo: SubscriptionRepo;
  private _purchasedSubscriptionRepo: PurchasedSubscriptionRepo;
  private _billingGateway: BillingGateway;
  private _userRepo: UserRepo;

  public constructor(
    createSubscriptionServiceDto: CreateSubscriptionServiceDto
  ) {
    this._subscriptionRepo = createSubscriptionServiceDto.subscriptionRepo;
    this._purchasedSubscriptionRepo =
      createSubscriptionServiceDto.purchasedSubscriptionRepo;
    this._billingGateway = createSubscriptionServiceDto.billingGateway;
    this._userRepo = createSubscriptionServiceDto.userRepo;
  }

  /**
   * Возвращает список подписок.
   */
  public async get() {
    return this._subscriptionRepo.get();
  }

  /**
   * Возвращает подписку по её идентификатору.
   *
   * @param id - Уникальный идентификатор подписки
   */
  public async getById(id: SubscriptionId) {
    return this._subscriptionRepo.getById(id);
  }

  /**
   * Возвращает список активных подписок
   * пользователя.
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  public async getActive(userId: UserId) {
    return this._purchasedSubscriptionRepo.getActiveByUser(userId);
  }

  /**
   * Возвращает список завершённых подписок
   * пользователя.
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  public async getFinished(userId: UserId) {
    return this._purchasedSubscriptionRepo.getFinishedByUser(userId);
  }

  /**
   * Проверяет, есть ли у пользователя активная подписка.
   *
   * @param userId - Уникальный идентификатор пользователя
   */
  public async hasUserActiveSubscription(userId: UserId) {
    return this._purchasedSubscriptionRepo.hasUserActiveSubscription(userId);
  }

  /**
   * Приобретает подписку для пользователя.
   *
   * @param id - Уникальный идентификатор подписки
   * @param userId - Уникальный идентификатор пользователя
   */
  public async purchase(id: SubscriptionId, userId: UserId) {
    const user = await this._userRepo.getById(userId);
    if (!user.isActive) {
      throw new PermissionError("Пользователь не может покупать подписки");
    }

    const subscription = await this._subscriptionRepo.getById(id);

    await this._billingGateway.bill(userId, subscription.price);

    let dateStarted = new Date();
    try {
      const activeSubscription =
        await this._purchasedSubscriptionRepo.getLastActiveByUser(userId);
      dateStarted = activeSubscription.dateFinished;
    } catch {
      /* noop */
    }

    const dateFinished = dayjs(dateStarted)
      .add(subscription.duration, "seconds")
      .toDate();

    await this._purchasedSubscriptionRepo.save({
      subscriptionId: subscription.id,
      userId,
      dateStarted,
      dateFinished,
      datePurchased: new Date(),
    });
  }
}

export { SubscriptionService };
