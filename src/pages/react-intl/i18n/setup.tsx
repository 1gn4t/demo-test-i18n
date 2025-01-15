import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IntlProvider, FormattedMessage, useIntl } from "react-intl";

export enum Locale {
  En = "en",
  Ru = "ru",
}

const loadMessages = async (locale: Locale) => {
  const messages = await import(`./locales//${locale}.json`);
  return messages.default;
};

const I18nContext = createContext<null | {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>(null);

export const useChangeLanguage = () => {
  const value = useContext(I18nContext);

  if (!value) {
    throw new Error("error");
  }

  return { ...value };
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(Locale.En);
  const [messages, setMessages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    loadMessages(locale).then((messages) => {
      setMessages(() => messages);
    });
  }, [locale]);

  if (!messages) return <p>Loading...</p>;

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
};

export const TranslateText = FormattedMessage;
export const useTranslate = useIntl;
