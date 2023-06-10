import { Context } from "koa";
import { StatusCodes } from "http-status-codes";

import { ScooterId } from "../models/scooter";
import { Rental, RentalId } from "../models/rental";

import { IRentalController } from "../interfaces/rental-controller";
import { IRentalService } from "../interfaces/rental-service";
import { IScooterService } from "../interfaces/scooter-service";

import { RENTAL_START_RENTAL_BODY } from "../validation/rental-start-rental-body";

import { PermissionError } from "../errors/permission-error";

import { CreateRentalControllerDto } from "../dto/create-rental-controller";

class RentalController implements IRentalController {
  private _rentalService: IRentalService;
  private _scooterService: IScooterService;

  public constructor(createRentalControllerDto: CreateRentalControllerDto) {
    this._rentalService = createRentalControllerDto.rentalService;
    this._scooterService = createRentalControllerDto.scooterService;
  }

  private async serializeRental(rental: Rental) {
    const scooter = await this._scooterService.getById(rental.scooterId);
    return { ...rental.toJSON(), scooter_number: scooter.number };
  }

  private async serializeRentals(rentals: Rental[]) {
    return Promise.all(rentals.map((r) => this.serializeRental(r)));
  }

  public async getActive(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const rentals = await this._rentalService.getActiveRentals(
      ctx.request.user.id
    );

    ctx.status = StatusCodes.OK;
    ctx.body = await this.serializeRentals(rentals);
  }

  public async getFinished(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const rentals = await this._rentalService.getFinishedRentals(
      ctx.request.user.id
    );

    ctx.status = StatusCodes.OK;
    ctx.body = await this.serializeRentals(rentals);
  }

  public async create(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    const { scooter_id: scooterId } = await RENTAL_START_RENTAL_BODY.parseAsync(
      ctx.request.body
    );
    await this._rentalService.startRental(
      ctx.request.user.id,
      scooterId as ScooterId
    );

    ctx.status = StatusCodes.OK;
  }

  public async finish(ctx: Context) {
    if (!ctx.request.user) {
      throw new PermissionError("Ошибка авторизации");
    }

    await this._rentalService.finishRental(
      ctx.request.user.id,
      ctx.params.id as RentalId
    );

    ctx.status = StatusCodes.OK;
  }
}

export { RentalController };
