/**
 * @group unit
 */

import { Booking, BookingId } from "../booking";
import { UserId } from "../user";
import { ScooterId } from "../scooter";

describe("duration", () => {
  it("Корректно определяет продолжительность без даты завершения", () => {
    const booking = new Booking({
      id: "1" as BookingId,
      userId: "1" as UserId,
      scooterId: "1" as ScooterId,
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:15:00"),
    });
    jest.useFakeTimers({ now: new Date("2022-01-01T00:05:30") });

    expect(booking.duration).toBe(5 * 60 + 30);
    jest.useRealTimers();
  });

  it("Корректно определяет продолжительность с датой завершения", () => {
    const booking = new Booking({
      id: "1" as BookingId,
      userId: "1" as UserId,
      scooterId: "1" as ScooterId,
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:15:25"),
    });

    expect(booking.duration).toBe(15 * 60 + 25);
  });
});
