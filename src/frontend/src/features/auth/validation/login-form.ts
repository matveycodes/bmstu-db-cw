import { z } from "zod";

const LOGIN_FORM_VALIDATION_SCHEMA = z.object({
  phone: z
    .string({ required_error: "Укажите номер телефона" })
    .regex(/^[+]7\s[(][0-9]{3}[)]\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/, {
      message: "Номер телефона имеет неверный формат",
    }),
});

export { LOGIN_FORM_VALIDATION_SCHEMA };
