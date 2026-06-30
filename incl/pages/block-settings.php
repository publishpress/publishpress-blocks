<?php
defined('ABSPATH') || die;

// ThickBox JS and CSS
add_thickbox();

$blocks_list_saved = get_option('advgb_blocks_list');
$advgb_blocks      = [];
$free_version      = false;
// Blocks hidden from this screen on all sites:
// deprecated blocks plus inner/child blocks that aren't configured directly.
$hidden_blocks     = array_merge(
    AdvancedGutenbergMain::hiddenDeprecatedBlocks(),
    [
        'advgb/accordion-item', // Accordion Item
        'advgb/recent-posts',   // Content Display
        'advgb/list-item',      // List Item
        'advgb/tab',            // Tab Item
        'advgb/feature-list',   // Feature List
    ]
);
if (gettype($blocks_list_saved) === 'array') {
    foreach ($blocks_list_saved as $block) {
        if (strpos($block['name'], 'advgb/') === false) {
            continue;
        } elseif (in_array($block['name'], $hidden_blocks, true)) {
            continue;
        } else {
            $block['icon'] = htmlentities($block['icon']);
            array_push($advgb_blocks, $block);
        }
    }
}

if (!defined('ADVANCED_GUTENBERG_PRO_LOADED')) {
    $advgb_blocks = array_merge($advgb_blocks, PublishPress\Blocks\Utilities::getProBlocks());
    $free_version      = true;
}

/**
 * Sort array
 *
 * @param string $key Array key to sort
 *
 * @return Closure
 */
function sortBy($key)
{
    return function ($a, $b) use ($key) {
        return strnatcmp($a[$key], $b[$key]);
    };
}

usort($advgb_blocks, sortBy('title'));
$excluded_blocks_config = [
    'advgb/container',
    'advgb/accordion-item',
    'advgb/accordion',
    'advgb/tabs',
    'advgb/tab',
    'advgb/recent-posts',
    'advgb/login-form',
    'advgb/search-bar',
    'advgb/countdown',
    'advgb/feature-list',
    'advgb/feature',
    'advgb/pricing-table'
];

$new_titles = [
    'advgb/accordions' => __('Accordion - PublishPress', 'advanced-gutenberg'),
    'advgb/button' => __('Button - PublishPress', 'advanced-gutenberg'),
    'advgb/icon' => __('Icon - PublishPress', 'advanced-gutenberg'),
    'advgb/image' => __('Image - PublishPress', 'advanced-gutenberg'),
    'advgb/list' => __('List - PublishPress', 'advanced-gutenberg'),
    'advgb/table' => __('Table - PublishPress', 'advanced-gutenberg'),
    'advgb/adv-tabs' => __('Tabs - PublishPress', 'advanced-gutenberg'),
    'advgb/video' => __('Video - PublishPress', 'advanced-gutenberg'),
    'advgb/columns' => __('Columns - PublishPress', 'advanced-gutenberg'),
    'advgb/column' => __('Column - PublishPress', 'advanced-gutenberg'),
    'advgb/contact-form' => __('Contact Form - PublishPress', 'advanced-gutenberg'),
    'advgb/count-up' => __('Count Up - PublishPress', 'advanced-gutenberg'),
    'advgb/images-slider' => __('Images Slider - PublishPress', 'advanced-gutenberg'),
    'advgb/infobox' => __('Info Box - PublishPress', 'advanced-gutenberg'),
    'advgb/map' => __('Map - PublishPress', 'advanced-gutenberg'),
    'advgb/newsletter' => __('Newsletter - PublishPress', 'advanced-gutenberg'),
    'advgb/social-links' => __('Social Links - PublishPress', 'advanced-gutenberg'),
    'advgb/summary' => __('Table of Contents - PublishPress', 'advanced-gutenberg'),
    'advgb/testimonial' => __('Testimonial - PublishPress', 'advanced-gutenberg'),
    'advgb/woo-products' => __('Woo Products - PublishPress', 'advanced-gutenberg')
];

