# Template versus shared infrastructure

Last updated: 2026-07-14T14:41:08.677Z

This repository is the snapshot used to create a project. Existing projects do not automatically receive later template changes.

Keep these concerns in the template:

- directory layout and starter UI;
- TypeScript, Vite, Tailwind, DaisyUI, Biome, Vitest, and i18n setup;
- repository instructions, CI entrypoints, and secure defaults;
- examples that are safe to delete after project creation.

Move evolving shared behavior elsewhere:

- reusable application code into versioned npm packages;
- shared design tokens and components into a versioned design-system package;
- organization-wide CI into reusable GitHub Actions workflows;
- deployment policy into maintained platform tooling;
- organization secrets into GitHub organization secrets with narrow repository access.

The Cloudflare deployment file in this template is intentionally a thin project-level caller. If deployment policy, account routing, or rollback behavior must change across existing projects, move that logic into a versioned reusable organization workflow and leave only project inputs here.

Dependabot keeps dependency changes reviewable. Template improvements should be promoted deliberately into active projects when they are still relevant; do not assume template inheritance.
