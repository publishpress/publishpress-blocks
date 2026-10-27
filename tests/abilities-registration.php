<?php

define('ABSPATH', __DIR__);

$abilities = [];

function __($text)
{
    return 'translated:' . $text;
}

function add_action()
{
}

function wp_register_ability_category()
{
    return true;
}

function wp_register_ability($name, $args)
{
    global $abilities;

    $abilities[$name] = $args;

    return true;
}

function plugin_dir_path($file)
{
    return dirname($file) . '/';
}

require_once __DIR__ . '/../incl/advanced-gutenberg-main.php';
require_once __DIR__ . '/../incl/abilities.php';

\PublishPress\Blocks\Mcp\Abilities::registerAbilities();

if (count($abilities) !== 41) {
    throw new RuntimeException('Expected forty-one Blocks abilities.');
}

foreach ($abilities as $ability) {
    if (strpos($ability['label'], 'translated:') !== 0 || strpos($ability['description'], 'translated:') !== 0) {
        throw new RuntimeException('Action labels and descriptions must be translated.');
    }
    if ($ability['meta']['show_in_rest'] !== false) {
        throw new RuntimeException('Ability must not be publicly exposed through core REST discovery.');
    }
    if ($ability['meta']['mcp']['public'] !== false) {
        throw new RuntimeException('Ability must not be exposed to default MCP servers.');
    }
    if ($ability['category'] !== 'publishpress' || $ability['meta']['public'] !== false) {
        throw new RuntimeException('Abilities must use the private shared PublishPress category.');
    }
}

echo "Abilities registration tests passed.\n";
