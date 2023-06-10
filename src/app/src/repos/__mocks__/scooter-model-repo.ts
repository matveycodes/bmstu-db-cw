import * as crypto from "crypto";

import { ScooterModel, ScooterModelId } from "../../models/scooter-model";

import { ScooterModelRepo } from "../../interfaces/scooter-model-repo";

import { NotFoundError } from "../../errors/not-found-error";

class ScooterModelMockRepo implements ScooterModelRepo {
  private _models: ScooterModel[] = [];

  public async get() {
    return this._models;
  }

  public async getById(id: ScooterModelId) {
    const model = this._models.find((m) => m.id === id);
    return model || Promise.reject(new NotFoundError("Модель не найдена"));
  }

  public nextId() {
    return crypto.randomUUID() as ScooterModelId;
  }

  public async save(scooterModel: ScooterModel) {
    this._models.push(scooterModel);
  }
}

export { ScooterModelMockRepo };
