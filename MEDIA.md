# Media and asset policy

Managed website images, audio, and video live in the shared FORMATION asset bucket, not in this repository.

- Publish media through the shared `formation-assets` UI or CLI.
- Use the public host belonging to the product: `assets.tryformation.com`, `assets.formationxyz.com`, or `assets.openlocationstack.com`.
- Use stable descriptive object keys and complete the asset description, tags, and owning website metadata.
- Keep editable source media outside the repository.
- Small build-time icons and legally required local files are acceptable when documented.

`npm run assets:check` rejects tracked managed-media formats and files larger than 5 MiB.
