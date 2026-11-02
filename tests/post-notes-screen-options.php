<?php
// Run with: php tests/post-notes-screen-options.php
// WordPress stubs let us exercise the real callback and template query without a database.
define('ABSPATH', __DIR__ . '/');
function plugin_dir_path($path) { return dirname($path) . '/'; }
function add_action(...$args) {}
function wp_get_current_user() { return (object) ['ID' => 1]; }
function current_user_can($capability) { return true; }
function get_user_meta(...$args) { return 100000; }
function get_current_screen() { return null; }
function absint($value) { return abs((int) $value); }
function admin_url($path) { return $path; }
function check_same($expected, $actual, $message) {
    if ($expected !== $actual) {
        throw new RuntimeException($message . ': expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
    }
}
class QueryCaptured extends RuntimeException {}
function get_comments($args) {
    if (!empty($args['count'])) {
        return 100000;
    }
    check_same(999, $args['number'], 'Stale page size must be capped in the query');
    check_same(999, $args['offset'], 'Pagination must use the capped page size');
    throw new QueryCaptured();
}
require dirname(__DIR__) . '/incl/advanced-gutenberg-main.php';
$main = (new ReflectionClass('AdvancedGutenbergMain'))->newInstanceWithoutConstructor();
foreach ([1 => 1, 20 => 20, 998 => 998, 999 => 999, 1000 => 999, 100000 => 999, 0 => false, -1 => false] as $input => $expected) {
    check_same($expected, $main->setPostNotesScreenOption(false, 'advgb_post_notes_per_page', (string) $input), 'Save value ' . $input);
}
check_same('unchanged', $main->setPostNotesScreenOption('unchanged', 'another_option', 100000), 'Unrelated option');
check_same('unchanged', $main->setPostNotesScreenOption('unchanged', 'advgb_post_notes_per_page', 0), 'Invalid value preserves status');
$_GET = ['paged' => 2];
try {
    require dirname(__DIR__) . '/incl/pages/post-notes.php';
    throw new RuntimeException('Expected a paginated comment query');
} catch (QueryCaptured $e) {
    echo "Passed: save boundaries, unrelated options, stale metadata query limit and pagination.\n";
}
