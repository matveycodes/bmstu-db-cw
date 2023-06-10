import { CreateScooterModelDto } from "../dto/create-scooter-model";
import { ValidationError } from "../errors/validation-error";
import { BaseModel } from "./base";
import { ScooterManufacturerId } from "./scooter-manufacturer";

type ScooterModelId = string & { _opaque: "ScooterModel" };

class ScooterModel extends BaseModel<ScooterModelId> {
  private _title: string;
  private _singleChargeMileage: number;
  private _weight: number;
  private _maxSpeed: number;
  private _maxLoad: number;
  private _year: number;
  private _manufacturerId: ScooterManufacturerId;

  public constructor(createScooterModelDto: CreateScooterModelDto) {
    super(createScooterModelDto.id);

    this._title = createScooterModelDto.title;
    this._maxLoad = createScooterModelDto.maxLoad;
    this._weight = createScooterModelDto.weight;
    this._singleChargeMileage = createScooterModelDto.singleChargeMileage;
    this._maxSpeed = createScooterModelDto.maxSpeed;
    this._manufacturerId = createScooterModelDto.manufacturerId;
    this._year = createScooterModelDto.year;
  }

  public get title() {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public get singleChargeMileage() {
    return this._singleChargeMileage;
  }

  public set singleChargeMileage(value: number) {
    if (value <= 0) {
      throw new ValidationError(
        "Пробег на одном заряде не может быть отрицательным или равным нулю"
      );
    }

    this._singleChargeMileage = value;
  }

  public get weight() {
    return this._weight;
  }

  public set weight(value: number) {
    if (value <= 0) {
      throw new ValidationError(
        "Масса не может быть отрицательной или равной нулю"
      );
    }

    this._weight = value;
  }

  public get maxSpeed() {
    return this._maxSpeed;
  }

  public set maxSpeed(value: number) {
    if (value <= 0) {
      throw new ValidationError(
        "Максимальная скорость не может быть отрицательной или равной нулю"
      );
    }

    this._maxSpeed = value;
  }

  public get maxLoad() {
    return this._maxLoad;
  }

  public set maxLoad(value: number) {
    if (value <= 0) {
      throw new ValidationError(
        "Максимальная нагрузка не может быть отрицательной или равной нулю"
      );
    }

    this._maxLoad = value;
  }

  public set manufacturerId(value: ScooterManufacturerId) {
    this._manufacturerId = value;
  }

  public get manufacturerId() {
    return this._manufacturerId;
  }

  public get year() {
    return this._year;
  }

  public set year(value: number) {
    this._year = value;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
      single_charge_mileage: this.singleChargeMileage,
      weight: this.weight,
      max_speed: this.maxSpeed,
      max_load: this.maxLoad,
      year: this.year,
      manufacturer_id: this.manufacturerId,
    };
  }
}

export { ScooterModel, ScooterModelId };
