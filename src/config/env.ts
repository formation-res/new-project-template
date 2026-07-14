const environments = ["development", "preview", "staging", "production", "test"] as const;
type AppEnvironment = (typeof environments)[number];

const rawEnvironment = import.meta.env.VITE_APP_ENV || import.meta.env.MODE;
if (!environments.includes(rawEnvironment as AppEnvironment)) {
  throw new Error(`Unsupported VITE_APP_ENV: ${rawEnvironment}`);
}

function optionalPublicUrl(name: string, value: string | undefined): string | undefined {
  if (!value) return undefined;
  const url = new URL(value);
  const localDevelopment = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(localDevelopment && url.protocol === "http:")) {
    throw new Error(`${name} must use HTTPS, except for localhost development`);
  }
  return url.toString().replace(/\/$/, "");
}

export const publicEnv = Object.freeze({
  environment: rawEnvironment as AppEnvironment,
  apiBaseUrl: optionalPublicUrl("VITE_API_BASE_URL", import.meta.env.VITE_API_BASE_URL),
});
