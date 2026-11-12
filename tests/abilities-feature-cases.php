<?php
/** Native round trips and preservation checks, included by abilities-smoke.php. */
$success = static function ($result, $message) use ($check) {
    $check(!is_wp_error($result), $message . (is_wp_error($result) ? ': ' . $result->get_error_message() : ''));
    return $result;
};
$preset = $success($call('save-control-preset', ['title' => 'Fixture visibility', 'controlSets' => [['rules' => [
    ['type' => 'page', 'pages' => ['home'], 'approach' => 'include'],
    ['type' => 'device_width', 'min_width' => 400, 'max_width' => 1000],
]]]]), 'Create native visibility preset');
$presetId = $preset['id'];
$stored = get_option('advgb_block_control_presets')[$presetId];
$check($stored['controlSets'][0]['rules'][0]['pages'] === ['home'], 'Native page preset fields survive saving');
$success($call('save-control-preset', ['id' => $presetId, 'title' => 'Renamed fixture']), 'Rename preset without replacing rules');
$check(get_option('advgb_block_control_presets')[$presetId]['controlSets'] === $stored['controlSets'], 'Omitted preset rules preserved');
$cookiePreset = $success($call('save-control-preset', ['title' => 'Cookie fixture', 'controlSets' => [['rules' => [['type' => 'cookie', 'name' => 'blocks_mcp_fixture_cookie', 'condition' => '=', 'value' => 'test']]]]]), 'Create cookie visibility preset');
$cookieRule = get_option('advgb_block_control_presets')[$cookiePreset['id']]['controlSets'][0]['rules'][0];
$_COOKIE['blocks_mcp_fixture_cookie'] = 'test';
$check(\PublishPress\Blocks\Controls::checkCookie([], $cookieRule), 'Native cookie evaluator consumes saved preset');
unset($_COOKIE['blocks_mcp_fixture_cookie']);
$success($call('delete-control-preset', ['id' => $cookiePreset['id']]), 'Delete cookie fixture');
$fields = $success($call('get-block-type-fields', ['name' => 'core/paragraph']), 'Discover native block attribute schema');
$check(isset($fields['attributes']->content), 'Block discovery includes real attribute definitions');
$before = get_option('advgb_block_control_presets');
$check(is_wp_error($call('save-control-preset', ['id' => $presetId, 'controlSets' => [['rules' => [['type' => 'missing']]]]])), 'Unknown preset rule rejected');
$check($before === get_option('advgb_block_control_presets'), 'Invalid preset writes nothing');
$style = $success($call('save-custom-style', ['title' => 'Fixture style', 'name' => 'mcp-fixture-style', 'css' => 'color: pink; padding-top: 12px;']), 'Create native block style');
$styleId = $style['style']->id;
$check(strpos($style['style']->generated_css, 'pink') !== false, 'Style CSS uses native generation');
$success($call('save-custom-style', ['id' => $styleId, 'title' => 'Renamed style']), 'Update style title without replacing CSS');
$check(is_wp_error($call('save-custom-style', ['name' => 'mcp-fixture-style', 'title' => 'duplicate'])), 'Duplicate style class rejected');
$check(is_wp_error($call('save-custom-style', ['id' => 99999999, 'title' => 'missing'])), 'Unknown style ID rejected');
$success($call('update-feature-settings', ['feature' => 'editor-features', 'role' => 'editor', 'settings' => ['disable_openverse' => true]]), 'Update role editor feature');
$success($call('update-feature-settings', ['feature' => 'editor-features', 'role' => 'editor', 'settings' => ['disable_pattern_directory' => true]]), 'Update second role field');
$check(get_option('advgb_settings')['block_features_settings']['editor']['disable_openverse'], 'Role feature patch preserves other fields');
$check(is_wp_error($call('update-feature-settings', ['feature' => 'editor-features', 'role' => 'missing', 'settings' => ['disable_openverse' => false]])), 'Role editor rejects unknown role');
$success($call('update-feature-settings', ['feature' => 'extra-blocks', 'settings' => ['advgb/fixture' => false]]), 'Change Extra Blocks global state');
$success($call('update-feature-settings', ['feature' => 'controls-blocks', 'settings' => ['core/paragraph' => false]]), 'Change per-block visibility availability');
$check(in_array('core/paragraph', get_option('advgb_block_controls')['inactive_blocks'], true), 'Native per-block controls format retained');
$success($call('update-feature-settings', ['feature' => 'legacy-blocks', 'settings' => ['map' => true]]), 'Enable a supported legacy block');
$check(AdvancedGutenbergMain::getLegacyBlocksState()['map'], 'Native legacy state reads updated setting');
$check(is_wp_error($call('update-feature-settings', ['feature' => 'legacy-blocks', 'settings' => ['missing' => true]])), 'Unknown legacy fields rejected');
$success($call('update-feature-settings', ['feature' => 'recaptcha', 'settings' => ['recaptcha_theme' => 'dark']]), 'Update non-secret reCAPTCHA preference');
$check(is_wp_error($call('update-feature-settings', ['feature' => 'recaptcha', 'settings' => ['recaptcha_enable' => true]])), 'Cannot enable reCAPTCHA without configured keys');
$success($call('update-plugin-settings', ['settings' => ['gallery_lightbox' => false, 'gallery_lightbox_caption' => 2, 'enable_post_notes' => true]]), 'Update gallery and Post Notes settings');
$hash = hash('sha256', get_post_field('post_content', $postId));
$beforeContent = get_post_field('post_content', $postId);
$read = $success($call('get-post-blocks', ['post_id' => $postId]), 'Read serialized nested post blocks');
$check($read['hash'] === $hash && $read['blocks'][1]['path'] === [0, 0], 'Read includes exact nested path and concurrency hash');
$changed = $success($call('edit-post-block', ['post_id' => $postId, 'expected_hash' => $hash, 'path' => [0, 0], 'operation' => 'replace',
    'block_content' => '<!-- wp:paragraph --><p>Updated fixture</p><!-- /wp:paragraph -->']), 'Replace nested post block');
