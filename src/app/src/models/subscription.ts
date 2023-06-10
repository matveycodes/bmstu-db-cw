import { CreateSubscriptionDto } from "../dto/create-subscription";
import { ValidationError } from "../errors/validation-error";
import { BaseModel } from "./base";

type SubscriptionId = string & { _opaque: "Subscription" };

class Subscription extends BaseModel<SubscriptionId> {
  private _title: string;
  private _price: number;
  private _duration: number;

  public constructor(createSubscriptionDto: CreateSubscriptionDto) {
    super(createSubscriptionDto.id);

    this._title = createSubscriptionDto.title;
    this._price = createSubscriptionDto.price;
    this._duration = createSubscriptionDto.duration;
  }

  public get title() {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get price() {
    return this._price;
  }

  public set price(value: number) {
    if (value < 0) {
      throw new ValidationError("Цена не может быть отрицательной");
    }

    this._price = value;
  }

  public get duration() {
    return this._duration;
  }

  public set duration(value: number) {
    if (value < 0) {
      throw new ValidationError("Длительность не может быть отрицательной");
    }

    this._duration = value;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      price: this.price,
      duration: this.duration,
    };
  }
}

export { Subscription, SubscriptionId };
