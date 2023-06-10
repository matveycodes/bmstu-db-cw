/**
 * @group unit
 */

import { UserId } from "../user";
import { ScooterId } from "../scooter";
import { Rental, RentalId } from "../rental";

describe("duration", () => {
  it("Корректно определяет продолжительность без даты завершения", () => {
    const rental = new Rental({
      id: "1" as RentalId,
      userId: "1" as UserId,
      scooterId: "1" as ScooterId,
      dateStarted: new Date("2022-01-01T00:00:00"),
      startPrice: 10,
      perMinutePrice: 1,
    });
    jest.useFakeTimers({ now: new Date("2022-01-01T00:05:45") });

    expect(rental.duration).toBe(5 * 60 + 45);
    jest.useRealTimers();
  });

  it("Корректно определяет продолжительность с датой завершения", () => {
    const rental = new Rental({
      id: "1" as RentalId,
      userId: "1" as UserId,
      scooterId: "1" as ScooterId,
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:15:25"),
      startPrice: 10,
      perMinutePrice: 1,
    });

    expect(rental.duration).toBe(15 * 60 + 25);
  });
});

describe("totalPrice", () => {
  it("Корректно вычисляет общую стоимость поездки", () => {
    const rental = new Rental({
      id: "1" as RentalId,
      userId: "1" as UserId,
      scooterId: "1" as ScooterId,
      dateStarted: new Date("2022-01-01T00:00:00"),
      dateFinished: new Date("2022-01-01T00:15:25"),
      startPrice: 10,
      perMinutePrice: 1,
    });

    expect(rental.totalPrice).toBe(10 + 15);
  });
});
