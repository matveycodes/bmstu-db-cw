import dayjs from "dayjs";
import localeRU from "dayjs/locale/ru";
import humanizeDuration from "humanize-duration";

dayjs.locale(localeRU);

const formatDuration = (duration: number) => {
  return humanizeDuration(duration * 1000, { language: "ru" });
};

const formatDate = (date: string | Date, withTime = true) => {
  const format = withTime ? "D MMMM YYYY [г.] [в] HH:mm" : "D MMMM YYYY [г.]";
  return dayjs(date).format(format);
};

export { formatDuration, formatDate };
