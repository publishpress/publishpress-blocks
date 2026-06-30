<?php

defined('ABSPATH') || die;

wp_enqueue_media(); // We require this for "Default thumbnail" setting

$settings      = get_option('advgb_settings');
$default_thumb = ADVANCED_GUTENBERG_PLUGIN_DIR_URL . 'assets/blocks/recent-posts/recent-post-default.png';

$rp_default_thumb = isset($settings['rp_default_thumb'])
    ? $settings['rp_default_thumb']
    : [ 'url' => $default_thumb, 'id' => 0 ];
?>
<form method="post">
    <?php
    wp_nonce_field('advgb_settings_content_display_nonce', 'advgb_settings_content_display_nonce_field') ?>
    <table class="form-table">
        <tr>
            <th scope="row">
                <?php _e('Default thumbnail', 'advanced-gutenberg') ?>
            </th>
            <td>
                <div class="setting-actions-wrapper">
                    <input type="hidden" id="post_default_thumb" name="post_default_thumb" value="<?php
                    echo esc_attr($rp_default_thumb['url']); ?>"/>
                    <input type="hidden" id="post_default_thumb_id" name="post_default_thumb_id" value="<?php
                    echo esc_attr($rp_default_thumb['id']); ?>"/>
                    <div class="setting-actions" id="post_default_thumb_actions">
                        <img class="thumb-selected"
                             src="<?php
                                echo esc_url($rp_default_thumb['url']); ?>"
                             alt="thumb"
                             data-default="<?php
                                echo esc_url($default_thumb); ?>"
                        />
                        <i class="dashicons dashicons-edit" id="thumb_edit" title="<?php
                        esc_attr_e('Edit', 'advanced-gutenberg'); ?>"></i>
                        <i class="dashicons dashicons-no" id="thumb_remove" title="<?php
                        esc_attr_e('Reset to default', 'advanced-gutenberg'); ?>"></i>
                    </div>
                </div>
                <p class="description">
                    <?php
                    _e(
                        'Set the default post thumbnail to use in Content Display blocks for posts without featured image.',
                        'advanced-gutenberg'
                    )
                    ?>
                </p>
            </td>
        </tr>
    </table>

    <div class="advgb-form-buttons-bottom">
        <button type="submit"
                class="button button-primary"
                name="save_settings_content_display"
        >
            <?php
            esc_html_e('Save Content Display Settings', 'advanced-gutenberg') ?>
        </button>
    </div>
</form>
