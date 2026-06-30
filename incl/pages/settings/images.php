<?php

defined('ABSPATH') || die;

$gallery_lightbox_caption = $this->getOptionSetting('advgb_settings', 'gallery_lightbox_caption', 'text', '1');
$gallery_lightbox_checked = $this->getOptionSetting('advgb_settings', 'gallery_lightbox', 'checkbox', 1);

?>
<form method="post">
    <?php
    wp_nonce_field('advgb_settings_images_nonce', 'advgb_settings_images_nonce_field') ?>
    <table class="form-table">
        <tr>
            <th scope="row">
                <?php
                _e('Open galleries in lightbox', 'advanced-gutenberg') ?>
            </th>
            <td>
                <label>
                    <input type="checkbox" name="gallery_lightbox"
                           id="gallery_lightbox"
                           value="1"
                        <?php
                        echo esc_attr($gallery_lightbox_checked) ?>
                    />
                    <?php
                    _e(
                        'Open gallery images as a lightbox style popup',
                        'advanced-gutenberg'
                    )
                    ?>
                </label>
            </td>
        </tr>
        <tr>
            <th scope="row">
                <?php
                _e('Image caption', 'advanced-gutenberg') ?>
            </th>
            <td>
                <label>
                    <select name="gallery_lightbox_caption" id="gallery_lightbox_caption">
                        <option value="0"<?php
                        echo ( $gallery_lightbox_caption === '0' || $gallery_lightbox_caption === 0 ) ? ' selected' : '' ?>>
                            <?php
                            esc_html_e('Disabled', 'advanced-gutenberg'); ?>
                        </option>
                        <option value="1"<?php
                        echo ( $gallery_lightbox_caption === '1' || $gallery_lightbox_caption === 1 ) ? ' selected' : '' ?>>
                            <?php
                            esc_html_e('Bottom', 'advanced-gutenberg'); ?>
                        </option>
                        <option value="2"<?php
                        echo ( $gallery_lightbox_caption === '2' || $gallery_lightbox_caption === 2 ) ? ' selected' : '' ?>>
                            <?php
                            esc_html_e('Overlay', 'advanced-gutenberg'); ?>
                        </option>
                    </select>
                </label>
                <p class="description">
                    <?php
                    _e(
                        'Display caption text on images loaded as lightbox in galleries.',
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
                name="save_settings_images"
        >
            <?php
            esc_html_e('Save Image Settings', 'advanced-gutenberg') ?>
        </button>
    </div>
</form>
