# PublishPress Blocks AI actions

PublishPress Blocks provides WordPress Abilities API actions on WordPress 6.9 or newer. PublishPress Hub and the official WordPress MCP Adapter connect these actions to an AI service. Older supported WordPress versions continue to run Blocks without this integration. Pro uses the shared integration bundled with its Free dependency.

Enable AI connections in Hub, choose the permitted actions, and save before connecting the AI service. Write actions require Hub's write access switch and individual selection. Every action also checks the connected WordPress account's native capabilities. After changing selected actions, restart the AI service or refresh its PublishPress connection.

## Feature coverage

`list-features` returns the screen and editor-feature inventory, enabled state, required capabilities, edition information and related discovery/read/write actions. Field discovery actions provide native choices, defaults and exact identifiers.

All names below use the `publishpress-blocks/` prefix.

| Feature | Read and discovery | Changes |
| --- | --- | --- |
| Dashboard and Settings | `get-plugin-settings` | `update-plugin-settings` changes supported switches, icon color, Post Notes toolbar and gallery lightbox settings. |
| Extra Blocks defaults | `get-block-configuration` returns native field labels, types, choices and ranges. | `update-block-configuration` changes supplied defaults for one type. Existing post content is unchanged. |
| Role Block Permissions | `get-block-permissions` returns roles and known block identifiers. | `update-block-permissions` enables or disables specified blocks for one role; `bulk-update-block-permissions` applies the same changes to several roles. |
| Global visibility controls | `get-block-controls` | `update-block-controls` changes supported visibility rule switches. |
| Per-block visibility availability | `get-feature-settings` with `controls-blocks` | `update-feature-settings` changes availability for specified blocks. |
| Extra Blocks availability | `get-feature-settings` with `extra-blocks` | `update-feature-settings` enables or disables specified known PublishPress blocks. |
| Role editor restrictions | `get-feature-settings` with `editor-features` and a role | `update-feature-settings` changes Disable all block adding, Pattern Directory and Openverse restrictions; `bulk-update-feature-settings` applies the same Editor Features changes to several roles. |
| Legacy blocks | `get-feature-settings` with `legacy-blocks` | `update-feature-settings` changes supported legacy block switches. |
| Form email and reCAPTCHA | `get-feature-settings` with `form-email` or `recaptcha` | `update-feature-settings` changes non-secret fields while preserving keys. reCAPTCHA must have keys configured in WordPress before activation. |
| Content Display thumbnail | `get-feature-settings` with `content-display-thumbnail` | `update-feature-settings` changes the default thumbnail using a verified attachment ID or URL. |
| Saved Block Styles | `list-custom-styles`, `get-custom-style-fields` | `save-custom-style` creates or patches a style; `delete-custom-style` deletes a verified ID. Native CSS parsing and sanitization apply. `assign-block-style` applies or removes a saved style on one editable post block. |
| Visibility presets | `list-control-presets`, `get-control-preset-fields` | `save-control-preset` creates or patches a preset; `delete-control-preset` deletes a verified ID. |
| Auto Insert rules | `list-auto-insert-rules`, `get-auto-insert-fields` | `save-auto-insert-rule` creates or patches a rule; `delete-auto-insert-rule` trashes one. New rules default to draft. |
| Block Usage | `scan-block-usage` reads fresh, paginated counts including nested blocks, with object permissions. | Rescan by calling again; results contain IDs and counts, not stored post content. |
| Block catalogue and attributes | `list-block-types` lists PublishPress types; `get-block-type-fields` reads any known type's schema. | The normal editor catalogue capture refreshes client-only schemas. |
| Existing post blocks | `inspect-post-blocks` returns a compact inventory; `get-post-blocks` includes serialized content, nested paths and a hash. | `edit-post-block` replaces, removes or inserts one block, or applies native visibility controls. |
| Post editor preferences | `get-post-blocks` includes saved preferences. | `update-post-editor-settings` changes editor width and columns visual guide; an empty string inherits global settings. |
| Reusable blocks and synced patterns | `list-reusable-blocks`; read content through `get-post-blocks`. | `save-reusable-block` creates or patches a reusable block; `delete-reusable-block` trashes one. |
| Post Notes | `list-post-notes` reads notes for an editable post, or across editable posts with native moderation permissions. | `save-post-note` creates, replies, edits, resolves or reopens notes; `delete-post-note` trashes a verified note. Native WordPress note permissions and status behavior apply. |
| Saved form submissions | `get-form-submission-counts`, `list-form-submissions` | Read-only paginated export of submitted names, email addresses and messages, with native settings/export permissions. |

## Discovery and editing

Clients should read discovery before choosing identifiers or values. A request to disable a block may concern its global availability, one role's permissions, visibility on the front end or a single post. Clarify the scope when it is ambiguous.

Client-only block schemas come from the catalogue captured by the normal Blocks editor screens. Open Block Permissions to refresh that catalogue after adding or updating a block plugin. Server-registered types expose their live native schemas. Snapshot metadata can be older than the installed block version.

