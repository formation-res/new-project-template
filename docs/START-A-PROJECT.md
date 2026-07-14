# Start a FORMATION frontend project

Last updated: 2026-07-14T14:41:08.677Z

## 1. Create the repository

Use GitHub's **Use this template** button, or run:

```bash
gh repo create formation-res/<project-name> \
  --private \
  --template formation-res/new-project-template \
  --clone
```

## 2. Personalize the project

Run `npm install`, then `npm run setup`. The initializer configures the package slug, display name, description, production URL, Cloudflare Pages project, repository visibility, default locale, and enabled locales. It also removes unused language catalogs and updates the HTML and README title.

Then:

1. Replace the starter UI while keeping the reusable shell components you need.
2. Choose the DaisyUI themes in `src/index.css`.
3. Copy `.env.example` to `.env.local`. Never put secrets in `VITE_*` variables.
4. Keep `AGENTS.md`, tests, CI, CODEOWNERS, and dependency automation unless the project has an explicit alternative.

## 3. Configure translation automation

1. Add `OPENAI_API_KEY` as a GitHub Actions secret. Prefer an organization secret scoped to approved repositories.
2. Optionally set the `TRANSLATION_MODEL` repository variable; the default is `gpt-5.6-luna`.
3. Allow GitHub Actions to create pull requests for the repository.
4. Put all source copy in `public/lang/en-US.ftl` and render it through `useI18n()`.
5. Changes to the English catalog trigger `.github/workflows/translations.yml`, which opens a reviewable translation PR.

Machine-generated translations must be reviewed by a person before merge. The browser never receives the API key.

## 4. Configure deployment

1. Create or identify the Cloudflare Pages project supplied to `npm run setup`.
2. Grant the repository access to `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` organization secrets.
3. Read `docs/DEPLOYMENT.md` and verify the first preview before merging.

## 5. Verify the baseline

```bash
nvm use
npm install
npm run setup
npm run check
npx playwright install chromium
npm run test:e2e
npm run dev
```

Commit `package-lock.json` whenever dependencies change.
