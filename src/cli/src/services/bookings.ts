import {
  bookingsCancelEndpoint,
  bookingsCreateEndpoint,
  bookingsGetActiveEndpoint,
} from "../endpoints/bookings";

const BOOKINGS_SERVICE = {
  key: "rentals",
  title: "Аренды (rentals)",
  endpoints: [
    {
      title: "GET /bookings/active/",
      handler: bookingsGetActiveEndpoint,
    },
    {
      title: "POST /bookings/",
      handler: bookingsCreateEndpoint,
    },
    {
      title: "DELETE /bookings/:id/",
      handler: bookingsCancelEndpoint,
    },
  ],
};

export { BOOKINGS_SERVICE };
