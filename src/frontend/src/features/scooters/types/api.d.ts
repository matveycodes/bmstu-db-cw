import { Response } from "features/api";

import { Scooter } from "./scooter";

interface GetRentableScootersRequest {
  min_latitude: number;
  min_longitude: number;
  max_latitude: number;
  max_longitude: number;
}

type GetDischargedScootersRequest = GetRentableScootersRequest;

type GetRentableScootersResponse = Response<Scooter[]>;

type GetDischargedScootersResponse = Response<Scooter[]>;

export {
  GetRentableScootersResponse,
  GetRentableScootersRequest,
  GetDischargedScootersResponse,
  GetDischargedScootersRequest,
};
