import * as crypto from "crypto";

import { Scooter, ScooterId } from "../../models/scooter";

import { ScooterRepo } from "../../interfaces/scooter-repo";

import { NotFoundError } from "../../errors/not-found-error";

class ScooterMockRepo implements ScooterRepo {
  private _scooters: Scooter[] = [];

  public async get() {
    return this._scooters;
  }

  public async getById(id: ScooterId) {
    const scooter = this._scooters.find((s) => s.id === id);
    return scooter || Promise.reject(new NotFoundError("Самокат не найден"));
  }

  public nextId() {
    return crypto.randomUUID() as ScooterId;
  }

  public async remove(id: ScooterId) {
    this._scooters = this._scooters.filter((s) => s.id !== id);
  }

  public async save(scooter: Scooter) {
    await this.remove(scooter.id);
    this._scooters.push(scooter);
  }
}

export { ScooterMockRepo };
