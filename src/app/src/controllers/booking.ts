import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { ScooterId } from "../models/scooter";
import { Booking, BookingId } from "../models/booking";

import { IBookingService } from "../interfaces/booking-service";
import { IBookingController } from "../interfaces/booking-controller";
import { IScooterService } from "../interfaces/scooter-service";

import { PermissionError } from "../errors/permission-error";

import { BOOKING_BOOK_SCOOTER_BODY_SCHEMA } from "../validation/booking-book-scooter-body";

import { CreateBookingControllerDto } from "../dto/create-booking-controller";

class BookingController implements IBookingController {
  private _bookingService: IBookingService;
  private _scooterService: IScooterService;

  public constructor(createBookingControllerDto: CreateBookingControllerDto) {
    this._bookingService = createBookingControllerDto.bookingService;
    this._scooterService = createBookingControllerDto.scooterService;
  }

  private async serializeBooking(booking: Booking) {
    const scooter = await this._scooterService.getById(booking.scooterId);
    return { ...booking.toJSON(), scooter_number: scooter.number };
  }

  private async serializeBookings(bookings: Booking[]) {
    return Promise.all(bookings.map((b) => this.serializeBooking(b)));
  }

  public async getActive(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const bookings = await this._bookingService.getActiveBookings(
      ctx.request.user.id
    );

    ctx.status = StatusCodes.OK;
    ctx.body = await this.serializeBookings(bookings);
  }

  public async create(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const { scooter_id: scooterId } =
      await BOOKING_BOOK_SCOOTER_BODY_SCHEMA.parseAsync(ctx.request.body);

    await this._bookingService.bookScooter(
      ctx.request.user.id,
      scooterId as ScooterId
    );

    ctx.status = StatusCodes.CREATED;
  }

  public async cancel(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    await this._bookingService.cancelBooking(
      ctx.request.user.id,
      ctx.params.id as BookingId
    );

    ctx.status = StatusCodes.OK;
  }
}

export { BookingController };
