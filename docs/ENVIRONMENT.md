# Environment configuration

Copy `.env.example` to `.env.local` for local development. Only variables prefixed with `VITE_` reach the browser, which means every such value is public and inspectable.

## Public variables

- `VITE_APP_ENV` — `development`, `preview`, `staging`, `production`, or `test`.
- `VITE_API_BASE_URL` — optional HTTPS API origin. Plain HTTP is accepted only for localhost development.

When `VITE_API_BASE_URL` points to another origin, add that exact HTTPS origin to `connect-src` in `public/_headers`. Do not replace the allowlist with a wildcard.

Secrets belong in server-side functions or the deployment platform's secret store. Never place tokens, passwords, private keys, or server API credentials in `VITE_*`, `public/`, or committed configuration.
