import { z } from "zod";

const BOOKING_BOOK_SCOOTER_BODY_SCHEMA = z.object({
  scooter_id: z.string({ required_error: "Укажите идентификатор самоката" }),
});

export { BOOKING_BOOK_SCOOTER_BODY_SCHEMA };
