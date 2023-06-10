import { client, RequestConfig } from "features/api";

import { CreateBookingBody, GetActiveBookingsResponse } from "../types/api";
import { Booking } from "../types/booking";

const getActiveBookings = async (
  config?: Omit<RequestConfig, "params">
): Promise<Booking[]> => {
  const { data } = await client.get<GetActiveBookingsResponse>(
    "/bookings/active/",
    config
  );

  return data;
};

const createBooking = async (body: CreateBookingBody) => {
  await client.post("/bookings/", body);
};

const cancelBooking = async (id: Booking["id"]) => {
  await client.delete(`/bookings/${id}/`);
};

export { createBooking, getActiveBookings, cancelBooking };
