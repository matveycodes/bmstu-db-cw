import { patternFormatter } from "react-number-format";

const PHONE_FORMAT = "+7 (###) ###-##-##";

const serializePhone = (phone: string) => {
  return phone.replace(/[^0-9.]/g, "");
};

const formatPhone = (phone: string) => {
  return patternFormatter(phone.substring(1), { format: PHONE_FORMAT });
};

export { serializePhone, formatPhone, PHONE_FORMAT };