// Short description of what each block does, shown as a hover tooltip
$block_descriptions = [
    'advgb/accordions'    => __('Show content in collapsible panels that expand when clicked.', 'advanced-gutenberg'),
    'advgb/button'        => __('Add a customizable call-to-action button with colors, sizes and icons.', 'advanced-gutenberg'),
    'advgb/icon'          => __('Insert a vector icon from a large library, with size and color controls.', 'advanced-gutenberg'),
    'advgb/image'         => __('Display an image with extra styling, captions and link options.', 'advanced-gutenberg'),
    'advgb/list'          => __('Build styled ordered or unordered lists with custom icons.', 'advanced-gutenberg'),
    'advgb/table'         => __('Create responsive tables with styling and per-cell formatting.', 'advanced-gutenberg'),
    'advgb/adv-tabs'      => __('Organize content into horizontal or vertical tabbed sections.', 'advanced-gutenberg'),
    'advgb/video'         => __('Embed a self-hosted or external video with a custom poster image.', 'advanced-gutenberg'),
    'advgb/columns'       => __('Lay out content in flexible, responsive multi-column rows.', 'advanced-gutenberg'),
    'advgb/column'        => __('A single column used inside the Columns block.', 'advanced-gutenberg'),
    'advgb/container'     => __('Wrap blocks in a styled container with background, padding and borders.', 'advanced-gutenberg'),
    'advgb/contact-form'  => __('Add a customizable contact form that emails submissions to you.', 'advanced-gutenberg'),
    'advgb/count-up'      => __('Animate numbers counting up to highlight stats and milestones.', 'advanced-gutenberg'),
    'advgb/images-slider' => __('Show multiple images in a responsive carousel slider.', 'advanced-gutenberg'),
    'advgb/infobox'       => __('Present an icon or image with a heading and text in a styled box.', 'advanced-gutenberg'),
    'advgb/map'           => __('Embed an interactive Google Map with custom markers.', 'advanced-gutenberg'),
    'advgb/newsletter'    => __('Collect email subscribers with a customizable signup form.', 'advanced-gutenberg'),
    'advgb/login-form'    => __('Display a front-end login and registration form.', 'advanced-gutenberg'),
    'advgb/search-bar'    => __('Add a styled site search bar anywhere on your pages.', 'advanced-gutenberg'),
    'advgb/social-links'  => __('Link to your social profiles with a row of social icons.', 'advanced-gutenberg'),
    'advgb/summary'       => __('Generate an automatic table of contents from your headings.', 'advanced-gutenberg'),
    'advgb/testimonial'   => __('Showcase customer testimonials with photo, name and role.', 'advanced-gutenberg'),
    'advgb/woo-products'  => __('Display WooCommerce products in a customizable grid.', 'advanced-gutenberg'),
    'advgb/countdown'     => __('Display a countdown timer to a specific date or event.', 'advanced-gutenberg'),
    'advgb/feature'       => __('Highlight a single feature with an icon, title and description.', 'advanced-gutenberg'),
    'advgb/pricing-table' => __('Compare pricing plans side by side with features and buttons.', 'advanced-gutenberg'),
];

