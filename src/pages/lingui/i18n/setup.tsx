import { ReactNode, useCallback, useEffect } from "react";
import { i18n } from "@lingui/core";
import { I18nProvider as Provider, Trans, useLingui } from "@lingui/react";

export enum Locale {
  En = "en",
  Ru = "ru",
}

const dynamicActivate = async (locale: Locale) => {
  const messages = await import(`./locales//${locale}.json`);
  i18n.loadAndActivate({ locale, messages });
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    dynamicActivate(Locale.En);
  }, []);

  return <Provider i18n={i18n}>{children}</Provider>;
};

export const TranslateText = Trans;

export const useTranslate = () => {
  const context = useLingui();

  const changeLocale = useCallback((locale: Locale) => {
    dynamicActivate(locale);
  }, []);

  return { ...context, changeLocale };
};
