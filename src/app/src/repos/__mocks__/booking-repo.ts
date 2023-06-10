import * as crypto from "crypto";

import { Booking, BookingId } from "../../models/booking";
import { ScooterId } from "../../models/scooter";
import { UserId } from "../../models/user";

import { BookingRepo } from "../../interfaces/booking-repo";

import { NotFoundError } from "../../errors/not-found-error";

class BookingMockRepo implements BookingRepo {
  private _bookings: Booking[] = [];

  public async get() {
    return this._bookings;
  }

  public async getById(id: BookingId) {
    const booking = this._bookings.find((b) => b.id === id);
    return (
      booking || Promise.reject(new NotFoundError("Бронирование не найдено"))
    );
  }

  public async getActiveByScooter(scooterId: ScooterId) {
    const now = new Date();

    return this._bookings.filter((b) => {
      return b.scooterId === scooterId && b.dateFinished > now;
    });
  }

  public async getActiveByUser(userId: UserId) {
    const now = new Date();

    return this._bookings.filter((b) => {
      return b.userId === userId && b.dateFinished > now;
    });
  }

  public nextId() {
    return crypto.randomUUID() as BookingId;
  }

  public async remove(id: BookingId) {
    this._bookings = this._bookings.filter((b) => b.id !== id);
  }

  public async save(booking: Booking) {
    await this.remove(booking.id);
    this._bookings.push(booking);
  }

  public async isScooterBooked(scooterId: ScooterId, userId?: UserId) {
    return !!this._bookings.find((b) => {
      if (userId && b.userId !== userId) {
        return false;
      }

      return b.scooterId === scooterId;
    });
  }
}

export { BookingMockRepo };
