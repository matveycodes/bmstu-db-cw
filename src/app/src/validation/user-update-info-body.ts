import { z } from "zod";

const USER_UPDATE_INFO_BODY = z.object({
  middle_name: z.string().min(1, "Отчество имеет неверный формат").optional(),
  first_name: z.string().min(1, "Имя имеет неверный формат").optional(),
  last_name: z.string().min(1, "Фамилия имеет неверный формат").optional(),
  email: z.string().email("Почта имеет неверный формат").optional(),
  birthdate: z.string().pipe(z.coerce.date()).optional(),
});

export { USER_UPDATE_INFO_BODY };
