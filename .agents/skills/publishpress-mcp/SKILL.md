---
name: publishpress-mcp
description: Implement or extend PublishPress Blocks actions through the WordPress Abilities API. Use for Blocks action discovery, schemas, permissions, native feature operations, Free/Pro coverage, and integration tests.
---

# PublishPress Blocks MCP integration

Hub provides an optional connection through the separately installed WordPress MCP Adapter; it does not bundle the adapter or implement MCP transport. Users connect through a compatible external MCP client. The integration does not require a particular AI provider or integrate with WordPress.com's hosted MCP service.

## Connection contract

PublishPress Hub discovers actions in category `publishpress` and provides an optional connection through the separately installed official WordPress MCP Adapter. Keep Blocks business logic, tests and feature coverage in this repository. Adding a Blocks action must not require a Hub plugin inventory or route change.

- Register independently of Hub on `wp_abilities_api_init`, outside admin-only bootstrap paths. Guard missing API functions so older supported WordPress versions continue working.
- Register the shared category on `wp_abilities_api_categories_init` only when `wp_has_ability_category('publishpress')` is false. Do not use `wp_get_ability_category` to probe for absence: it emits a developer notice.
- Use `publishpress-blocks/{action-name}` and explicit input/output schemas. Set `meta.public`, `meta.mcp.public` and `meta.show_in_rest` to false. Hub registers private actions explicitly; the adapter's default public server must not discover or execute them.
- Register actions independently of the current user's permissions; authentication may happen later. Check native capabilities and object permissions during execution. Hub action selection and its write switch control exposure, not authorization.
- Keep readonly, destructive and idempotent annotations accurate. Preserve the authenticated identity and application-password capability restrictions; an Administrator role never bypasses a denied capability.

## Implementation map

Paths below are relative to the repository root.

- `init.php` loads `incl/abilities.php`; `Abilities` owns category/hooks and initial read actions. Extend class-based operations under `incl/mcp/`, without introducing Hub's container architecture. Preserve PHP 7.2.5 syntax compatibility: no arrow functions or typed properties.
- `workflows.php` owns the unified feature inventory and prevalidated role batches. Settings previews use the same validation as saves and never persist. `tests/abilities-workflow-cases.php` checks these workflows through the smoke suite.
- `registry.php` provides shared action/schema registration. `operations.php` covers Dashboard switches, native default configuration, role permissions and global controls. `features.php` covers typed admin/editor feature settings. Keep options whitelisted; do not introduce generic option, SQL or PHP execution tools.
- `presets.php` reuses `PublishPress\Blocks\RestAPI\Presets` in `incl/rest-api/presets.php`. Preserve native page identifiers, cookie `name`, nested archive taxonomy/term data and schedule defaults. Verify rules with native evaluators, not only stored option values.
- `styles.php` reuses `AdvancedGutenbergBlockStyles` parsing, sanitization and CSS generation. Preserve class names, generated CSS and unrelated styles. Deleting or renaming a style does not automatically rewrite post classes. Assignment uses native `customStyle` / `identifyColor` attributes and the save-content wrapper class, not a substitute `className` attribute.
- `auto-insert.php` uses native post capabilities and `_advgb_*` metadata. Verify reusable-block references and targeting objects before writing. New rules default to draft; active insertion needs a published, unprotected reusable block. Pro adds placement and targeting fields only when `ADVANCED_GUTENBERG_PRO_LOADED` is defined. Verify compatibility with the actual Pro placement service.
- `content.php` uses native WordPress post and note controllers. Post block edits require an exact nested path and the latest content hash. Preserve parent `innerContent` placeholders when inserting/removing nested blocks; retain unrelated markup, attributes and post fields. Post preferences use the native registered meta fields.
- Client-only block schemas come from the editor catalogue captured by `assets/js/main.js` and `AdvancedGutenbergMain::updateBlocksList`. Keep the production `assets/js/main.min.js` synchronized. Do not assume the PHP block registry contains every editor or Pro block.

## Permissions and data boundaries

