<?php

defined('ABSPATH') || die;

$legacy_map   = AdvancedGutenbergMain::legacyBlocksMap();
$legacy_state = AdvancedGutenbergMain::getLegacyBlocksState();
?>
<form method="post">
    <?php
    wp_nonce_field('advgb_settings_legacy_nonce', 'advgb_settings_legacy_nonce_field') ?>

    <p class="description" style="margin: 12px 0;">
        <?php esc_html_e(
            'These older blocks are turned off by default on new sites. Enable any you want to use in the editor.',
            'advanced-gutenberg'
        ) ?>
    </p>

    <table class="form-table">
        <?php foreach ($legacy_map as $slug => $label) : ?>
            <tr>
                <th scope="row">
                    <?php echo esc_html($label) ?>
                </th>
                <td>
                    <label>
                        <input type="checkbox"
                               name="advgb_legacy_blocks[<?php echo esc_attr($slug) ?>]"
                               id="advgb_legacy_block_<?php echo esc_attr($slug) ?>"
                               value="1"
                            <?php checked(! empty($legacy_state[$slug])) ?>
                        />
                        <?php
                        /* translators: %s: block name */
                        printf(esc_html__('Enable the %s block', 'advanced-gutenberg'), esc_html($label)) ?>
                    </label>
                </td>
            </tr>
        <?php endforeach ?>
    </table>

    <div class="advgb-form-buttons-bottom">
        <button type="submit"
                class="button button-primary"
                name="save_settings_legacy"
        >
            <?php esc_html_e('Save Legacy Settings', 'advanced-gutenberg') ?>
        </button>
    </div>
</form>
