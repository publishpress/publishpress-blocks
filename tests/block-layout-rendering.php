<?php
// Run with: php tests/block-layout-rendering.php
namespace PublishPress\Blocks {
    class Utilities {
        public static function settingIsEnabled($setting) { return true; }
    }
}
namespace {
    define('ABSPATH', __DIR__ . '/');
    define('ADVANCED_GUTENBERG_PLUGIN_DIR_URL', 'https://example.org/plugin/');
    define('ADVANCED_GUTENBERG_VERSION', 'test');
    $wp_version = '7.1';
    function plugin_dir_path($path) { return dirname($path) . '/'; }
    function add_action(...$args) {}
    function wp_enqueue_style($handle, ...$args) { $GLOBALS['styles'][] = $handle; }
    function wp_enqueue_script($handle, ...$args) { $GLOBALS['scripts'][] = $handle; }
    function wp_localize_script(...$args) {}
    function wp_add_inline_style($handle, $css) { $GLOBALS['inline'][$handle] = $css; }
    function get_option($key, $default = false) { return ['gallery_lightbox' => true, 'gallery_lightbox_caption' => true]; }
    function esc_html($value) { return htmlspecialchars((string) $value); }
    function check($condition, $message) { if (!$condition) { throw new \RuntimeException($message); } }
    require dirname(__DIR__) . '/incl/advanced-gutenberg-main.php';
    $main = (new \ReflectionClass('AdvancedGutenbergMain'))->newInstanceWithoutConstructor();
    function block($name, $children = []) {
        return ['blockName' => $name, 'attrs' => [], 'innerBlocks' => $children,
            'innerHTML' => '<div class="outer"><div class="inner">Content</div></div>',
            'innerContent' => ['<div class="outer"><div class="inner">Content</div></div>']];
    }
    foreach (['mosaic/post-content', 'core/post-content', 'core/paragraph', 'advgb/unknown', null] as $name) {
        $input = block($name);
        check($main->contentPreRender($input) === $input, 'Empty CSS changed block data: ' . $name);
        $input['innerContent'] = [];
        check($main->contentPreRender($input) === $input, 'Empty dynamic block changed: ' . $name);
    }
    $gallery = block('core/gallery');
    check($main->contentPreRender($gallery) === $gallery, 'Gallery structure changed');
    check(in_array('gallery_lightbox_js', $scripts, true), 'Gallery lightbox script lost');
    check(in_array('colorbox_style', $styles, true), 'Gallery lightbox CSS lost');
    $button = block('advgb/button');
    $button['attrs'] = ['id' => 'test-button'];
    $css = $main->addBlocksStyles($button);
    check($css !== '', 'Button fixture must generate CSS');
    $rendered = $main->contentPreRender($button);
    check($rendered['innerContent'] === array_merge($button['innerContent'], [$css]), 'Button CSS changed');
    $parent = block('core/group', [block('core/group', [$button])]);
    $nestedCss = $main->addBlocksStyles($parent);
    check(strpos($nestedCss, 'test-button') !== false, 'Nested styles missing');
    check($main->contentPreRender($parent)['innerContent'] === array_merge($parent['innerContent'], [$nestedCss]), 'Nested CSS behavior changed');
    class ContentDisplayFixture extends \AdvancedGutenbergMain {
        public function addBlocksStyles($block) { return '<style>.recent-posts{color:red}</style>'; }
    }
    $display = (new \ReflectionClass('ContentDisplayFixture'))->newInstanceWithoutConstructor();
    $recent = block('advgb/recent-posts');
    check($display->contentPreRender($recent) === $recent, 'Content Display structure changed');
    check($inline['advgb_recent_posts_styles'] === '.recent-posts{color:red}', 'Content Display inline CSS lost');
    echo "Passed: empty blocks, gallery lightbox, button CSS, nested CSS, Content Display inline CSS.\n";
}
