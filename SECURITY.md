# Security

Report suspected vulnerabilities privately to the repository maintainers. Do not open a public issue containing exploit details, credentials, personal data, or unredacted logs.

- Never commit secrets or expose them through `VITE_*` variables.
- Treat browser storage, URLs, API data, and messages as untrusted input.
- Avoid raw HTML insertion and dynamic code execution.
- Keep the lockfile and dependency alerts current.
- Apply security headers at the edge; `public/_headers` provides the static Pages baseline.
