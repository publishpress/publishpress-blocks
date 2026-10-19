<?php

define('ABSPATH', __DIR__);

$abilities = [];

function __($text)
{
    return $text;
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

require_once __DIR__ . '/../incl/abilities.php';

PublishPressBlocksAbilities::registerAbilities();

if (count($abilities) !== 6) {
    throw new RuntimeException('Expected six read-only abilities.');
}

foreach ($abilities as $ability) {
    if ($ability['meta']['show_in_rest'] !== true) {
        throw new RuntimeException('Ability must be visible through core REST discovery.');
    }
    if ($ability['meta']['mcp']['public'] !== true) {
        throw new RuntimeException('Ability must be visible to MCP adapters.');
    }
    if ($ability['meta']['annotations']['readonly'] !== true) {
        throw new RuntimeException('Ability must be read-only.');
    }
}

echo "Abilities registration tests passed.\n";
