# Template versus shared infrastructure

Last updated: 2026-07-14T14:15:50.175Z

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

Dependabot keeps dependency changes reviewable. Template improvements should be promoted deliberately into active projects when they are still relevant; do not assume template inheritance.
