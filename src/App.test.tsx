import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { I18nContext, type I18nValue } from "./i18n/context";
import { TEMPLATE_LAST_UPDATED } from "./templateMetadata";

const messages: Record<string, string> = {
  "app-title": "Vite + React + DaisyUI Template",
  "app-intro": "A maintained starting point for new projects.",
  "theme-toggle": "Toggle theme",
  "language-label": "Language",
  "hello-title": "Hello, world",
  "hello-body": "Sensible defaults are ready.",
  "included-title": "What's included",
  "included-vite": "Vite + React 19 + TypeScript",
  "included-ui": "Tailwind CSS 4 with DaisyUI",
  "included-tests": "Vitest + Testing Library",
  "included-i18n": "Fluent translations with automatic updates",
  "next-steps-title": "Next steps",
  "next-steps-body": "Replace the starter content.",
  "last-updated-label": "Template last updated",
};

const i18n: I18nValue = {
  locale: "en-US",
  setLocale: vi.fn(),
  t: (id) => messages[id] ?? id,
};

const mockMatchMedia = () => ({
  matches: false,
  media: "(prefers-color-scheme: dark)",
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

const originalMatchMedia = "matchMedia" in window ? window.matchMedia : undefined;

const renderApp = () =>
  render(
    <I18nContext.Provider value={i18n}>
      <App />
    </I18nContext.Provider>,
  );

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation(mockMatchMedia as unknown as typeof window.matchMedia),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    } else {
      Reflect.deleteProperty(window, "matchMedia");
    }
  });

  it("renders the localized starter content and update timestamp", () => {
    renderApp();

    expect(screen.getByRole("heading", { level: 2, name: /hello, world/i })).toBeInTheDocument();
    expect(screen.getByText(/tailwind css 4 with daisyui/i)).toBeInTheDocument();
    expect(screen.getByText(TEMPLATE_LAST_UPDATED)).toBeInTheDocument();
  });

  it("toggles the theme preference", async () => {
    renderApp();

    fireEvent.click(screen.getByRole("checkbox", { name: /toggle theme/i }));

    await waitFor(() =>
      expect(document.documentElement.getAttribute("data-theme")).toBe("qr-dark"),
    );
    expect(window.localStorage.getItem("vite-ts-template-theme")).toBe("qr-dark");
  });
});
