# Cloudflare Pages deployment

The template contains an opt-in direct-upload workflow at `.github/workflows/deploy.yml`.

## Configure a generated project

1. Run `npm run setup` and provide the Cloudflare Pages project name.
2. Grant the repository access to the organization secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Confirm the Pages production branch is `main`.
4. Push a branch to create a preview, or merge to `main` for production.

The workflow builds the application, publishes `dist`, records the GitHub deployment, verifies the homepage and `/version.json`, and adds or updates one preview link on the pull request. Missing configuration causes a clear skip instead of failing a freshly generated repository.

`public/_headers` applies to static Pages responses. If the project later adds Pages Functions, those function responses must attach their own security headers.

Rollback through **Workers & Pages → project → Deployments → Rollback**. Do not rebuild old source when an atomic prior deployment can be restored.
