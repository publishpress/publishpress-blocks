<?php

declare(strict_types=1);

define('ABSPATH', __DIR__);

function __(string $text, string $domain = ''): string
{
    return $text;
}

function plugin_dir_path(string $file): string
{
    return dirname($file) . DIRECTORY_SEPARATOR;
}

function add_action(): void
{
}

function add_filter(): void
{
}

function get_option(string $name, $default = false)
{
    global $advgb_test_options;

    return array_key_exists($name, $advgb_test_options) ? $advgb_test_options[$name] : $default;
}

function update_option(string $name, $value, bool $autoload = true): void
{
    global $advgb_test_options;

    $advgb_test_options[$name] = $value;
}

require_once __DIR__ . '/../incl/advanced-gutenberg-main.php';

$legacy_blocks = AdvancedGutenbergMain::legacyBlocksMap();
$expected_new_legacy_blocks = [
    'image',
    'images-slider',
    'summary',
    'video',
];

foreach ($expected_new_legacy_blocks as $slug) {
    assert(array_key_exists($slug, $legacy_blocks), sprintf('%s should be in the legacy block map.', $slug));
}

$new_install_state = AdvancedGutenbergMain::defaultLegacyBlocksState(false);
foreach ($expected_new_legacy_blocks as $slug) {
    assert(isset($new_install_state[$slug]), sprintf('%s should be present in the new install default state.', $slug));
    assert($new_install_state[$slug] === 0, sprintf('%s should be disabled by default on new installs.', $slug));
}

$upgrade_state = AdvancedGutenbergMain::defaultLegacyBlocksState(true);
foreach ($expected_new_legacy_blocks as $slug) {
    assert(isset($upgrade_state[$slug]), sprintf('%s should be present in the upgrade default state.', $slug));
    assert($upgrade_state[$slug] === 1, sprintf('%s should stay enabled on existing installs.', $slug));
}

$advgb_test_options = [
    'advgb_legacy_blocks' => $new_install_state,
];

$disabled_blocks = AdvancedGutenbergMain::disabledLegacyBlocks();
foreach ($expected_new_legacy_blocks as $slug) {
    assert(
        in_array('advgb/' . $slug, $disabled_blocks, true),
        sprintf('advgb/%s should be disabled when its legacy state is off.', $slug)
    );
}

$advgb_test_options = [
    'advgb_legacy_blocks' => [
        'container'    => 1,
        'contact-form' => 1,
    ],
];

AdvancedGutenbergMain::fillMissingLegacyBlocksState(true);

foreach ($expected_new_legacy_blocks as $slug) {
    assert(
        isset($advgb_test_options['advgb_legacy_blocks'][$slug]),
        sprintf('%s should be added to existing legacy settings.', $slug)
    );
    assert(
        $advgb_test_options['advgb_legacy_blocks'][$slug] === 1,
        sprintf('%s should be enabled when added to existing installs.', $slug)
    );
}

echo "Legacy block defaults tests passed.\n";
