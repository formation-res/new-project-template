import type { FluentVariable } from "@fluent/bundle";
import { createContext, useContext } from "react";
import { locales, projectConfig } from "../config/project";

export const LOCALES = locales;
export type Locale = string;

export interface I18nValue {
  locale: Locale;
  setLocale: (locale: string) => void;
  t: (id: string, args?: Record<string, FluentVariable>) => string;
}

export const isLocale = (value: string | null): value is Locale =>
  LOCALES.some(({ id }) => id === value);

export const fallbackText = (id: string) =>
  id.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const I18nContext = createContext<I18nValue>({
  locale: projectConfig.defaultLocale,
  setLocale: () => undefined,
  t: fallbackText,
});

export const useI18n = () => useContext(I18nContext);
