import getDistance from "geolib/es/getDistance";

import { BaseModel } from "./base";
import { Location } from "../types/location";
import { CreateParkingDto } from "../dto/create-parking";

type ParkingId = string & { _opaque: "Parking" };

const GPS_ERROR_METERS = 10;

class Parking extends BaseModel<ParkingId> {
  private _location: Location;

  public constructor(createParkingDto: CreateParkingDto) {
    super(createParkingDto.id);

    this._location = createParkingDto.location;
  }

  public get location() {
    return this._location;
  }

  public set location(value: Location) {
    this._location = value;
  }

  public isNear(location: Location) {
    return getDistance(this.location, location) < GPS_ERROR_METERS;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      location: this.location,
    };
  }
}

export { Parking, ParkingId };
