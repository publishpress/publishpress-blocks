<?php
/** Verify Blocks abilities in an isolated WordPress database. */
if (PHP_SAPI !== 'cli' || !in_array(count($argv), [2, 3], true)) {
    exit("Usage: php abilities-smoke.php /path/to/isolated/wp-load.php\n");
}
if (getenv('BLOCKS_MCP_TEST_PRO') === '1') {
    define('ADVANCED_GUTENBERG_PRO_LOADED', true);
}
require $argv[1];
if (!defined('ADVANCED_GUTENBERG_PLUGIN_DIR_URL')) {
    define('ADVANCED_GUTENBERG_PLUGIN_DIR_URL', plugins_url('publishpress-blocks/'));
}
if ($GLOBALS['wpdb']->prefix !== 'mcp_smoke_') {
    exit("Use the isolated mcp_smoke_ database.\n");
}
require_once ABSPATH . 'wp-admin/includes/user.php';
require_once __DIR__ . '/../incl/utilities-main.php';
require_once __DIR__ . '/../incl/block-settings-main.php';
require_once __DIR__ . '/../incl/block-controls-main.php';
require_once __DIR__ . '/../incl/advanced-gutenberg-main.php';
require_once __DIR__ . '/../incl/abilities.php';
$nativeMain = (new ReflectionClass('AdvancedGutenbergMain'))->newInstanceWithoutConstructor();
$nativeMain->registerPostMeta();
$checks = 0;
$check = static function ($condition, $message) use (&$checks) {
    if (!$condition) {
        throw new RuntimeException($message);
    }
    ++$checks;
    echo "PASS: $message\n";
};
$call = static function ($name, $input = []) {
    return wp_get_ability('publishpress-blocks/' . $name)->execute($input);
};
$options = ['advgb_settings', 'advgb_blocks_user_roles', 'advgb_block_controls', 'advgb_blocks_default_config', 'advgb_blocks_list', 'advgb_custom_styles', 'advgb_block_control_presets', 'advgb_blocks_enabled', 'advgb_legacy_blocks', 'advgb_legacy_settings_migrated', 'advgb_email_sender', 'advgb_recaptcha_config', 'advgb_contacts_saved', 'advgb_newsletter_saved'];
$original = [];
foreach ($options as $name) {
    $original[$name] = get_option($name);
}
$users = [];
$posts = [];
try {
    foreach (['administrator', 'editor', 'subscriber', 'author'] as $role) {
        $id = wp_insert_user(['user_login' => 'blocks_mcp_' . $role . wp_generate_password(8, false), 'user_pass' => wp_generate_password(), 'user_email' => 'mcp-' . wp_generate_password(10, false) . '@example.org', 'role' => $role]);
        if (is_wp_error($id)) {
            throw new RuntimeException($id->get_error_message());
        }
        $users[$role] = $id;
    }
    wp_set_current_user($users['administrator']);
    $abilities = array_filter(wp_get_abilities(), static function ($ability) {
        return strpos($ability->get_name(), 'publishpress-blocks/') === 0;
    });
    $check(count($abilities) === 41, 'All forty-one abilities register');
    \PublishPress\Blocks\Mcp\Abilities::registerCategory();
    $check(wp_has_ability_category('publishpress'), 'Shared category can be registered repeatedly');
    foreach ($abilities as $ability) {
        $meta = $ability->get_meta();
        $check($ability->get_category() === 'publishpress' && !$meta['public'] && !$meta['show_in_rest'] && !$meta['mcp']['public'], $ability->get_name() . ' is private');
    }
    update_option('advgb_settings', ['google_api_key' => 'fixture-secret', 'unrelated' => 'preserve']);
    $settings = $call('get-plugin-settings');
    $check(!is_wp_error($settings) && strpos(wp_json_encode($settings), 'fixture-secret') === false, 'Settings expose no credentials');
    $check(isset($settings['fields']->block_controls), 'Settings include human-readable discovery');
    require __DIR__ . '/abilities-settings-format-cases.php';
    $changed = $call('update-plugin-settings', ['settings' => ['enable_custom_styles' => false, 'blocks_icon_color' => '#123456']]);
    $check(!is_wp_error($changed) && !$changed['settings']->enable_custom_styles, 'Typed settings update succeeds');
    $check(get_option('advgb_settings')['unrelated'] === 'preserve', 'Unspecified settings are preserved');
    $check(is_wp_error($call('update-plugin-settings', ['settings' => ['google_api_key' => 'no']])) , 'Credential fields are rejected');
    $check(is_wp_error($call('update-plugin-settings', ['settings' => ['enable_custom_styles' => 'yes']])), 'Invalid booleans rejected');
    $check(is_wp_error($call('list-custom-styles')), 'Disabled Block Styles cannot be read');
    $check(is_wp_error($call('update-plugin-settings', ['settings' => ['enable_custom_styles' => 'false']])), 'String booleans do not silently change settings');
    $call('update-plugin-settings', ['settings' => ['enable_custom_styles' => true]]);
    update_option('advgb_custom_styles', [['id' => 42, 'title' => 'Fixture', 'css' => []]]);
    $check($call('list-custom-styles')['styles'][0]['id'] === 42, 'Saved style data available when enabled');
    update_option('advgb_blocks_list', [['name' => 'advgb/fixture', 'title' => '<b>Fixture</b>']]);
    $check(in_array('advgb/fixture', array_column($call('list-block-types')['blocks'], 'name'), true), 'Client-only blocks discovered from native snapshot');
    update_option('advgb_blocks_user_roles', ['editor' => ['active_blocks' => ['core/paragraph'], 'inactive_blocks' => []], 'subscriber' => ['inactive_blocks' => ['advgb/fixture']]]);
    $changed = $call('update-block-permissions', ['role' => 'editor', 'blocks' => ['advgb/fixture' => false]]);
    $check(!is_wp_error($changed) && in_array('advgb/fixture', $changed['permissions']->inactive_blocks, true), 'Block permissions update one role');
    $check(get_option('advgb_blocks_user_roles')['subscriber']['inactive_blocks'] === ['advgb/fixture'], 'Other roles are preserved');
    $changed = $call('update-block-permissions', ['role' => 'author', 'blocks' => ['advgb/fixture' => false]]);
    $check(!is_wp_error($changed) && in_array('core/paragraph', $changed['permissions']->active_blocks, true), 'First role change preserves default access to other blocks');
    $before = get_option('advgb_blocks_user_roles');
    $check(is_wp_error($call('update-block-permissions', ['role' => 'editor', 'blocks' => ['core/paragraph' => false, 'missing/block' => true]])), 'Unknown blocks reject the entire update');
    $check($before === get_option('advgb_blocks_user_roles'), 'Validation failure writes nothing');
    $check(is_wp_error($call('get-block-permissions', ['role' => 'missing'])), 'Unknown roles rejected');
    update_option('advgb_block_controls', ['controls' => ['schedule' => false], 'inactive_blocks' => ['core/paragraph']]);
    $changed = $call('update-block-controls', ['controls' => ['device_type' => false]]);
    $check(!is_wp_error($changed) && !$changed['controls']->schedule && !$changed['controls']->device_type, 'Control update preserves other controls');
    $check($changed['inactive_blocks'] === ['core/paragraph'], 'Control update preserves per-block lists');
    $config = $call('get-block-configuration');
    $check(isset($config['fields']->{'advgb-accordions'}), 'Native default fields available for discovery');
    $changed = $call('update-block-configuration', ['block' => 'advgb-accordions', 'settings' => ['marginBottom' => 12, 'headerIcon' => 'plus', 'collapsedAll' => false]]);
    $check(!is_wp_error($changed) && $changed['settings']->collapsedAll === 0, 'Native configuration choices and checkbox values save correctly');
    $before = get_option('advgb_blocks_default_config');
    $check(is_wp_error($call('update-block-configuration', ['block' => 'advgb-accordions', 'settings' => ['marginBottom' => 999]])), 'Out of range defaults rejected');
    $check(is_wp_error($call('update-block-configuration', ['block' => 'advgb-accordions', 'settings' => ['headerIcon' => 'invalid']])) && $before === get_option('advgb_blocks_default_config'), 'Invalid choices write nothing');
    $postId = wp_insert_post(['post_title' => 'Blocks MCP fixture', 'post_content' => '<!-- wp:group --><div><!-- wp:paragraph --><p>Private fixture</p><!-- /wp:paragraph --></div><!-- /wp:group -->', 'post_status' => 'draft']);
    $posts[] = $postId;
    $inventory = $call('inspect-post-blocks', ['post_id' => $postId]);
    $check(!is_wp_error($inventory) && count($inventory['blocks']) === 2 && $inventory['blocks'][1]['depth'] === 1, 'Nested blocks inspected without HTML');
    $check(strpos(wp_json_encode($inventory), 'Private fixture') === false, 'Rendered content excluded');
    register_post_type('advgb_insert_block', ['public' => false, 'capability_type' => 'post']);
    for ($index = 0; $index < 3; ++$index) {
        $ruleId = wp_insert_post(['post_type' => 'advgb_insert_block', 'post_title' => 'Fixture rule', 'post_status' => 'publish']);
        $posts[] = $ruleId;
        update_post_meta($ruleId, '_advgb_position', 'end');
    }
    $rules = $call('list-auto-insert-rules', ['per_page' => 2, 'page' => 1]);
    $check(!is_wp_error($rules) && count($rules['rules']) === 2 && $rules['total_pages'] >= 2, 'Auto Insert rules have bounded pagination');
    $check(is_wp_error($call('list-auto-insert-rules', ['per_page' => 101])), 'Unbounded page sizes rejected');
    $deny = static function ($caps, $cap) {
        return $cap === 'activate_plugins' ? ['do_not_allow'] : $caps;
    };
    add_filter('map_meta_cap', $deny, 10, 2);
    $check(is_wp_error($call('get-plugin-settings')), 'Administrator role does not bypass denied capability');
    remove_filter('map_meta_cap', $deny, 10);
    require __DIR__ . '/abilities-feature-cases.php';
    if (isset($argv[2])) {
        require_once $argv[2] . '/mcp-adapter.php';
        $discovery = \WP\MCP\Abilities\DiscoverAbilitiesAbility::execute([]);
        $check(strpos(wp_json_encode($discovery), 'publishpress-blocks/') === false, 'Released adapter default server cannot discover Blocks actions');
        foreach ($abilities as $ability) {
            $denied = \WP\MCP\Abilities\ExecuteAbilityAbility::check_permission(['ability_name' => $ability->get_name(), 'parameters' => []]);
            $check(is_wp_error($denied), 'Default server cannot execute ' . $ability->get_name());
            $tool = \WP\MCP\Domain\Tools\McpTool::fromAbility($ability);
            $check(!is_wp_error($tool), 'Released adapter projects ' . $ability->get_name());
        }
        $tool = \WP\MCP\Domain\Tools\McpTool::fromAbility(wp_get_ability('publishpress-blocks/get-plugin-settings'));
        $check(!is_wp_error($tool->execute([])), 'Custom-server tool executes with native identity');
        $settingsTool = \WP\MCP\Domain\Tools\McpTool::fromAbility(wp_get_ability('publishpress-blocks/update-feature-settings'));
        $check(!is_wp_error($settingsTool->execute(['feature' => 'recaptcha', 'settings' => ['recaptcha_theme' => 'invisible'], 'dry_run' => true])), 'Released adapter accepts native feature choices');
        $check(!is_wp_error($settingsTool->execute(['feature' => 'form-email', 'settings' => ['contact_form_sender_email' => ''], 'dry_run' => true])), 'Released adapter accepts native empty settings');
        $check(is_wp_error($settingsTool->execute(['feature' => 'recaptcha', 'settings' => ['recaptcha_enable' => 'false']])), 'Released adapter rejects scalar checkbox coercion');

    }
    $validInputs = [
        'update-plugin-settings' => ['settings' => ['reusable_blocks' => true]],
        'get-block-permissions' => ['role' => 'editor'],
        'update-block-permissions' => ['role' => 'editor', 'blocks' => ['core/paragraph' => false]],
        'update-block-controls' => ['controls' => ['schedule' => true]],
        'update-block-configuration' => ['block' => 'advgb-accordions', 'settings' => ['marginBottom' => 1]],
    ];
    $deny = static function () {
        return ['do_not_allow'];
    };
    add_filter('map_meta_cap', $deny, 10, 2);
    foreach ($abilities as $ability) {
        $shortName = substr($ability->get_name(), strlen('publishpress-blocks/'));
        $input = $shortName === 'inspect-post-blocks' ? ['post_id' => $postId] : ($validInputs[$shortName] ?? []);
        $check(($ability->check_permissions($input) !== true), 'Denied capabilities block administrator ' . $shortName);
    }
    remove_filter('map_meta_cap', $deny, 10);
    foreach (['enable_block_access' => 'get-block-permissions', 'block_controls' => 'get-block-controls', 'enable_advgb_blocks' => 'get-block-configuration', 'auto_insert_blocks' => 'list-auto-insert-rules'] as $feature => $action) {
        $call('update-plugin-settings', ['settings' => [$feature => false]]);
        $check(is_wp_error($call($action, $validInputs[$action] ?? [])), 'Disabled feature blocks ' . $action);
        $call('update-plugin-settings', ['settings' => [$feature => true]]);
    }
    foreach (['editor', 'subscriber'] as $role) {
        wp_set_current_user($users[$role]);
        foreach ($abilities as $ability) {
            if (!in_array(substr($ability->get_name(), strlen('publishpress-blocks/')), ['get-plugin-settings', 'update-plugin-settings', 'get-block-permissions', 'update-block-permissions', 'get-block-controls', 'update-block-controls', 'update-block-configuration', 'list-block-types', 'get-block-configuration', 'list-control-presets', 'list-custom-styles', 'list-auto-insert-rules'], true)) {
                continue;
            }
            $check(is_wp_error($ability->execute($validInputs[substr($ability->get_name(), strlen('publishpress-blocks/'))] ?? [])), $role . ' denied ' . $ability->get_name());
        }
        $result = $call('inspect-post-blocks', ['post_id' => $postId]);
        $check($role === 'editor' ? !is_wp_error($result) : is_wp_error($result), $role . ' inspection follows edit_post permissions');
    }
    echo "Completed $checks Blocks ability checks.\n";
} finally {
    wp_set_current_user($users['administrator'] ?? 0);
    foreach ($posts as $id) {
        wp_delete_post($id, true);
    }
    foreach ($options as $name) {
        if ($original[$name] === false) {
            delete_option($name);
        } else {
            update_option($name, $original[$name]);
        }
    }
    foreach ($users as $id) {
        wp_delete_user($id);
    }
}
