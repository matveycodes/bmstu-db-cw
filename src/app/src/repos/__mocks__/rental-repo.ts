import * as crypto from "crypto";

import { Rental, RentalId } from "../../models/rental";
import { ScooterId } from "../../models/scooter";
import { UserId } from "../../models/user";

import { RentalRepo } from "../../interfaces/rental-repo";

import { NotFoundError } from "../../errors/not-found-error";

class RentalMockRepo implements RentalRepo {
  private _rentals: Rental[] = [];

  public async get() {
    return this._rentals;
  }

  public async getById(id: RentalId) {
    const rental = this._rentals.find((r) => r.id === id);
    return rental || Promise.reject(new NotFoundError("Аренда не найдена"));
  }

  public async getActiveByScooter(scooterId: ScooterId) {
    return this._rentals.filter((r) => {
      return r.scooterId === scooterId && !r.dateFinished;
    });
  }

  public async getActiveByUser(userId: UserId) {
    return this._rentals.filter((r) => r.userId === userId && !r.dateFinished);
  }

  public async getFinishedByUser(userId: UserId) {
    return this._rentals.filter((r) => r.userId === userId && r.dateFinished);
  }

  public nextId() {
    return crypto.randomUUID() as RentalId;
  }

  public async remove(id: RentalId) {
    this._rentals = this._rentals.filter((r) => r.id !== id);
  }

  public async save(rental: Rental) {
    await this.remove(rental.id);
    this._rentals.push(rental);
  }

  public async isScooterRented(scooterId: ScooterId, userId?: UserId) {
    return !!this._rentals.find((r) => {
      if (userId && r.userId !== userId) {
        return false;
      }

      return r.scooterId === scooterId && !r.dateFinished;
    });
  }
}

export { RentalMockRepo };
