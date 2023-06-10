import { ParkingId } from "../models/parking";

import { Location } from "../types/location";

interface CreateParkingDto {
  id: ParkingId;
  location: Location;
}

export { CreateParkingDto };
