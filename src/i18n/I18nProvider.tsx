import { FluentBundle, FluentResource, type FluentVariable } from "@fluent/bundle";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { locales, projectConfig } from "../config/project";
import { fallbackText, I18nContext, isLocale, LOCALES, type Locale } from "./context";

const LOCALE_STORAGE_KEY = "app-locale";

function findBrowserLocale(): Locale {
  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isLocale(saved)) return saved;

  const languages = [navigator.language, ...(navigator.languages ?? [])];
  return (
    LOCALES.find(({ id }) =>
      languages.some((language) => language === id || language.startsWith(id.slice(0, 2))),
    )?.id ?? projectConfig.defaultLocale
  );
}

async function loadBundle(locale: Locale): Promise<FluentBundle> {
  const response = await fetch(`${import.meta.env.BASE_URL}lang/${locale}.ftl`);
  if (!response.ok) throw new Error(`Could not load locale ${locale}`);

  const bundle = new FluentBundle(locale);
  const errors = bundle.addResource(new FluentResource(await response.text()));
  if (errors.length > 0) throw new Error(`Invalid locale ${locale}: ${errors.join(", ")}`);
  return bundle;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(findBrowserLocale);
  const [bundle, setBundle] = useState<FluentBundle | null>(null);
  const [fallbackBundle, setFallbackBundle] = useState<FluentBundle | null>(null);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locales.find(({ id }) => id === locale)?.rtl ? "rtl" : "ltr";
    let active = true;

    void Promise.all([
      loadBundle(locale),
      locale === "en-US" ? Promise.resolve(null) : loadBundle("en-US"),
    ])
      .then(([current, fallback]) => {
        if (active) {
          setBundle(current);
          setFallbackBundle(fallback);
        }
      })
      .catch((error: unknown) => console.error("Could not load translations", error));

    return () => {
      active = false;
    };
  }, [locale]);

  const setLocale = useCallback((nextLocale: string) => {
    if (!isLocale(nextLocale)) return;
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    setLocaleState(nextLocale);
  }, []);

  const t = useCallback(
    (id: string, args?: Record<string, FluentVariable>) => {
      const message = bundle?.getMessage(id) ?? fallbackBundle?.getMessage(id);
      if (!message?.value) return fallbackText(id);
      const source = bundle?.hasMessage(id) ? bundle : fallbackBundle;
      return source?.formatPattern(message.value, args) ?? fallbackText(id);
    },
    [bundle, fallbackBundle],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
