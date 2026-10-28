# Blocks MCP request examples

These examples describe expected tool behavior for ordinary user wording. Read discovery before selecting exact identifiers. Verify the target site, follow pagination and read back saved changes.

| Request | Expected behavior |
| --- | --- |
| What can I manage with Blocks? | Call `list-features`; inspect the relevant field-discovery action for native choices, defaults and edition requirements. |
| Turn on Block Controls. | Read `get-plugin-settings`, then update only the Dashboard `block_controls` switch. This enables the feature rather than applying a visibility rule to existing content. |
| Disable Accordion blocks for Editors. | Discover exact block and role identifiers with `get-block-permissions`; preview and save `update-block-permissions`, preserving other blocks and roles. |
| Disable Accordion for Authors and Editors. | Use `bulk-update-block-permissions` with both roles. Preview first; an invalid role must save nothing. |
| Disable that block. | Clarify whether the user means global Extra Blocks availability, role Block Permissions, front-end visibility or a block in one post. |
| Stop Authors and Editors using Openverse. | Read role Editor Features and use `bulk-update-feature-settings` with only `disable_openverse: true`. Do not disable unrelated editor features. |
| Make new Accordion blocks have 12 pixels of bottom spacing. | Read `get-block-configuration`, identify the native field and range, then preview/save `update-block-configuration`. Existing blocks remain unchanged. |
| Change the Accordion already in my post. | Resolve the exact post through Hub lookup, read `get-post-blocks` and `get-block-type-fields`, then edit the exact path with the latest hash and valid serialized markup. Do not change new-block defaults. |
| Make a pink style and apply it to the first paragraph in my post. | Create a saved style using `save-custom-style`; read the target post and use `assign-block-style` with the returned style ID, exact paragraph path and latest hash. Do not assume the first block is a paragraph. |
| Remove the saved style from that block. | Read the current hash, then call `assign-block-style` with `remove: true`. Preserve unrelated classes and content. |
| Create a preset that hides a block for Administrators and assign it to the first block in post 123. | Discover native visibility fields, create the matching role exclusion preset, read post 123, then use `edit-post-block` with `set_visibility`, the preset ID and the current hash. Confirm the rule hides rather than exclusively shows the Administrator role. |
| Insert my promotion at the end of posts. | Find the actual reusable block, confirm it is published and unprotected, then discover and save the Auto Insert rule. New rules default to draft; publish only when requested. |
| Insert the promotion after the second paragraph on Pages. | Discover active-edition placement and targeting choices. Pro is required for these fields; do not invent a Free fallback. |
| Resolve this editorial note. | List notes for the editable post, identify the exact note ID, save its resolution and read back. On failure, inspect the returned error before retrying. |
| Export form submissions. | Use the separate paginated submission action only when exposed and authorized. Counts alone do not expose names, email addresses or messages. |

Settings previews use `dry_run: true`; post edits use optimistic content hashes instead. Unknown or ambiguous posts, roles, blocks and saved objects require discovery or clarification rather than guessed IDs. A client missing a tool should check Hub action selection and refresh its connection; a WordPress permission denial must be respected.

Integration tests verify schemas, permissions and native saved values. They do not guarantee that every AI model selects the same tool for every wording.
