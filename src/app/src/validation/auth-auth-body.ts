import { z } from "zod";

const AUTH_AUTH_BODY_SCHEMA = z.object({
  signature: z
    .string({ required_error: "Укажите подпись" })
    .min(1, "Укажите подпись"),
  code: z
    .number({ required_error: "Укажите код" })
    .int({ message: "Код имеет неверный формат" }),
});

export { AUTH_AUTH_BODY_SCHEMA };
