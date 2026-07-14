import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useI18n } from "./context";
import { I18nProvider } from "./I18nProvider";

function Example() {
  const { locale, t } = useI18n();
  return <p>{`${locale}: ${t("hello-title")}`}</p>;
}

describe("I18nProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => "hello-title = Hello, world",
      }),
    );
  });

  it("loads the browser locale and formats Fluent messages", async () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "de-DE",
    });
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      value: ["de-DE"],
    });

    render(
      <I18nProvider>
        <Example />
      </I18nProvider>,
    );

    await waitFor(() => expect(screen.getByText("de-DE: Hello, world")).toBeInTheDocument());
    expect(document.documentElement.lang).toBe("de-DE");
  });
});
