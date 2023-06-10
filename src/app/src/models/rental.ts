import dayjs from "dayjs";

import { CreateRentalDto } from "../dto/create-rental";
import { ValidationError } from "../errors/validation-error";
import { BaseModel } from "./base";
import { UserId } from "./user";
import { ScooterId } from "./scooter";

type RentalId = string & { _opaque: "Rental" };

class Rental extends BaseModel<RentalId> {
  private _userId: UserId;
  private _scooterId: ScooterId;
  private _startPrice: number;
  private _perMinutePrice: number;
  private _dateStarted: Date;
  private _dateFinished?: Date;

  public constructor(createRentalDto: CreateRentalDto) {
    super(createRentalDto.id);

    this._userId = createRentalDto.userId;
    this._scooterId = createRentalDto.scooterId;
    this._startPrice = createRentalDto.startPrice;
    this._perMinutePrice = createRentalDto.perMinutePrice;
    this._dateStarted = createRentalDto.dateStarted;
    this._dateFinished = createRentalDto.dateFinished;
  }

  public get userId() {
    return this._userId;
  }

  public set userId(value: UserId) {
    this._userId = value;
  }

  public get scooterId() {
    return this._scooterId;
  }

  public set scooterId(value: ScooterId) {
    this._scooterId = value;
  }

  public get startPrice() {
    return this._startPrice;
  }

  public set startPrice(value: number) {
    if (value < 0) {
      throw new ValidationError("Цена не может быть отрицательной");
    }

    this._startPrice = value;
  }

  public get perMinutePrice() {
    return this._perMinutePrice;
  }

  public set perMinutePrice(value: number) {
    if (value < 0) {
      throw new ValidationError("Цена не может быть отрицательной");
    }

    this._perMinutePrice = value;
  }

  public get dateStarted() {
    return this._dateStarted;
  }

  public set dateStarted(value: Date) {
    if (this.dateFinished && value > this.dateFinished) {
      throw new ValidationError("Дата начала не может быть позже даты конца");
    }

    this._dateStarted = value;
  }

  public get dateFinished() {
    return this._dateFinished;
  }

  public set dateFinished(value: Date | undefined) {
    if (value && value < this.dateStarted) {
      throw new ValidationError("Дата конца не может быть раньше даты начала");
    }

    this._dateFinished = value;
  }

  public get duration() {
    const end = this.dateFinished ?? new Date();
    return dayjs(end).diff(this.dateStarted, "seconds");
  }

  public get totalPrice() {
    return (
      this.startPrice + Math.floor(this.duration / 60) * this.perMinutePrice
    );
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      user_id: this.userId,
      scooter_id: this.scooterId,
      start_price: this.startPrice,
      per_minute_price: this.perMinutePrice,
      date_started: this.dateStarted,
      date_finished: this.dateFinished ?? null,
      duration: this.duration,
      total_price: this.totalPrice,
    };
  }
}

export { Rental, RentalId };
