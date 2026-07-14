import type { FluentVariable } from "@fluent/bundle";
import { createContext, useContext } from "react";

export const LOCALES = [
  { id: "en-US", label: "English" },
  { id: "de-DE", label: "Deutsch" },
  { id: "fr-FR", label: "Français" },
  { id: "es-ES", label: "Español" },
  { id: "it-IT", label: "Italiano" },
  { id: "nl-NL", label: "Nederlands" },
  { id: "pl-PL", label: "Polski" },
  { id: "pt-BR", label: "Português" },
  { id: "uk-UA", label: "Українська" },
  { id: "ja-JP", label: "日本語" },
  { id: "zh-CN", label: "简体中文" },
  { id: "ko-KR", label: "한국어" },
  { id: "ar", label: "العربية" },
  { id: "hi-IN", label: "हिन्दी" },
] as const;

export type Locale = (typeof LOCALES)[number]["id"];

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
  locale: "en-US",
  setLocale: () => undefined,
  t: fallbackText,
});

export const useI18n = () => useContext(I18nContext);
