import { z } from "zod";

const RENTAL_START_RENTAL_BODY = z.object({
  scooter_id: z.string({ required_error: "Укажите идентификатор самоката" }),
});

export { RENTAL_START_RENTAL_BODY };
