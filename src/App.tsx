import { useEffect, useState } from "react";
import { BuildInfo } from "./components/BuildInfo";
import { projectConfig } from "./config/project";
import { LOCALES, useI18n } from "./i18n/context";

const THEME_STORAGE_KEY = "app-theme";
type ThemeId = "qr-light" | "qr-dark";

const isThemeId = (value: string | null): value is ThemeId =>
  value === "qr-light" || value === "qr-dark";

const getInitialTheme = (): ThemeId => {
  if (typeof window === "undefined") {
    return "qr-light";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeId(stored)) {
    return stored;
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "qr-dark" : "qr-light";
};

function App() {
  const [theme, setTheme] = useState<ThemeId>(() => getInitialTheme());
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.setAttribute("data-theme", theme);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  return (
    <main className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-col gap-4 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left">
          <div>
            <h1 className="text-3xl font-bold" dir="auto">
              {projectConfig.displayName}
            </h1>
            <p className="mt-2 text-base-content/70">{t("app-intro")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
            <label className="form-control w-44 text-left">
              <span className="label-text mb-1 text-xs">{t("language-label")}</span>
              <select
                className="select select-bordered select-sm"
                aria-label={t("language-label")}
                value={locale}
                onChange={(event) => setLocale(event.currentTarget.value)}
              >
                {LOCALES.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-box bg-base-100 px-4 py-2 shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
              <input
                type="checkbox"
                className="toggle theme-controller"
                aria-label={t("theme-toggle")}
                value="qr-dark"
                checked={theme === "qr-dark"}
                onChange={(event) => setTheme(event.currentTarget.checked ? "qr-dark" : "qr-light")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </label>
          </div>
        </header>

        <section className="card bg-base-100 shadow-xl">
          <div className="card-body space-y-4">
            <h2 className="card-title">{t("hello-title")}</h2>
            <p className="leading-relaxed text-base-content/80">{t("hello-body")}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-box bg-base-200 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                  {t("included-title")}
                </h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>⚡️ {t("included-vite")}</li>
                  <li>🎨 {t("included-ui")}</li>
                  <li>🧪 {t("included-tests")}</li>
                  <li>🌍 {t("included-i18n")}</li>
                  <li>🚀 {t("included-deploy")}</li>
                  <li>♿ {t("included-accessibility")}</li>
                </ul>
              </div>
              <div className="rounded-box bg-base-200 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">
                  {t("next-steps-title")}
                </h3>
                <p className="mt-2 text-sm text-base-content/80">{t("next-steps-body")}</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center">
          <BuildInfo />
        </footer>
      </div>
    </main>
  );
}

export default App;
