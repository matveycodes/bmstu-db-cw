import { CreateScooterDto } from "../dto/create-scooter";

import { ScooterModelId } from "./scooter-model";
import { BaseModel } from "./base";

type ScooterStatus = "enabled" | "disabled";

type ScooterId = string & { _opaque: "Scooter" };

class Scooter extends BaseModel<ScooterId> {
  private _status: ScooterStatus;
  private _number: string;
  private _modelId: ScooterModelId;

  public constructor(createScooterDto: CreateScooterDto) {
    super(createScooterDto.id);

    this._status = createScooterDto.status;
    this._number = createScooterDto.number;
    this._modelId = createScooterDto.modelId;
  }

  public get status() {
    return this._status;
  }

  public set status(value: ScooterStatus) {
    this._status = value;
  }

  public get isEnabled() {
    return this.status === "enabled";
  }

  public get number() {
    return this._number;
  }

  public set number(value: string) {
    this._number = value;
  }

  public get modelId() {
    return this._modelId;
  }

  public set modelId(value: ScooterModelId) {
    this._modelId = value;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      status: this.status,
      number: this.number,
      model_id: this.modelId,
    };
  }
}

export { Scooter, ScooterStatus, ScooterId };
