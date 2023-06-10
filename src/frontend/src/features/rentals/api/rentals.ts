import { client, RequestConfig } from "features/api";

import {
  GetActiveRentalsResponse,
  GetRentalsHistoryResponse,
  StartRentalBody,
} from "../types/api";
import { Rental } from "../types/rental";

const startRental = async (body: StartRentalBody) => {
  await client.post("/rentals/", body);
};

const getActiveRentals = async (
  config?: Omit<RequestConfig, "params">
): Promise<Rental[]> => {
  const { data } = await client.get<GetActiveRentalsResponse>(
    "/rentals/active/",
    config
  );

  return data;
};

const getRentalsHistory = async (
  config?: Omit<RequestConfig, "params">
): Promise<Rental[]> => {
  const { data } = await client.get<GetRentalsHistoryResponse>(
    "/rentals/finished/",
    config
  );

  return data;
};

const finishRental = async (id: Rental["id"]) => {
  await client.post(`/rentals/${id}/finish/`);
};

export { startRental, getActiveRentals, finishRental, getRentalsHistory };