$check(strpos(get_post_field('post_content', $postId), '<div>') !== false && strpos(get_post_field('post_content', $postId), 'Updated fixture') !== false, 'Nested edit preserves parent markup');
$check(is_wp_error($call('edit-post-block', ['post_id' => $postId, 'expected_hash' => $hash, 'path' => [0], 'operation' => 'remove'])), 'Stale content hash rejected');
$changed = $success($call('edit-post-block', ['post_id' => $postId, 'expected_hash' => $changed['hash'], 'path' => [0, 0], 'operation' => 'insert_after',
    'block_content' => '<!-- wp:paragraph --><p>Inserted fixture</p><!-- /wp:paragraph -->']), 'Insert nested post block');
$check(count(parse_blocks(get_post_field('post_content', $postId))[0]['innerBlocks']) === 2, 'Nested insertion updates child placeholders');
$changed = $success($call('edit-post-block', ['post_id' => $postId, 'expected_hash' => $changed['hash'], 'path' => [0, 1], 'operation' => 'remove']), 'Remove nested post block');
$check(strpos(get_post_field('post_content', $postId), 'Inserted fixture') === false, 'Removal preserves remaining child content');
$changed = $success($call('edit-post-block', ['post_id' => $postId, 'expected_hash' => $changed['hash'], 'path' => [0, 0], 'operation' => 'set_visibility',
    'visibility' => [['control' => 'presets', 'enabled' => true, 'selected' => [$presetId], 'logic' => 'all']]]), 'Apply saved visibility preset to a post block');
