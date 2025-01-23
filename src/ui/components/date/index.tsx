import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import "dayjs/locale/zh-cn";
import "dayjs/locale/ko";
import "dayjs/locale/fr";
import "dayjs/locale/de";
import "dayjs/locale/pt";
import "dayjs/locale/es";
import "dayjs/locale/it";
import { useAppState } from "@/ui/states/appState";
import { ss } from "@/ui/utils";

dayjs.extend(relativeTime);

interface Props {
  date: string | number;
}

const locales = {
  en: "en",
  fr: "fr",
  ru: "ru",
  ch: "zh-cn",
  kr: "ko",
  de: "de",
  pt: "pt",
  es: "es",
  it: "it",
};

const todayLocale = {
  en: "Today",
  fr: "Aujourd'hui",
  ru: "Сегодня",
  ch: "今天",
  kr: "오늘",
  de: "Heute",
  pt: "Hoje",
  es: "Hoy",
  it: "Oggi",
};

export default function DateComponent({ date }: Props) {
  const { language } = useAppState(ss(["language"]));

  const dateFormat = dayjs(date).locale(
    locales[language as keyof typeof locales]
  );

  if (dayjs().startOf("day").isSame(dateFormat)) {
    return <>{todayLocale[language as keyof typeof todayLocale]}</>;
  }

  return <>{dateFormat.format("D MMMM")}</>;
}