Configuration changes affect newly inserted blocks. To change existing content, first call `get-post-blocks`, then supply its exact `path` and `hash` as `expected_hash` to `edit-post-block`. A changed hash rejects the edit. Replace or insert exactly one complete serialized Gutenberg block, including the HTML required by a static block. Other blocks and post fields are preserved. Visibility changes use the native `advgbBlockControls` attribute. Reusable references are not expanded automatically.

Existing reusable content updates also require the latest hash. New reusable blocks and insertion rules default to draft. A reusable block must be published and have no post password before its insertion rule can be activated. Trash actions do not permanently delete objects when the site's Trash feature is disabled.

Preset rules within a control set use AND; multiple control sets use OR. Supplied `controlSets` replace that preset definition; omitted fields are preserved on update. Removing a preset or style does not rewrite existing post references or classes.

Post block editing is limited to 200 KB of stored content per post and paths up to 30 levels deep. Use the WordPress editor for larger documents. Serialized replacement must preserve valid Gutenberg markup; native save sanitization can remove HTML the connected account cannot save.

## Previews and bulk changes

`update-plugin-settings`, `update-block-permissions`, `update-block-controls`, `update-block-configuration` and `update-feature-settings` accept `dry_run: true`. A preview uses the same validation and permissions as saving and returns proposed effective values without persistence. Re-read before saving if another user may have changed the settings.

`bulk-update-block-permissions` takes `roles` and `blocks`; `bulk-update-feature-settings` takes `roles` and `settings` for role Editor Features. Both accept `dry_run`. Every target and field is validated before a single settings write, preserving other roles and unmentioned values. Bulk feature updates cover role Editor Features; other feature settings remain single-feature operations. Previews are supported for these settings actions, not object creation, deletion, notes or post content edits.

## Saved style assignment

Call `list-custom-styles` to identify a saved style and `get-post-blocks` for the exact block path and latest hash. `assign-block-style` accepts `post_id`, `path`, `expected_hash` and `style_id`; use `remove: true` to clear the current saved style. It updates native `customStyle` and `identifyColor` attributes and the saved wrapper class, retaining other classes and content. Unsupported custom-style blocks and invalid wrappers are rejected. Block Styles must be enabled, and the account must be allowed to edit the target post. Finding or editing style definitions retains the separate native administrative capabilities.

## Free and Pro

Free Auto Insert supports beginning/end placement, posts and category/tag targeting. Pro exposes additional paragraph, heading and block placement; position numbers; public post types and taxonomies; authors; months and years; specific post IDs; excluded posts and blocks; and specific block targeting. Free rejects Pro-only inputs. Discovery reflects the active edition. Pro's core-block feature switch is available only with Pro active.

Block Styles discovery includes native field-level Pro requirements. Native custom CSS parsing and generation apply to saved styles. Editing existing Pro blocks requires that those types are available in the active edition and known to the editor catalogue.

## Permissions and limits

Settings, Extra Blocks defaults and Block Styles require `manage_options` and `activate_plugins`. Role Block Permissions and Block Controls retain the native `administrator` capability check as well. Feature-specific enable switches are enforced. Dashboard settings remain accessible so an authorized account can enable a feature.

Saved presets require the native preset API's `manage_options`. Auto Insert requires `manage_options` plus native creation, editing, publishing or deletion capabilities, with checks on referenced reusable blocks and target objects. Post reads and edits require `edit_post` on that post; an Editor can work with accessible content without site settings access. Post Notes additionally requires `edit_posts` and the native note controller's permissions. Cross-post listing requires `edit_others_posts` and `moderate_comments`, then filters each returned note by `edit_post` on its target post. A user without cross-post permissions can still request notes for a specific editable post. Account capability restrictions apply even to Administrators.

Actions use private `publishpress` category registration and are excluded from the adapter's default public discovery and execution. API keys, passwords, license administration and other authentication secrets are outside the tools. Form submission reads require `manage_options`, `activate_plugins` and Extra Blocks enabled. Contact exports expose date, name, email and message; newsletter exports expose date, first name, last name and email; unknown stored fields are excluded. This is a separate selectable Hub action, so permission to read counts does not itself expose full submissions.

Paged lists accept `page` (default 1) and `per_page` (default 20, maximum 100), returning `page` and `total_pages`. Continue through all pages, including empty pages when object permissions filter out rows. Updates validate supplied changes before writing and preserve unrelated settings, roles and objects.

## Example requests

- "Turn on Block Controls in the Blocks dashboard."
- "Disable Accordion blocks for Editors on Block Permissions."
- "Prevent Authors from using Openverse, keeping their other editor settings."
- "Create a pink Block Style named Campaign."
- "Create a visibility preset for logged-in users on mobile."
- "Set the Accordion bottom spacing default to 12 for new blocks."
- "Find my reusable promotion block and insert it at the end of posts."
- "In Pro, insert that promotion after the second paragraph on Pages."
- "Replace the second paragraph in post 123, keeping everything else."
- "Apply the mobile visibility preset to that block."
- "Show the open notes on post 123 and resolve the selected note."

For request wording, scope clarification and expected tool sequences, see [MCP request examples](mcp-prompt-examples.md).
