# Skill: project-setup

## Purpose
- Install dependencies, reset node_modules when needed, and confirm the project is runnable.

## When to use
- You are asked to set up the project from a fresh clone.
- You need to resolve install issues or refresh dependencies safely.

## Inputs
- Optional: whether to do a clean install.
- Optional: whether to run a smoke test after install.

## Workflow
1) Confirm the package manager is npm (per repo scripts).
2) For standard setup:
   - Run `npm install`.
   - In a newly generated repository, run `npm run setup` and answer the project prompts.
3) For a clean reset (only when requested):
   - Remove `node_modules/` and `package-lock.json`.
   - Run `npm install` to regenerate the lockfile.
4) If asked to verify, run `npm run check`.
5) For a newly generated repository, follow `docs/START-A-PROJECT.md`, including translation and deployment automation setup.
6) Report commands used and any warnings or errors.

## Validation
- Ensure `package-lock.json` is updated if it was removed.
- Do not delete `package-lock.json` unless explicitly asked.

## Notes
- Keep output summaries short unless the user requests full logs.
