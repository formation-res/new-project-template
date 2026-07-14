# New Project Template

**Template last updated:** `2026-07-14T14:17:02.000Z`

The organization-owned default for new FORMATION front-end projects. It provides a maintained, application-neutral baseline without carrying over the source repository's history.

## Included

- Vite 8, React 19, TypeScript, React SWC, and Node.js 22.
- Tailwind CSS 4 with minimal DaisyUI black-and-white light/dark themes.
- Biome formatting and linting.
- Vitest and Testing Library.
- CI through the single `npm run check` contract.
- Dependabot for npm and GitHub Actions updates.
- Fluent internationalization with browser locale detection, English fallback, and right-to-left support.
- English plus German, French, Spanish, Italian, Dutch, Polish, Portuguese, Ukrainian, Japanese, Simplified Chinese, Korean, Arabic, and Hindi catalogs.
- OpenAI-backed translation synchronization that opens reviewable pull requests when English source text changes.
- Automatic last-updated timestamps after every change merged to `main`.
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
npm run check
npm run dev
```

The development server runs at `http://localhost:5173`.

## Commands

- `npm run dev` — start Vite with hot reload.
- `npm run build` — type-check and create `dist/`.
- `npm run preview` — preview the production build.
- `npm run lint` / `npm run lint:fix` — check or apply Biome formatting and linting.
- `npm run typecheck` — run TypeScript without emitting files.
- `npm run test` / `npm run test:watch` — run tests once or in watch mode.
- `npm run translations:check` — validate Fluent syntax and key parity.
- `npm run translations:sync` — update stale catalogs using the server-side `OPENAI_API_KEY`.
- `npm run timestamp:update` — synchronize every displayed template timestamp.
- `npm run timestamp:check` — verify that every displayed template timestamp matches.
- `npm run check` — run the complete verification suite.

## Last-updated timestamp

After every non-automated push to `main`, `.github/workflows/timestamp.yml` records the latest main commit time in the README, maintenance documents, project-start guide, infrastructure guide, and starter UI. The workflow commits the synchronized timestamp once and ignores its own bot commit to prevent loops.

## Translation workflow

All user-facing starter copy lives in `public/lang/en-US.ftl`. The runtime loads the best browser language, remembers an explicit choice, and falls back to English for missing messages.

When English changes on `main`, `.github/workflows/translations.yml` identifies stale catalogs using a SHA-256 source hash, translates them with the OpenAI Responses API, validates Fluent syntax and exact key parity, and opens a pull request. Configure `OPENAI_API_KEY` as an Actions secret; it is never exposed through Vite or shipped to the browser. Human review remains required before generated language changes merge.

## Repository structure

- `src/i18n/` — runtime locale selection, loading, formatting, and fallback.
- `public/lang/` — source and generated Fluent catalogs.
- `scripts/` — translation validation and synchronization.
- `docs/START-A-PROJECT.md` — the standard creation procedure.
- `docs/SHARED-INFRASTRUCTURE.md` — what belongs in this snapshot versus shared packages and workflows.
- `MAINTAINERS.md` and `.github/CODEOWNERS` — ownership and review routing.
- `skills/` — small agent workflows for setup, validation, and dependency updates.

## Maintenance

The primary technical owner is Jilles van Gurp. `@formation-res/dev-team` provides team ownership and backup maintenance. Review the template quarterly and whenever a generated project reveals a generally reusable improvement.

Never put secrets or application-specific business logic in this repository. Template-created repositories are independent snapshots; use versioned packages and reusable workflows for changes that must continue flowing to existing projects.
