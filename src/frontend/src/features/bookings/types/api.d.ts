import { Response } from "features/api";

import { Booking } from "./booking";

type GetActiveBookingsResponse = Response<Booking[]>;

interface CreateBookingBody {
  scooter_id: string;
}

export { CreateBookingBody, GetActiveBookingsResponse };
