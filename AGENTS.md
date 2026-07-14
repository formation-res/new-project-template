# Repository Guidelines

## Build and verification

- Install dependencies with `npm install`.
- Run the complete verification suite with `npm run check`.
- Build the production application with `npm run build`.
- Runtime and development dependencies use npm; commit `package-lock.json` whenever they change.

## Application structure

- `src/main.tsx` mounts the React application and internationalization provider.
- `src/App.tsx` is application-neutral starter UI and may be replaced by the first project feature.
- Put domain logic in focused modules and co-locate deterministic `*.test.ts` or `*.test.tsx` tests.
- `src/i18n/` owns runtime locale behavior; `public/lang/en-US.ftl` is the source catalog.

## Styling

- Use Tailwind CSS 4 with DaisyUI components.
- Prefer DaisyUI primitives and minimal Tailwind utilities over custom CSS.
- Preserve both black-and-white light and dark themes unless the project explicitly replaces them.

## Internationalization

- Do not hard-code new user-visible text in components. Add it to `public/lang/en-US.ftl` and call `useI18n().t()`.
- Run `npm run translations:check` after catalog changes.
- `npm run translations:sync` requires a server-side `OPENAI_API_KEY`; never expose that key through a `VITE_*` variable.
- Machine-generated catalogs require human review before merge.

## Security

- Never commit credentials or place secrets in browser-delivered code, `public/`, or `VITE_*` variables.
- Prefer safe React rendering. Do not add `dangerouslySetInnerHTML`, dynamic code execution, or unvalidated navigation.
- Keep CI on `npm ci` and keep the dependency lockfile current.

## Commits and pull requests

- Use short imperative commit subjects.
- Include a concise change summary and `npm run check` evidence in pull requests.
- Include screenshots when visual behavior changes.
- `@formation-res/dev-team` owns review of this template and its generated defaults.

## Reusable workflows

- Read `skills/<skill-name>/SKILL.md` when a matching workflow exists.
- Use `skills/_template/SKILL.md` as the starting point for new repository-local skills.
- Follow `docs/SHARED-INFRASTRUCTURE.md` before adding code that should instead live in a versioned package or reusable organization workflow.
