# Start a FORMATION frontend project

Last updated: 2026-07-14T13:45:51Z

## 1. Create the repository

Use GitHub's **Use this template** button, or run:

```bash
gh repo create formation-res/<project-name> \
  --private \
  --template formation-res/vite-ts-template \
  --clone
```

## 2. Personalize the project

1. Update `name`, `description`, and ownership details in `package.json` and `README.md`.
2. Replace the starter UI and update `src/templateMetadata.ts` or remove the template timestamp.
3. Choose the DaisyUI themes in `src/index.css`.
4. Copy `.env.example` to `.env.local` and add only local values. Never put secrets in `VITE_*` variables.
5. Keep `AGENTS.md`, tests, CI, CODEOWNERS, and dependency automation unless the project has an explicit alternative.

## 3. Configure translation automation

1. Add `OPENAI_API_KEY` as a GitHub Actions secret. Prefer an organization secret scoped to approved repositories.
2. Optionally set the `TRANSLATION_MODEL` repository variable; the default is `gpt-5.6-luna`.
3. Allow GitHub Actions to create pull requests for the repository.
4. Put all source copy in `public/lang/en-US.ftl` and render it through `useI18n()`.
5. Changes to the English catalog trigger `.github/workflows/translations.yml`, which opens a reviewable translation PR.

Machine-generated translations must be reviewed by a person before merge. The browser never receives the API key.

## 4. Verify the baseline

```bash
nvm use
npm install
npm run check
npm run dev
```

Commit `package-lock.json` whenever dependencies change.
