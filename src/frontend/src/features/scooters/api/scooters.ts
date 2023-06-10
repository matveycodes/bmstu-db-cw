import { client, RequestConfig } from "features/api";

import { Scooter } from "../types/scooter";
import {
  GetDischargedScootersRequest,
  GetDischargedScootersResponse,
  GetRentableScootersRequest,
  GetRentableScootersResponse,
} from "../types/api";

const getRentableScooters = async (
  params: GetRentableScootersRequest,
  config?: Omit<RequestConfig, "params">
): Promise<Scooter[]> => {
  const { data } = await client.get<GetRentableScootersResponse>(
    "/scooters/rentable/",
    { params, ...config }
  );

  return data;
};

const getDischargedScooters = async (
  params: GetDischargedScootersRequest,
  config?: Omit<RequestConfig, "params">
): Promise<Scooter[]> => {
  const { data } = await client.get<GetDischargedScootersResponse>(
    "/scooters/discharged/",
    { params, ...config }
  );

  return data;
};

const beepScooter = async (id: string) => {
  await client.post(`/scooters/${id}/beep/`);
};

const turnScooterLightsOn = async (id: string) => {
  await client.post(`/scooters/${id}/turn-lights-on/`);
};

const unlockScooter = async (id: string) => {
  await client.post(`/scooters/${id}/unlock/`);
};

export {
  getRentableScooters,
  beepScooter,
  turnScooterLightsOn,
  unlockScooter,
  getDischargedScooters,
};