$check(parse_blocks(get_post_field('post_content', $postId))[0]['innerBlocks'][0]['attrs']['advgbBlockControls'][0]['selected'] === [$presetId], 'Visibility uses native block attribute');
$check(is_wp_error($call('edit-post-block', ['post_id' => $postId, 'expected_hash' => $changed['hash'], 'path' => [99], 'operation' => 'remove'])), 'Invalid block path rejected');
$success($call('update-post-editor-settings', ['post_id' => $postId, 'editor_width' => 'full']), 'Save per-post editor width through native meta controller');
$check(get_post_meta($postId, 'advgb_blocks_editor_width', true) === 'full', 'Native post editor preference round trip');
$usage = $success($call('scan-block-usage', ['post_type' => 'post', 'name' => 'core/paragraph', 'per_page' => 100]), 'Scan fresh nested Block Usage');
$check(in_array($postId, array_column($usage['posts'], 'post_id'), true), 'Block Usage finds the edited nested paragraph');
$check(strpos(wp_json_encode($usage), 'Updated fixture') === false, 'Block Usage does not expose stored content');
$reusable = $success($call('save-reusable-block', ['title' => 'Fixture reusable', 'content' => '<!-- wp:paragraph --><p>Reusable fixture</p><!-- /wp:paragraph -->']), 'Create reusable block');
$reusableId = $reusable['id'];
$posts[] = $reusableId;
$check(get_post_type($reusableId) === 'wp_block' && get_post_status($reusableId) === 'draft', 'Reusable defaults to native draft');
$success($call('save-reusable-block', ['id' => $reusableId, 'title' => 'Renamed reusable']), 'Rename reusable without replacing content');
$check(is_wp_error($call('save-reusable-block', ['id' => $reusableId, 'content' => 'overwrite'])), 'Existing reusable content requires concurrency hash');
$listed = $success($call('list-reusable-blocks'), 'List editable reusable blocks');
$check(in_array($reusableId, array_column($listed['blocks'], 'id'), true), 'Reusable catalogue finds new block');
$rule = $success($call('save-auto-insert-rule', ['title' => 'Fixture insertion', 'block_id' => $reusableId]), 'Create Auto Insert rule');
$ruleId = $rule['id'];
$posts[] = $ruleId;
$check(get_post_status($ruleId) === 'draft' && get_post_meta($ruleId, '_advgb_post_types', true) === ['post'], 'Auto Insert starts as draft with native defaults');
$check(is_wp_error($call('save-auto-insert-rule', ['id' => $ruleId, 'status' => 'publish'])), 'Draft reusable block cannot silently activate an empty insertion');
$success($call('save-reusable-block', ['id' => $reusableId, 'status' => 'publish']), 'Publish reusable block for active insertion');
$success($call('save-auto-insert-rule', ['id' => $ruleId, 'position' => 'end', 'status' => 'publish']), 'Activate insertion with explicit publication');
$check(get_post_meta($ruleId, '_advgb_block_id', true) == $reusableId, 'Rule patch preserves selected reusable block');
$check(is_wp_error($call('save-auto-insert-rule', ['id' => $postId, 'title' => 'wrong type'])), 'Rule cannot overwrite ordinary posts');
$check(is_wp_error($call('save-auto-insert-rule', ['id' => $ruleId, 'block_id' => $postId])), 'Rule requires a real reusable block');
$nativeInsert = new AdvancedGutenbergAutoInsertBlocks();
$rendered = $nativeInsert->insertBlockByRule(parse_blocks('<!-- wp:paragraph --><p>Target</p><!-- /wp:paragraph -->'), ['block_id' => $reusableId, 'position' => 'end']);
$check(count($rendered) === 2 && strpos($rendered[1]['innerHTML'], 'Reusable fixture') !== false, 'Native Auto Insert renders the saved reusable block');
if (defined('ADVANCED_GUTENBERG_PRO_LOADED')) {
    $proInput = ['id' => $ruleId, 'position' => 'after_paragraph', 'position_value' => 1, 'post_types' => ['page'],
        'post_months' => [1, 12], 'post_years' => [2026], 'authors' => [$users['editor']], 'post_ids' => [$postId], 'exclude_post_ids' => []];
    $success($call('save-auto-insert-rule', $proInput), 'Pro accepts extended targeting');
    $check(get_post_meta($ruleId, '_advgb_post_months', true) === [1, 12], 'Pro targeting preserves native metadata types');
    if (file_exists('/tmp/mcp-check/blocks-pro-auto.php')) {
        require_once '/tmp/mcp-check/blocks-pro-auto.php';
        $pro = new Advgb_Pro_Auto_Insert_Block();
        $target = parse_blocks('<!-- wp:paragraph --><p>Target</p><!-- /wp:paragraph -->');
        $output = $pro->filterBlocks($target, $target, ['position' => 'after_paragraph', 'position_value' => get_post_meta($ruleId, '_advgb_position_value', true)]);
        $check(count($output) === 2, 'Actual Pro placement service consumes saved position');
    }
} else {
    $check(is_wp_error($call('save-auto-insert-rule', ['id' => $ruleId, 'position' => 'after_paragraph'])), 'Free rejects Pro placement');
    $check(is_wp_error($call('save-auto-insert-rule', ['id' => $ruleId, 'authors' => [$users['editor']]])), 'Free rejects Pro targeting fields');
    $check(is_wp_error($call('update-plugin-settings', ['settings' => ['enable_core_blocks_features' => true]])), 'Free rejects Pro core block switch');
}
$note = $success($call('save-post-note', ['post_id' => $postId, 'content' => 'Fixture note']), 'Create native Post Note');
$noteId = $note['note']->id;
$check(get_comment($noteId)->comment_approved === '0', 'New native notes are open');
$success($call('save-post-note', ['post_id' => $postId, 'id' => $noteId, 'resolution' => 'resolved']), 'Resolve native note');
$check(get_comment($noteId)->comment_approved === '1', 'Native note resolution updates parent state');
$success($call('save-post-note', ['post_id' => $postId, 'id' => $noteId, 'resolution' => 'reopen']), 'Reopen native note');
$check(get_comment($noteId)->comment_approved === '0', 'Native reopened note is open');
$failAudit = static function ($result, $server, $request) {
    return $request->get_method() === 'POST' && $request->get_route() === '/wp/v2/comments'
        && isset($request['meta']['_wp_note_status']) ? new WP_Error('fixture_audit_failed', 'Fixture audit failure', ['status' => 500]) : $result;
};
add_filter('rest_pre_dispatch', $failAudit, 10, 3);
try {
    $check(is_wp_error($call('save-post-note', ['post_id' => $postId, 'id' => $noteId, 'resolution' => 'resolved'])), 'Audit failure is returned to the client');
    $check(get_comment($noteId)->comment_approved === '0', 'Audit failure restores the parent note status');
} finally {
    remove_filter('rest_pre_dispatch', $failAudit, 10);
}

