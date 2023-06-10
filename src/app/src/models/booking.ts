import dayjs from "dayjs";

import { CreateBookingDto } from "../dto/create-booking";
import { ValidationError } from "../errors/validation-error";
import { BaseModel } from "./base";
import { UserId } from "./user";
import { ScooterId } from "./scooter";

type BookingId = string & { _opaque: "Booking" };

class Booking extends BaseModel<BookingId> {
  private _userId: UserId;
  private _scooterId: ScooterId;
  private _dateStarted: Date;
  private _dateFinished: Date;

  public constructor(createBookingDto: CreateBookingDto) {
    super(createBookingDto.id);

    this._userId = createBookingDto.userId;
    this._scooterId = createBookingDto.scooterId;
    this._dateStarted = createBookingDto.dateStarted;
    this._dateFinished = createBookingDto.dateFinished;
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

  public get dateStarted() {
    return this._dateStarted;
  }

  public set dateStarted(value: Date) {
    if (value > this.dateFinished) {
      throw new ValidationError("Дата начала не может быть позже даты конца");
    }

    this._dateStarted = value;
  }

  public get dateFinished() {
    return this._dateFinished;
  }

  public set dateFinished(value: Date) {
    if (value && value < this.dateStarted) {
      throw new ValidationError("Дата конца не может быть раньше даты начала");
    }

    this._dateFinished = value;
  }

  public get duration() {
    const now = new Date();
    const end = this.dateFinished > now ? now : this.dateFinished;

    return dayjs(end).diff(this.dateStarted, "seconds");
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      user_id: this.userId,
      scooter_id: this.scooterId,
      date_started: this.dateStarted.toISOString(),
      date_finished: this.dateFinished.toISOString(),
      duration: this.duration,
    };
  }
}

export { Booking, BookingId };