Match the native screen, save service and object checks for each operation. Keep feature-enable and edition gates, editable-post checks, publishing/deletion capabilities and native metadata validation. Validate all supplied changes before writing, preserve omitted fields and reject unknown identifiers.

- Saved form payloads require native settings/export capabilities (`manage_options` and `activate_plugins`) and Extra Blocks enabled. Full submissions are a separate selectable read action from counts. Export only native form fields, use bounded pagination, and never return API keys, passwords or unknown stored fields.
- Cross-post notes require `edit_posts`, `edit_others_posts`, `moderate_comments` and Post Notes enabled; filter each result by its target post's `edit_post` permission. Specific-post reads/writes retain their native controller checks, so Authors can work on their own editable posts without global moderation permission. Exclude author emails and IP addresses.
- Keep credentials and license administration outside the tools. Retain native CSS sanitizers and reCAPTCHA configuration checks. Do not mint admin nonces, simulate admin forms or switch accounts to perform operations.
- Free/Pro share the integration through packaging. Update the shared dependency through the release process; do not edit vendored copies or register duplicate abilities.

## Shared implementation standard

- Follow the plugin's native class structure, bootstrap, minimum PHP version and Free/Pro packaging. Keep Hub responsible for connection and exposure; keep plugin operations and tests in the plugin repository.
- Audit every Free/Pro admin screen and relevant editor feature. Maintain a coverage map with discovery, reads, supported writes, permission checks, edition gates and intentional exclusions. Do not declare completeness from an action count alone.
- Expose native screen labels, exact identifiers, field types, choices, defaults and edition requirements through registered action descriptions, schemas and discovery results. Include common user wording and distinguish similarly named settings and scopes.
- Pair native reads with typed create/update/delete operations where supported. Preserve omitted fields and unrelated objects. Reject unknown identifiers, validate all targets before bulk writes, and use optimistic concurrency for existing content edits.
- Reuse native services, sanitizers and object-specific capability checks. Enforce feature and edition gates at execution; an Administrator role or Hub exposure setting never bypasses a denied capability. Keep secrets outside tool inputs and outputs.
- For multi-step writes, test failure between steps and avoid reporting an unchanged failure after partially saving. Provide write previews and bulk operations where the native workflow needs them; document unsupported previews and multi-object operations explicitly.
- Verify translated action metadata and domain errors, native round trips, malformed inputs, stale content, unrelated-data preservation and capability-restricted Administrators. Cover Free/Pro boundaries and distinguish shared-contract fixtures from full Pro distribution tests.
- Verify missing-API compatibility, duplicate registration, private discovery and execution with a released adapter. Keep shared transport tests in Hub and domain tests in each plugin.
- Maintain request examples mapped to expected discovery, ambiguity handling, writes and read-back verification. Documentation describes current behavior and limitations, without development history or unreleased change logs.

Keep `docs/mcp-integration.md` aligned with the coverage map and intentional exclusions. Distinguish global availability, role permissions, new-block defaults and existing-post edits.

## Verification

- `tests/abilities-registration.php` checks registration and private metadata; `tests/abilities-compatibility.php` checks missing-API behavior.
- Run `tests/abilities-smoke.php` with an isolated WordPress `wp-load.php` path and optionally a released MCP Adapter directory. It requires the `mcp_smoke_` database prefix and restores fixture options/users/posts. `tests/abilities-feature-cases.php` is included by this suite; do not run it separately.
- `BLOCKS_MCP_TEST_PRO=1` checks Pro-gated shared contracts. The actual Pro placement helper is exercised when the fixture provides it; this is not proof of a full Pro distribution bootstrap.
- Cover native read/write round trips, nested content preservation, stale hashes, malformed input, Free/Pro gates, disabled features, per-object denial and capability-restricted Administrators. Test synthetic form payloads and notes only in isolated fixtures. Never commit application passwords or real submitted data.
- Verify released-adapter schema projection, custom-server execution, default-server discovery/execution denial and capability enforcement. Shared transport/protocol tests belong in Hub.
- Run project PHP coding standards on changed code and the relevant JavaScript regression tests when changing editor capture or production assets.

Skills here guide developers and their coding agents. They are separate from optional end-user instructions for AI clients consuming tools.
