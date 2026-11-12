<?php
/** Older WordPress installations must continue without the optional API. */
define('ABSPATH', __DIR__);
require_once __DIR__ . '/../incl/abilities.php';
if (class_exists('PublishPress\\Blocks\\Mcp\\Operations', false)) {
    throw new RuntimeException('Operations must remain unloaded without the WordPress API.');
}
echo "Missing API compatibility check passed.\n";