$notes = $success($call('list-post-notes', ['post_id' => $postId]), 'Read native Post Notes');
$check(in_array($noteId, array_column($notes['notes'], 'id'), true), 'New note appears in read action');
$check(strpos(wp_json_encode($notes), 'author_email') === false && strpos(wp_json_encode($notes), 'author_ip') === false, 'Notes exclude private author contact data');
$check(is_wp_error($call('save-post-note', ['post_id' => $reusableId, 'id' => $noteId, 'content' => 'wrong post'])), 'Notes cannot be reassigned across posts');
wp_set_current_user($users['editor']);
foreach (['get-control-preset-fields', 'save-control-preset', 'delete-control-preset', 'get-custom-style-fields', 'save-custom-style', 'delete-custom-style', 'get-auto-insert-fields', 'save-auto-insert-rule', 'delete-auto-insert-rule', 'get-feature-settings', 'update-feature-settings', 'get-form-submission-counts'] as $action) {
    $check(wp_get_ability('publishpress-blocks/' . $action)->check_permissions(['id' => $ruleId]) !== true, 'Editor cannot access administrative action ' . $action);
}
$success($call('get-post-blocks', ['post_id' => $postId]), 'Editor may read a post they can edit');
$success($call('get-block-type-fields', ['name' => 'core/paragraph']), 'Editor may discover native block schemas');
wp_set_current_user($users['subscriber']);
foreach ($abilities as $ability) {
    $check($ability->check_permissions(['post_id' => $postId, 'id' => $ruleId]) !== true, 'Subscriber denied permissions for ' . $ability->get_name());
}
wp_set_current_user($users['administrator']);
$denyObject = static function ($caps, $cap, $userId, $args) use ($ruleId) {
    return $cap === 'edit_post' && ($args[0] ?? null) === $ruleId ? ['do_not_allow'] : $caps;
};
add_filter('map_meta_cap', $denyObject, 10, 4);
$rules = $success($call('list-auto-insert-rules', ['per_page' => 100]), 'Rule reads honor object capability restrictions');
$check(!in_array($ruleId, array_column($rules['rules'], 'id'), true), 'Denied rule data is excluded');
$check(is_wp_error($call('save-auto-insert-rule', ['id' => $ruleId, 'title' => 'denied'])), 'Denied rule cannot be updated even by an administrator');
remove_filter('map_meta_cap', $denyObject, 10);
update_option('advgb_contacts_saved', [
    ['date' => '2026-10-26', 'name' => 'Synthetic contact one', 'email' => 'one@example.org', 'msg' => 'Synthetic message', 'internal_secret' => 'excluded-fixture-value'],
    ['date' => '2026-10-26', 'name' => 'Synthetic contact two', 'email' => 'two@example.org', 'msg' => 'Second synthetic message'],
]);
update_option('advgb_newsletter_saved', [['fname' => 'Synthetic', 'lname' => 'Subscriber', 'email' => 'newsletter@example.org']]);
$export = $success($call('list-form-submissions', ['form' => 'contact', 'per_page' => 1]), 'Read approved full form payload with native capabilities');
$check($export['submissions'][0]->email === 'one@example.org' && $export['submissions'][0]->msg === 'Synthetic message', 'Contact export includes authorized name/email/message fields');
$check(!isset($export['submissions'][0]->internal_secret) && $export['total_pages'] === 2, 'Unknown stored fields excluded and export paginated');
$export = $success($call('list-form-submissions', ['form' => 'contact', 'page' => 2, 'per_page' => 1]), 'Read second contact page');
$check($export['submissions'][0]->email === 'two@example.org', 'Pagination does not repeat first contact');
$export = $success($call('list-form-submissions', ['form' => 'newsletter']), 'Read authorized newsletter export');
$check($export['submissions'][0]->email === 'newsletter@example.org' && $export['submissions'][0]->fname === 'Synthetic' && $export['submissions'][0]->lname === 'Subscriber', 'Newsletter export retains native first and last name fields');
$check(is_wp_error($call('list-form-submissions', ['form' => 'contact', 'per_page' => 101])), 'Export rejects oversized pages');
foreach (['manage_options', 'activate_plugins'] as $deniedCap) {
    $deny = static function ($caps, $cap) use ($deniedCap) { return $cap === $deniedCap ? ['do_not_allow'] : $caps; };
    add_filter('map_meta_cap', $deny, 10, 2);
    $check(is_wp_error($call('list-form-submissions', ['form' => 'contact'])), 'Full form export respects denied ' . $deniedCap . ' even for administrator');
    remove_filter('map_meta_cap', $deny, 10);
}
$success($call('update-plugin-settings', ['settings' => ['enable_advgb_blocks' => false]]), 'Disable Extra Blocks for export gate test');
$check(is_wp_error($call('list-form-submissions', ['form' => 'contact'])), 'Disabled feature prevents full form export');
$success($call('update-plugin-settings', ['settings' => ['enable_advgb_blocks' => true]]), 'Restore Extra Blocks after export gate test');
$otherPost = wp_insert_post(['post_title' => 'Private note fixture', 'post_status' => 'private']);
$posts[] = $otherPost;
$otherNote = $success($call('save-post-note', ['post_id' => $otherPost, 'content' => 'Synthetic private editorial note']), 'Create second-post note fixture');
$otherNoteId = $otherNote['note']->id;
$global = $success($call('list-post-notes', ['per_page' => 100]), 'List approved notes across editable posts');
$check(in_array($noteId, array_column($global['notes'], 'id'), true) && in_array($otherNoteId, array_column($global['notes'], 'id'), true), 'Cross-post list includes both accessible posts');
$denyOtherPost = static function ($caps, $cap, $user, $args) use ($otherPost) {
    return $cap === 'edit_post' && ($args[0] ?? null) === $otherPost ? ['do_not_allow'] : $caps;
};
add_filter('map_meta_cap', $denyOtherPost, 10, 4);
$global = $success($call('list-post-notes', ['per_page' => 100]), 'Cross-post note listing checks per-post permissions');
$check(!in_array($otherNoteId, array_column($global['notes'], 'id'), true), 'Denied post note is excluded from cross-post payload');
$check(is_wp_error($call('list-post-notes', ['post_id' => $otherPost])), 'Denied post cannot be requested directly');
remove_filter('map_meta_cap', $denyOtherPost, 10);
$denyModeration = static function ($caps, $cap) { return $cap === 'moderate_comments' ? ['do_not_allow'] : $caps; };
add_filter('map_meta_cap', $denyModeration, 10, 2);
$check(is_wp_error($call('list-post-notes')), 'Cross-post notes respect denied native moderation capability');
$success($call('list-post-notes', ['post_id' => $postId]), 'Specific editable post notes remain available without global moderation');
remove_filter('map_meta_cap', $denyModeration, 10);
$authorPost = wp_insert_post(['post_title' => 'Author-owned note fixture', 'post_author' => $users['author'], 'post_status' => 'draft']);
$posts[] = $authorPost;
wp_set_current_user($users['author']);
$success($call('save-post-note', ['post_id' => $authorPost, 'content' => 'Synthetic author-owned note']), 'Author can create a note on an owned draft');
$success($call('list-post-notes', ['post_id' => $authorPost]), 'Author can read owned-post notes');
$check(is_wp_error($call('list-post-notes')), 'Author cannot use cross-post listing without moderation permissions');
$check(is_wp_error($call('list-post-notes', ['post_id' => $postId])), 'Author cannot read notes on an inaccessible post');
foreach (['editor', 'subscriber', 'author'] as $role) {
    wp_set_current_user($users[$role]);
    $check(is_wp_error($call('list-form-submissions', ['form' => 'contact'])), $role . ' cannot export saved form payloads');
}
wp_set_current_user($users['administrator']);
$success($call('delete-post-note', ['post_id' => $postId, 'id' => $noteId]), 'Trash native note');
$success($call('delete-auto-insert-rule', ['id' => $ruleId]), 'Trash insertion rule');
$success($call('delete-reusable-block', ['id' => $reusableId]), 'Trash reusable block');
$success($call('delete-custom-style', ['id' => $styleId]), 'Delete custom style');
$success($call('delete-control-preset', ['id' => $presetId]), 'Delete saved preset');

require __DIR__ . '/abilities-workflow-cases.php';
