import { Response } from "features/api";

import { Rental } from "./rental";

interface StartRentalBody {
  scooter_id: string;
}

type GetActiveRentalsResponse = Response<Rental[]>;

type GetRentalsHistoryResponse = Response<Rental[]>;

export { StartRentalBody, GetActiveRentalsResponse, GetRentalsHistoryResponse };
