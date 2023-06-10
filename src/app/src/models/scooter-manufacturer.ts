import { CreateScooterManufacturerDto } from "../dto/create-scooter-manufacturer";
import { BaseModel } from "./base";

type ScooterManufacturerId = string & { _opaque: "ScooterManufacturer" };

class ScooterManufacturer extends BaseModel<ScooterManufacturerId> {
  private _title: string;

  public constructor(
    createScooterManufacturerDto: CreateScooterManufacturerDto
  ) {
    super(createScooterManufacturerDto.id);

    this._title = createScooterManufacturerDto.title;
  }

  public get title() {
    return this._title;
  }

  public set title(value: string) {
    this._title = value;
  }

  public toJSON() {
    return {
      ...super.toJSON(),
      title: this.title,
    };
  }
}

export { ScooterManufacturer, ScooterManufacturerId };
