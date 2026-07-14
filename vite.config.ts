import { execFileSync } from "node:child_process";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import packageJson from "./package.json";

interface BuildMetadata {
  version: string;
  commit: string;
  builtAt: string;
  environment: string;
}

function currentCommit(): string {
  if (process.env.BUILD_COMMIT) return process.env.BUILD_COMMIT;
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  if (process.env.CF_PAGES_COMMIT_SHA) return process.env.CF_PAGES_COMMIT_SHA;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function buildMetadataPlugin(metadata: BuildMetadata): Plugin {
  const source = `${JSON.stringify(metadata, null, 2)}\n`;
  return {
    name: "build-metadata",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split("?", 1)[0] !== "/version.json") return next();
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(source);
      });
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "version.json", source });
    },
  };
}

export default defineConfig(({ mode }) => {
  const metadata: BuildMetadata = {
    version: packageJson.version,
    commit: currentCommit(),
    builtAt: process.env.BUILD_TIME ?? new Date().toISOString(),
    environment: process.env.VITE_APP_ENV ?? mode,
  };

  return {
    define: {
      __APP_VERSION__: JSON.stringify(metadata.version),
      __BUILD_COMMIT__: JSON.stringify(metadata.commit),
      __BUILD_TIME__: JSON.stringify(metadata.builtAt),
      __BUILD_ENVIRONMENT__: JSON.stringify(metadata.environment),
    },
    plugins: [react(), tailwindcss(), buildMetadataPlugin(metadata)],
    build: {
      target: "esnext",
      modulePreload: {
        polyfill: false,
      },
      sourcemap: false,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
    },
  };
});
