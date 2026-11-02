<?php

declare(strict_types=1);

define('ABSPATH', __DIR__);

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

require_once __DIR__ . '/../incl/advanced-gutenberg-main.php';

$main = (new ReflectionClass(AdvancedGutenbergMain::class))->newInstanceWithoutConstructor();
$allowed = $main->addAllowedTags([]);

assert(isset($allowed['svg']['class']), 'SVG class attribute should be allowed for filtered block markup.');
assert(isset($allowed['svg']['viewbox']), 'SVG viewbox attribute should be allowed for filtered block markup.');
assert(isset($allowed['svg']['fill']), 'SVG fill attribute should be allowed for filtered block markup.');
assert(isset($allowed['polygon']['points']), 'SVG polygon points should be allowed for configurable accordion icons.');
assert(isset($allowed['polygon']['fill']), 'SVG polygon fill should be allowed for configurable accordion icons.');

echo "SVG KSES attributes test passed.\n";
