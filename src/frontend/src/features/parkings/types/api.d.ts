import { Response } from "features/api";

import { Parking } from "./parking";

interface GetParkingsRequest {
  min_latitude: number;
  min_longitude: number;
  max_latitude: number;
  max_longitude: number;
}

type GetParkingsResponse = Response<Parking[]>;

export { GetParkingsRequest, GetParkingsResponse };
