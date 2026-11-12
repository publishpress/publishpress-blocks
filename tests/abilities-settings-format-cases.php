<?php

/** Native settings choices, empty values and exact JSON transport types. */
$check($settings['settings']->gallery_lightbox_caption === 1, 'Gallery caption default matches native Settings');
$thumb = $call('get-feature-settings', ['feature' => 'content-display-thumbnail']);
$check(!is_wp_error($thumb) && strpos($thumb['settings']->url, 'recent-post-default.png') !== false, 'Thumbnail default matches native block settings');
foreach (['', 'light', 'dark', 'invisible'] as $theme) {
    $saved = $call('update-feature-settings', ['feature' => 'recaptcha', 'settings' => ['recaptcha_theme' => $theme]]);
    $check(!is_wp_error($saved) && $saved['settings']->recaptcha_theme === $theme, 'Native reCAPTCHA theme round-trip: ' . $theme);
}
foreach (['contact_form_sender_email', 'contact_form_email_receiver'] as $field) {
    foreach (['fixture@example.org', ''] as $email) {
        $saved = $call('update-feature-settings', ['feature' => 'form-email', 'settings' => [$field => $email]]);
        $check(!is_wp_error($saved) && $saved['settings']->$field === $email, 'Form email supports native empty and populated values');
    }
}
$saved = $call('update-feature-settings', ['feature' => 'content-display-thumbnail', 'settings' => ['id' => 0, 'url' => '']]);
$check(!is_wp_error($saved) && $saved['settings']->url === '', 'Thumbnail can be cleared with native empty values');
foreach ([['feature' => 'form-email', 'settings' => ['contact_form_sender_name' => 123]],
    ['feature' => 'recaptcha', 'settings' => ['recaptcha_language' => 123]],
    ['feature' => 'content-display-thumbnail', 'settings' => ['id' => '0']],
    ['feature' => 'recaptcha', 'settings' => ['recaptcha_enable' => 'false']],
    ['feature' => 'recaptcha', 'settings' => ['recaptcha_theme' => 'missing']],
    ['feature' => 'form-email', 'settings' => ['contact_form_sender_email' => 'bad-email']]] as $input) {
    $before = [get_option('advgb_email_sender'), get_option('advgb_recaptcha_config'), get_option('advgb_settings')];
    $check(is_wp_error($call('update-feature-settings', $input)), 'Malformed feature setting types/choices are rejected');
    $check($before === [get_option('advgb_email_sender'), get_option('advgb_recaptcha_config'), get_option('advgb_settings')], 'Invalid feature settings save nothing');
}
foreach ((array) $settings['fields'] as $field => $schema) {
    foreach ($schema['type'] === 'boolean' ? [true, false] : ($schema['type'] === 'integer' ? [0, 1, 2] : ['#112233']) as $value) {
        $saved = $call('update-plugin-settings', ['settings' => [$field => $value]]);
        $check(!is_wp_error($saved) && $saved['settings']->$field === $value, $field . ' native settings round-trip');
    }
}
// Restore feature switches before the rest of the permission and content scenarios.
$call('update-plugin-settings', ['settings' => array_fill_keys(array_keys(array_filter((array) $settings['fields'], static function ($field) { return $field['type'] === 'boolean'; })), true)]);
