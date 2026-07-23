# New Project Template

**Template last updated:** `2026-07-23T09:57:49.000Z`

The organization-owned default for new FORMATION front-end projects. It provides a maintained, application-neutral baseline without carrying over the source repository's history.

## Included

- Vite 8, React 19, TypeScript, React SWC, and Node.js 24.
- Tailwind CSS 4 with minimal DaisyUI black-and-white light/dark themes.
- Biome formatting and linting.
- Vitest and Testing Library.
- Playwright browser checks for desktop, mobile, themes, RTL, overflow, and accessibility.
- CI through `npm run check`, with full browser coverage through `npm run check:all`.
- Dependabot for npm and GitHub Actions updates.
- Fluent internationalization with browser locale detection, English fallback, and right-to-left support.
- English plus German, French, Spanish, Italian, Dutch, Polish, Portuguese, Ukrainian, Japanese, Simplified Chinese, Korean, Arabic, and Hindi catalogs.
- OpenAI-backed translation synchronization that opens reviewable pull requests when English source text changes.
- Automatic last-updated timestamps after every change merged to `main`.
- An interactive project initializer with configuration-remnant checks.
- Opt-in Cloudflare Pages preview and production deployments with live smoke verification.
- Typed public environment configuration, secure response headers, and `/version.json` build identity.
- Reusable error and status-state components.
- Shared-media policy, tracked-asset checks, and lightweight governance templates.
- CODEOWNERS and documented maintenance ownership.

## Start a project

Follow [docs/START-A-PROJECT.md](docs/START-A-PROJECT.md). The short version is:

```bash
gh repo create formation-res/<project-name> \
  --private \
  --template formation-res/new-project-template \
  --clone

cd <project-name>
nvm use
npm install
npm run setup
npm run check
npm run dev
```

The development server runs at `http://localhost:5173`.

## Commands

- `npm run dev` — start Vite with hot reload.
- `npm run build` — type-check and create `dist/`.
- `npm run preview` — preview the production build.
- `npm run setup` — configure a generated repository interactively.
- `npm run setup:check` — validate project configuration and unresolved template names.
- `npm run lint` / `npm run lint:fix` — check or apply Biome formatting and linting.
- `npm run typecheck` — run TypeScript without emitting files.
- `npm run test` / `npm run test:watch` — run tests once or in watch mode.
- `npm run test:e2e` — run Playwright browser and accessibility checks.
- `npm run translations:check` — validate Fluent syntax and key parity.
- `npm run translations:sync` — update stale catalogs using the server-side `OPENAI_API_KEY`.
- `npm run timestamp:update` — synchronize every displayed template timestamp.
- `npm run timestamp:check` — verify that every displayed template timestamp matches.
- `npm run assets:check` — reject managed media and tracked files larger than 5 MiB.
- `npm run check` — run the fast complete verification suite.
- `npm run check:all` — run `check` plus real-browser verification.

## Last-updated timestamp

After every non-automated push to `main`, `.github/workflows/timestamp.yml` records the latest main commit time in the README, maintenance documents, project-start guide, infrastructure guide, and starter UI. The workflow commits the synchronized timestamp once and ignores its own bot commit to prevent loops.

## Translation workflow

All user-facing starter copy lives in `public/lang/en-US.ftl`. The runtime loads the best browser language, remembers an explicit choice, and falls back to English for missing messages.

When English changes on `main`, `.github/workflows/translations.yml` identifies stale catalogs using a SHA-256 source hash, translates them with the OpenAI Responses API, validates Fluent syntax and exact key parity, and opens a pull request. Configure `OPENAI_API_KEY` as an Actions secret; it is never exposed through Vite or shipped to the browser. Human review remains required before generated language changes merge.

## Deployment and live identity

Generated projects can opt into `.github/workflows/deploy.yml` by running `npm run setup` with a Cloudflare Pages project and granting access to `CLOUDFLARE_API_TOKEN` plus `CLOUDFLARE_ACCOUNT_ID`. Pull requests receive previews; `main` receives production deployments. Every deployment is verified against its generated `/version.json` commit identity. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Secure configuration and assets

Copy `.env.example` to `.env.local`. Every `VITE_*` value is public; secrets belong server-side. Cloudflare static responses use `public/_headers`, including CSP and clickjacking protection. Managed website media belongs in the shared FORMATION asset bucket; see [MEDIA.md](MEDIA.md).

## Repository structure

- `src/i18n/` — runtime locale selection, loading, formatting, and fallback.
- `src/config/` and `project.config.json` — typed project, environment, locale, and build identity.
- `src/components/` — accessible error and status primitives.
- `public/lang/` — source and generated Fluent catalogs.
- `tests/e2e/` — browser, responsive, RTL, and accessibility checks.
- `scripts/` — project setup, validation, deployment smoke tests, and automation.
- `docs/START-A-PROJECT.md` — the standard creation procedure.
- `docs/SHARED-INFRASTRUCTURE.md` — what belongs in this snapshot versus shared packages and workflows.
- `docs/decisions/` — small durable architecture-decision records.
- `MAINTAINERS.md` and `.github/CODEOWNERS` — ownership and review routing.
- `skills/` — small agent workflows for setup, validation, and dependency updates.

## Maintenance

The primary technical owner is Jilles van Gurp. `@formation-res/dev-team` provides team ownership and backup maintenance. Review the template quarterly and whenever a generated project reveals a generally reusable improvement.

Never put secrets or application-specific business logic in this repository. Template-created repositories are independent snapshots; use versioned packages and reusable workflows for changes that must continue flowing to existing projects.
