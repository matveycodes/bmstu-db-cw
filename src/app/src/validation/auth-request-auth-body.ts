import { z } from "zod";

const AUTH_REQUEST_AUTH_BODY_SCHEMA = z.object({
  phone: z
    .string({ required_error: "Укажите номер телефона" })
    .regex(/^7[0-9]{10}$/, {
      message: "Номер телефона имеет неверный формат",
    }),
});

export { AUTH_REQUEST_AUTH_BODY_SCHEMA };
