import { z } from "zod";

const PING_SAVE_BODY = z.object({
  scooter_id: z.string({ required_error: "Укажите идентификатор самоката" }),
  meta_info: z.record(z.string()).optional(),
  location: z.object(
    {
      latitude: z.number({ required_error: "Укажите широту" }),
      longitude: z.number({ required_error: "Укажите долготу" }),
    },
    { required_error: "Укажите геолокацию" }
  ),
  battery_level: z
    .number({ required_error: "Укажите уровень заряда" })
    .int("Уровень заряда имеет неверный формат (нецелое число)")
    .min(0, "Уровень заряда имеет неверный формат (меньше 0)")
    .max(100, "Уровень заряда имеет неверный формат (больше 100)"),
  lock_state: z.enum(["locked", "unlocked"], {
    required_error: "Укажите состояние замка",
  }),
  lights_state: z.enum(["on", "off"], {
    required_error: "Укажите состояние фар",
  }),
});

export { PING_SAVE_BODY };