// Pro
if (defined('ADVANCED_GUTENBERG_PRO_LOADED')) {
    if (method_exists('PPB_AdvancedGutenbergPro\Utils\Definitions', 'advgb_pro_default_block_settings')) {
        $excludedProBlocks = PPB_AdvancedGutenbergPro\Utils\Definitions::advgb_pro_default_block_settings('excluded_blocks');
        foreach ($excludedProBlocks as $excludedProBlock) {
            array_push(
                $excluded_blocks_config,
                $excludedProBlock
            );
        }
    }
}
?>
<div class="publishpress-admin wrap">
    <header>
        <h1 class="wp-heading-inline">
            <?php esc_html_e('Extra Blocks', 'advanced-gutenberg') ?>
        </h1>
    </header>
    <div class="wrap">
        <div class="advgb-search-wrapper" style="padding-bottom: 20px;">
            <input type="text"
                   class="advgb-search-input blocks-config-search"
                   placeholder="<?php esc_attr_e('Search blocks', 'advanced-gutenberg') ?>"
            >
        </div>
        <ul class="blocks-config-list clearfix">
            <?php foreach ($advgb_blocks as $block) : ?>
                <?php $iconColor = '';
                if (isset($block['iconColor'])) :
                    $iconColor = 'style="color:' . esc_attr($block['iconColor']) . '"';
                endif;

                // Use new block title
                if (isset($new_titles[$block['name']])) {
                    $block['title'] = $new_titles[$block['name']];
                }
                // Remove the " - PublishPress" suffix from block names
                $block['title'] = preg_replace('/\s*-?\s*PublishPress\s*$/', '', $block['title']);
                $blur_class = '';
                $isProPromo = false;
                if ($free_version && isset($block['isPro']) && $block['isPro'] ===  true) {
                    $blur_class = 'advgb-blur';
                    $isProPromo = true;
                }
                ?>
            <li class="block-config-item advgb-settings-option">
                <span class="block-icon <?php echo esc_attr($blur_class); ?>" <?php echo $iconColor ?>>
                    <?php echo html_entity_decode(html_entity_decode(stripslashes($block['icon']))); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- already escaped ?>
                </span>
                <span class="block-title  <?php echo esc_attr($blur_class); ?>"><?php echo esc_html(__($block['title'], 'advanced-gutenberg')); ?></span>
                <?php if (isset($block_descriptions[$block['name']])) : ?>
                    <span class="ppb-tooltips-library advgb-block-tooltip"
                          data-toggle="ppbtooltip"
                          data-placement="top">
                        <i class="dashicons dashicons-info-outline" aria-hidden="true"></i>
                        <span class="tooltip-text">
                            <?php echo esc_html($block_descriptions[$block['name']]); ?>
                        </span>
                    </span>
                <?php endif; ?>
                <?php if ($isProPromo) : ?>
                    <span class="advgb-pro-small-overlay-text" style="float: right;">
                        <a class="advgb-pro-link clickable" href="<?php echo esc_url(ADVANCED_GUTENBERG_UPGRADE_LINK); ?>" target="_blank">
                            <span class="dashicons dashicons-lock"></span> <?php esc_html_e('Pro', 'advanced-gutenberg') ?>
                        </a>
                    </span>
                <?php elseif (!in_array($block['name'], $excluded_blocks_config)) : ?>
                    <i class="dashicons dashicons-admin-generic block-config-button"
                    title="<?php esc_attr_e('Edit', 'advanced-gutenberg') ?>"
                    data-block="<?php echo esc_attr($block['name']); ?>"
                    ></i>
                <?php endif; ?>
            </li>
            <?php endforeach; ?>
        </ul>

        <?php if (count($advgb_blocks) === 0) : ?>
            <div class="blocks-not-loaded" style="text-align: center">
                <p>
                    <?php esc_html_e('No blocks available. Please go to a post edit (without saving either modifying anything). Then come back to Block Settings to see the blocks list.', 'advanced-gutenberg'); ?>
                </p>
            </div>
        <?php endif; ?>
    </div>
</div>

<style>
.advgb-block-tooltip {
    vertical-align: middle;
    margin-left: 6px;
    line-height: 30px;
}
.advgb-block-tooltip .dashicons-info-outline {
    color: #9fabba;
    font-size: 18px;
    width: 18px;
    height: 18px;
    line-height: 30px;
    transition: color .2s ease;
}
.advgb-block-tooltip:hover .dashicons-info-outline {
    color: #655997;
}
.advgb-block-tooltip .tooltip-text {
    font-weight: 400;
    line-height: 1.5;
}
</style>
