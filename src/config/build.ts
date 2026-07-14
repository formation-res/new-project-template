export interface BuildInfo {
  version: string;
  commit: string;
  builtAt: string;
  environment: string;
}

export const buildInfo: BuildInfo = Object.freeze({
  version: __APP_VERSION__,
  commit: __BUILD_COMMIT__,
  builtAt: __BUILD_TIME__,
  environment: __BUILD_ENVIRONMENT__,
});
