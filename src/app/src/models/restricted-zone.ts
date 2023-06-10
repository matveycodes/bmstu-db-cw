import isPointInPolygon from "geolib/es/isPointInPolygon";

import { Location } from "../types/location";
import { CreateRestrictedZoneDto } from "../dto/create-restricted-zone";
import { ValidationError } from "../errors/validation-error";
import { BaseModel } from "./base";

type RestrictedZoneId = string & { _opaque: "RestrictedZone" };

class RestrictedZone extends BaseModel<RestrictedZoneId> {
  private _polygon: Location[];
  private _speedLimit: number;

  public constructor(createRestrictedZoneDto: CreateRestrictedZoneDto) {
    super(createRestrictedZoneDto.id);

    this._polygon = createRestrictedZoneDto.polygon;
    this._speedLimit = createRestrictedZoneDto.speedLimit;
  }

  public get polygon() {
    return this._polygon;
  }

  public set polygon(value: Location[]) {
    if (value.length === 0) {
      throw new ValidationError(
        "Координаты зоны ограничения скорости не могут быть пустыми"
      );
    }

    this._polygon = value;
  }

  public get speedLimit() {
    return this._speedLimit;
  }

  public set speedLimit(value: number) {
    if (value <= 0) {
      throw new ValidationError(
        "Максимальная скорость не может быть отрицательной или равной нулю"
      );
    }

    this._speedLimit = value;
  }

  public contains(point: Location) {
    return isPointInPolygon(point, this.polygon);
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      polygon: this.polygon,
      speed_limit: this.speedLimit,
    };
  }
}

export { RestrictedZone, RestrictedZoneId };
