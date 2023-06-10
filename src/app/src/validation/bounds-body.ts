import { z } from "zod";

const BOUNDS_BODY = z.object({
  min_latitude: z.preprocess(
    Number,
    z.number({ required_error: "Укажите минимальную широту" })
  ),
  min_longitude: z.preprocess(
    Number,
    z.number({ required_error: "Укажите минимальную долготу" })
  ),
  max_latitude: z.preprocess(
    Number,
    z.number({ required_error: "Укажите максимальную широту" })
  ),
  max_longitude: z.preprocess(
    Number,
    z.number({ required_error: "Укажите максимальную долготу" })
  ),
});

export { BOUNDS_BODY };
