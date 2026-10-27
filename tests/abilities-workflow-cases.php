<?php
/** Workflow regressions; included by the isolated smoke suite. */
wp_set_current_user($users['administrator']);
$call('update-plugin-settings', ['settings' => ['block_controls' => true, 'enable_block_access' => true, 'enable_custom_styles' => true]]);
$check(is_wp_error($call('update-plugin-settings', ['settings' => ['gallery_lightbox_caption' => '2'], 'dry_run' => true])), 'Integer settings reject numeric strings in preview');
$features = $success($call('list-features'), 'Unified feature inventory is available');
$check(count($features['features']) === 18, 'Inventory covers screens and editor settings');
$check(!empty($features['features'][5]['fields']), 'Unified inventory includes authorized native default fields');
$check(in_array('auto-insert', array_column($features['features'], 'id'), true), 'Inventory includes edition-aware Auto Insert discovery');
foreach ([
    ['update-block-configuration', ['block' => 'advgb-accordions', 'settings' => ['marginBottom' => 14]], 'advgb_blocks_default_config', 'settings'],
    ['update-plugin-settings', ['settings' => ['blocks_icon_color' => '#123abc']], 'advgb_settings', 'settings'],
    ['update-block-controls', ['controls' => ['device_type' => false]], 'advgb_block_controls', 'controls'],
    ['update-block-permissions', ['role' => 'editor', 'blocks' => ['core/paragraph' => false]], 'advgb_blocks_user_roles', 'permissions'],
    ['update-feature-settings', ['feature' => 'editor-features', 'role' => 'editor', 'settings' => ['disable_openverse' => false]], 'advgb_settings', 'settings'],
] as $case) {
    list($action, $input, $option, $field) = $case;
    $before = get_option($option);
    $preview = $success($call($action, $input + ['dry_run' => true]), 'Preview validates ' . $action);
    $check($before === get_option($option), 'Preview leaves settings unchanged for ' . $action);
    $saved = $success($call($action, $input), 'Save after preview for ' . $action);
    $check($preview[$field] == $saved[$field], 'Preview matches saved values for ' . $action);
}
foreach (['bulk-update-block-permissions', 'bulk-update-feature-settings'] as $action) {
    $permissionBatch = $action === 'bulk-update-block-permissions';
    $input = $permissionBatch ? ['blocks' => ['core/paragraph' => true]] : ['settings' => ['disable_openverse' => true]];
    $option = $permissionBatch ? 'advgb_blocks_user_roles' : 'advgb_settings';
    $before = get_option($option);
    $check(is_wp_error($call($action, $input + ['roles' => ['editor', 'missing-role']])), 'Bulk rejects an invalid final role: ' . $action);
    $check($before === get_option($option), 'Invalid batch saves no roles: ' . $action);
    $preview = $success($call($action, $input + ['roles' => ['editor', 'author'], 'dry_run' => true]), 'Bulk preview: ' . $action);
    $check($preview['dry_run'] && count($preview['results']) === 2 && $before === get_option($option), 'Bulk preview returns both targets without writes');
    $saved = $success($call($action, $input + ['roles' => ['editor', 'author']]), 'Bulk save: ' . $action);
    $check(!$saved['dry_run'] && count($saved['results']) === 2, 'Bulk saves both validated targets');
}
$style = $success($call('save-custom-style', ['title' => 'Assignment fixture', 'name' => 'mcp-assignment', 'css' => 'color: pink;']), 'Create assignment style');
$stylePost = wp_insert_post(['post_title' => 'Style fixture', 'post_status' => 'draft', 'post_content' => '<!-- wp:group --><div class="keep-parent"><!-- wp:paragraph {"className":"keep-child"} --><p class="keep-child">Keep text</p><!-- /wp:paragraph --></div><!-- /wp:group -->']);
$posts[] = $stylePost;
$read = $success($call('get-post-blocks', ['post_id' => $stylePost]), 'Read style target');
$input = ['post_id' => $stylePost, 'path' => [0, 0], 'expected_hash' => $read['hash'], 'style_id' => $style['style']->id];
$changed = $success($call('assign-block-style', $input), 'Assign native style to nested block');
$content = get_post_field('post_content', $stylePost);
$block = parse_blocks($content)[0]['innerBlocks'][0];
$check($block['attrs']['customStyle'] === 'mcp-assignment' && strpos($block['innerHTML'], 'keep-child mcp-assignment') !== false, 'Native style attribute and wrapper class agree');
$check(strpos($content, 'keep-parent') !== false && strpos($content, 'Keep text') !== false, 'Style assignment preserves surrounding markup and content');
$check(is_wp_error($call('assign-block-style', $input)), 'Style assignment rejects stale hashes');
$check(is_wp_error($call('assign-block-style', array_merge($input, ['expected_hash' => $changed['hash'], 'style_id' => 99999999]))), 'Unknown style rejected');
$changed = $success($call('assign-block-style', ['post_id' => $stylePost, 'path' => [0, 0], 'expected_hash' => $changed['hash'], 'remove' => true]), 'Remove native saved style');
$block = parse_blocks(get_post_field('post_content', $stylePost))[0]['innerBlocks'][0];
$check(empty($block['attrs']['customStyle']) && strpos($block['innerHTML'], 'mcp-assignment') === false && strpos($block['innerHTML'], 'keep-child') !== false, 'Removing style retains unrelated classes');
$largePost = wp_insert_post(['post_title' => 'Bounded edit fixture', 'post_status' => 'draft', 'post_content' => '<!-- wp:paragraph --><p>' . str_repeat('x', 200000) . '</p><!-- /wp:paragraph -->']);
$posts[] = $largePost;
$largeContent = get_post_field('post_content', $largePost);
$check(is_wp_error($call('assign-block-style', ['post_id' => $largePost, 'path' => [0], 'expected_hash' => hash('sha256', $largeContent), 'style_id' => $style['style']->id])), 'Oversized style target rejected before saving');
$check(get_post_field('post_content', $largePost) === $largeContent, 'Oversized style failure leaves content unchanged');
$deny = static function ($caps, $cap) {
    return in_array($cap, ['activate_plugins', 'edit_post'], true) ? ['do_not_allow'] : $caps;
};
add_filter('map_meta_cap', $deny, 10, 2);
try {
    $check(is_wp_error($call('list-features')), 'Denied Administrator cannot read feature inventory');
    $check(is_wp_error($call('bulk-update-feature-settings', ['roles' => ['editor'], 'settings' => ['disable_openverse' => true]])), 'Denied Administrator cannot perform batch writes');
    $check(is_wp_error($call('assign-block-style', ['post_id' => $stylePost, 'path' => [0], 'expected_hash' => $changed['hash'], 'remove' => true])), 'Denied Administrator cannot assign a post style');
} finally {
    remove_filter('map_meta_cap', $deny, 10);
}
$translate = static function ($translation, $text, $domain) {
    return $domain === 'advanced-gutenberg' ? 'translated:' . $translation : $translation;
};
add_filter('gettext', $translate, 10, 3);
try {
    $error = $call('get-block-type-fields', ['name' => 'missing/translation-fixture']);
    $check(is_wp_error($error) && strpos($error->get_error_message(), 'translated:') === 0, 'Domain errors use the plugin text domain');
} finally {
    remove_filter('gettext', $translate, 10);
}
