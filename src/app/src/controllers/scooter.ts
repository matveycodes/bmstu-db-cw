import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { Scooter, ScooterId } from "../models/scooter";

import { IScooterService } from "../interfaces/scooter-service";
import { IScooterController } from "../interfaces/scooter-controller";
import { IPingService } from "../interfaces/ping-service";
import { IRentalService } from "../interfaces/rental-service";
import { IBookingService } from "../interfaces/booking-service";

import { PermissionError } from "../errors/permission-error";

import { BOUNDS_BODY } from "../validation/bounds-body";

import { CreateScooterControllerDto } from "../dto/create-scooter-controller";

class ScooterController implements IScooterController {
  private _scooterService: IScooterService;
  private _bookingService: IBookingService;
  private _pingService: IPingService;
  private _rentalService: IRentalService;

  public constructor(createScooterControllerDto: CreateScooterControllerDto) {
    this._scooterService = createScooterControllerDto.scooterService;
    this._pingService = createScooterControllerDto.pingService;
    this._rentalService = createScooterControllerDto.rentalService;
    this._bookingService = createScooterControllerDto.bookingService;
  }

  private async serializeScooter(scooter: Scooter) {
    const [ping, time, distance] = await Promise.all([
      this._pingService.getLatestByScooter(scooter.id),
      this._scooterService.estimateTime(scooter.id),
      this._scooterService.estimateDistance(scooter.id),
    ]);

    return {
      ...scooter.toJSON(),
      battery_level: ping.batteryLevel,
      location: ping.location,
      estimates: { time, distance },
    };
  }

  private async serializeScooters(scooters: Scooter[]) {
    return Promise.all(scooters.map((s) => this.serializeScooter(s)));
  }

  public async getDischargedScooters(ctx: Context) {
    if (!ctx.request.user || ctx.request.user.role !== "technician") {
      throw new PermissionError("Ошибка авторизации");
    }

    const bounds = await BOUNDS_BODY.parseAsync(ctx.request.query);

    const scooters = await this._scooterService.getDischargedWithinBounds(
      bounds
    );

    ctx.status = StatusCodes.OK;
    ctx.body = await this.serializeScooters(scooters);
  }

  public async getRentableScooters(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const bounds = await BOUNDS_BODY.parseAsync(ctx.request.query);

    const scooters = await this._rentalService.getRentableScootersWithinBounds(
      ctx.request.user.id,
      bounds
    );

    ctx.status = StatusCodes.OK;
    ctx.body = await this.serializeScooters(scooters);
  }

  public async turnLightsOn(ctx: Context): Promise<void> {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const scooterId = ctx.params.id as ScooterId;
    const userId = ctx.request.user.id;

    if (!(await this._rentalService.isScooterRented(scooterId, userId))) {
      throw new PermissionError("Управлять можно только своим самокатом");
    }

    await this._scooterService.turnLightsOn(scooterId);

    ctx.status = StatusCodes.OK;
  }

  public async beep(ctx: Context): Promise<void> {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const scooterId = ctx.params.id as ScooterId;
    const userId = ctx.request.user.id;

    if (
      !(await this._rentalService.isScooterRented(scooterId, userId)) &&
      !(await this._bookingService.isScooterBooked(scooterId, userId))
    ) {
      throw new PermissionError("Управлять можно только своим самокатом");
    }

    await this._scooterService.beep(scooterId);

    ctx.status = StatusCodes.OK;
  }

  public async unlock(ctx: Context): Promise<void> {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const scooterId = ctx.params.id as ScooterId;
    const userId = ctx.request.user.id;

    if (!(await this._rentalService.isScooterRented(scooterId, userId))) {
      throw new PermissionError("Управлять можно только своим самокатом");
    }

    await this._scooterService.unlock(scooterId);

    ctx.status = StatusCodes.OK;
  }
}

export { ScooterController };
