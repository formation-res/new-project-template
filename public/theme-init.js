(() => {
  try {
    const stored = window.localStorage.getItem("app-theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const theme =
      stored === "qr-dark" || stored === "qr-light" ? stored : prefersDark ? "qr-dark" : "qr-light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (_error) {
    document.documentElement.setAttribute("data-theme", "qr-light");
  }
})();
