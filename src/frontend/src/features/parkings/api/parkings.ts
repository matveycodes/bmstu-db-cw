import { client, RequestConfig } from "features/api";

import { GetParkingsRequest, GetParkingsResponse } from "../types/api";
import { Parking } from "../types/parking";

const getParkings = async (
  params: GetParkingsRequest,
  config?: Omit<RequestConfig, "params">
): Promise<Parking[]> => {
  const { data } = await client.get<GetParkingsResponse>("/parkings/", {
    params,
    ...config,
  });

  return data;
};

export { getParkings };
