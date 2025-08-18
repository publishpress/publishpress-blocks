<?php
use PublishPress\Blocks\Utilities;

defined('ABSPATH') || die;

/**
 * Block styles functionality
 *
 * @since 3.4.0
 */
class AdvancedGutenbergBlockStyles
{
    public $proActive;

    /**
     * Default custom styles
     *
     * @var array   Default custom styles for first install
     */
    public static $default_custom_styles = array(
        0 => array(
            'id' => 1,
            'title' => 'Blue message',
            'name' => 'blue-message',
            'identifyColor' => '#3399ff',
            'css' => array(
                'background-color' => '#3399ff',
                'color' => '#ffffff',
                'text-shadow' => 'none',
                'font-size' => '16px',
                'line-height' => '24px',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'padding-left' => '10px'
            )
        ),
        1 => array(
            'id' => 2,
            'title' => 'Green message',
            'name' => 'green-message',
            'identifyColor' => '#8cc14c',
            'css' => array(
                'background-color' => '#8cc14c',
                'color' => '#ffffff',
                'text-shadow' => 'none',
                'font-size' => '16px',
                'line-height' => '24px',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'padding-left' => '10px'
            )
        ),
        2 => array(
            'id' => 3,
            'title' => 'Orange message',
            'name' => 'orange-message',
            'identifyColor' => '#faa732',
            'css' => array(
                'background-color' => '#faa732',
                'color' => '#ffffff',
                'text-shadow' => 'none',
                'font-size' => '16px',
                'line-height' => '24px',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'padding-left' => '10px'
            )
        ),
        3 => array(
            'id' => 4,
            'title' => 'Red message',
            'name' => 'red-message',
            'identifyColor' => '#da4d31',
            'css' => array(
                'background-color' => '#da4d31',
                'color' => '#ffffff',
                'text-shadow' => 'none',
                'font-size' => '16px',
                'line-height' => '24px',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'padding-left' => '10px'
            )
        ),
        4 => array(
            'id' => 5,
            'title' => 'Grey message',
            'name' => 'grey-message',
            'identifyColor' => '#53555c',
            'css' => array(
                'background-color' => '#53555c',
                'color' => '#ffffff',
                'text-shadow' => 'none',
                'font-size' => '16px',
                'line-height' => '24px',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'padding-left' => '10px'
            )
        ),
        5 => array(
            'id' => 6,
            'title' => 'Left block',
            'name' => 'left-block',
            'identifyColor' => '#ff00ff',
            'css' => array(
                'background' => 'radial-gradient(ellipse at center center, #ffffff 0%, #f2f2f2 100%)',
                'color' => '#8b8e97',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'padding-left' => '10px',
                'margin' => '10px',
                'margin-top' => '10px',
                'margin-right' => '10px',
                'margin-bottom' => '10px',
                'margin-left' => '10px',
                'float' => 'left'
            )
        ),
        6 => array(
            'id' => 7,
            'title' => 'Right block',
            'name' => 'right-block',
            'identifyColor' => '#00ddff',
            'css' => array(
                'background' => 'radial-gradient(ellipse at center center, #ffffff 0%, #f2f2f2 100%)',
                'color' => '#8b8e97',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'padding-left' => '10px',
                'margin' => '10px',
                'margin-top' => '10px',
                'margin-right' => '10px',
                'margin-bottom' => '10px',
                'margin-left' => '10px',
                'float' => 'right'
            )
        ),
        7 => array(
            'id' => 8,
            'title' => 'Blockquotes',
            'name' => 'blockquotes',
            'identifyColor' => '#cccccc',
            'css' => array(
                'background-color' => 'none',
                'border-left' => '5px solid #f1f1f1',
                'color' => '#8B8E97',
                'font-size' => '16px',
                'font-style' => 'italic',
                'line-height' => '22px',
                'padding-left' => '15px',
                'padding' => '10px',
                'padding-top' => '10px',
                'padding-right' => '10px',
                'padding-bottom' => '10px',
                'width' => '60%',
                'float' => 'left'
            )
        )
    );


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->proActive = Utilities::isProActive();

        $this->initHooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function initHooks()
    {
        add_action('wp_ajax_advgb_custom_styles_ajax', array($this, 'customStylesAjax'));
        add_action('blocks_page_advgb_custom_styles', array($this, 'advgb_custom_styles_save_page'));
    }


    /**
     * Redirect after saving custom styles page data
     * Name is build in registerMainMenu() > $function_name
     *
     * @return boolean true on success, false on failure
     * @since 3.0.0
     */
    public function advgb_custom_styles_save_page()
    {
        if (!current_user_can('activate_plugins')) {
            return false;
        }

        if (isset($_POST['save_custom_styles'])) { // phpcs:ignore WordPress.Security.NonceVerification.Missing -- we check nonce below
            if (
                !wp_verify_nonce(
                    sanitize_key($_POST['advgb_cstyles_nonce_field']),
                    'advgb_cstyles_nonce'
                )
            ) {
                return false;
            }

            if (isset($_REQUEST['_wp_http_referer'])) {
                wp_safe_redirect(
                    admin_url('admin.php?page=advgb_custom_styles&save=success')
                );
                exit;
            }
        }

        return true;
    }

    /**
     * Ajax for custom styles
     *
     * @return boolean,void     Return false if failure, echo json on success
     */
    public function customStylesAjax()
    {
        // Check users permissions
        if (!current_user_can('activate_plugins')) {
            wp_send_json(__('No permission!', 'advanced-gutenberg'), 403);
            return false;
        }

        $regex = '/^[a-zA-Z0-9_\-]+$/';

        if (!wp_verify_nonce(sanitize_text_field($_POST['nonce']), 'advgb_cstyles_nonce')) {
            wp_send_json(__('Invalid nonce token!', 'advanced-gutenberg'), 400);
        }

        $check_exist = get_option('advgb_custom_styles');
        if ($check_exist === false) {
            update_option('advgb_custom_styles', $this::$default_custom_styles, false);
        }

        $custom_style_data = get_option('advgb_custom_styles');
        $task = isset($_POST['task']) ? sanitize_text_field($_POST['task']) : '';
        $active_tab = isset($_POST['active_tab']) ? sanitize_text_field($_POST['active_tab']) : 'custom-css';

        if ($task === '') {
            return false;
        } elseif ($task === 'new') {
            $new_style_id = end($custom_style_data);
            $new_style_id = $new_style_id['id'] + 1;
            $new_style_array = array(
                'id' => $new_style_id,
                'title' => __('Style title', 'advanced-gutenberg') . ' ' . $new_style_id,
                'name' => 'new-class-' . rand(0, 99) . $new_style_id . rand(0, 99),
                'css' => [],
                'identifyColor' => '#000000',
                'active_tab' => $active_tab
            );
            array_push($custom_style_data, $new_style_array);
            update_option('advgb_custom_styles', $custom_style_data, false);
            wp_send_json($new_style_array);
        } elseif ($task === 'delete') {
            $custom_style_data_delete = get_option('advgb_custom_styles');
            $style_id = (int) $_POST['id'];
            $new_style_deleted_array = array();
            $done = false;
            foreach ($custom_style_data_delete as $data) {
                if ($data['id'] === $style_id) {
                    $done = true;
                    continue;
                }
                array_push($new_style_deleted_array, $data);
            }
            update_option('advgb_custom_styles', $new_style_deleted_array, false);
            if ($done) {
                wp_send_json(array('id' => $style_id), 200);
            }
        } elseif ($task === 'copy') {
            $data_saved = get_option('advgb_custom_styles');
            $style_id = (int) $_POST['id'];
            $new_style_copied_array = get_option('advgb_custom_styles');
            $copied_styles = [];
            $new_id = end($new_style_copied_array);

            foreach ($data_saved as $data) {
                if ($data['id'] === $style_id) {
                    $copied_styles = array(
                        'id' => $new_id['id'] + 1,
                        'title' => sanitize_text_field($data['title']) . ' ' . __('copy', 'advanced-gutenberg'),
                        'name' => sanitize_text_field($data['name']) . '-' . rand(0, 999),
                        'css' => is_array($data['css']) ? $data['css'] : self::css_string_to_array($data['css']),
                        'identifyColor' => sanitize_hex_color($data['identifyColor']),
                        'active_tab' => isset($data['active_tab']) ? $data['active_tab'] : $active_tab
                    );
                    array_push($new_style_copied_array, $copied_styles);
                }
            }
            update_option('advgb_custom_styles', $new_style_copied_array, false);
            wp_send_json($copied_styles);
        } elseif ($task === 'preview') {
            $style_id = (int) $_POST['id'];
            $data_saved = get_option('advgb_custom_styles');
            $get_style_array = array();

            foreach ($data_saved as $data) {
                if ($data['id'] === $style_id) {
                    $response = array(
                        'id' => $data['id'],
                        'title' => esc_html($data['title']),
                        'name' => esc_html($data['name']),
                        'css' => is_array($data['css']) ? self::css_array_to_string($data['css']) : esc_html($data['css']),
                        'identifyColor' => esc_html($data['identifyColor']),
                        'active_tab' => isset($data['active_tab']) ? $data['active_tab'] : 'custom-css'
                    );

                    if (is_array($data['css'])) {
                        $response['css_array'] = $data['css'];
                    }
                    wp_send_json($response);
                }
            }
            wp_send_json(false, 404);
        } elseif ($task === 'style_save') {
            $style_id = (int) $_POST['id'];
            $new_styletitle = sanitize_text_field($_POST['title']);
            $new_classname = sanitize_text_field($_POST['name']);
            $new_identify_color = sanitize_hex_color($_POST['mycolor']);

            // Handle both array and string CSS
            $new_css = array();
            if ($this->proActive && isset($_POST['css_array']) && is_array($_POST['css_array'])) {
                foreach ($_POST['css_array'] as $prop => $val) {
                    $new_css[sanitize_text_field($prop)] = sanitize_text_field($val);
                }
            } else {
                $new_css = wp_strip_all_tags($_POST['mycss']);
            }

            // Validate new name
            if (!preg_match($regex, $new_classname)) {
                wp_send_json(
                    'Please use valid characters for a CSS classname! As example: hyphen or underscore instead of empty spaces.',
                    403
                );
                return false;
            }

            $data_saved = get_option('advgb_custom_styles');
            $new_data_array = array();
            foreach ($data_saved as $data) {
                if ($data['id'] === $style_id) {
                    $data['title'] = $new_styletitle;
                    $data['name'] = $new_classname;
                    $data['css'] = $new_css;
                    $data['identifyColor'] = $new_identify_color;
                    $data['active_tab'] = $active_tab;
                }
                array_push($new_data_array, $data);
            }
            update_option('advgb_custom_styles', $new_data_array, false);
            wp_send_json(array('success' => true));
        } else {
            wp_send_json(null, 404);
        }
    }

    /**
     * Convert CSS array to CSS string
     */
    public static function css_array_to_string($css_array)
    {
        if (! is_array($css_array)) {
            return $css_array;
        }

        $css = '';
        foreach ($css_array as $property => $value) {
            // Handle special cases
            if ($property === 'background' && strpos($value, 'gradient') !== false) {
                $css .= "    background: {$value};\n";
            } else {
                $css .= "    {$property}: {$value};\n";
            }
        }

        return trim($css);
    }

    /**
     * Convert CSS string to CSS array
     */
    public static function css_string_to_array($css_string)
    {
        if (is_array($css_string)) {
            return $css_string;
        }

        $css_array = array();
        $declarations = explode(';', trim($css_string));

        foreach ($declarations as $declaration) {
            $declaration = trim($declaration);
            if (empty($declaration))
                continue;

            $parts = explode(':', $declaration, 2);
            if (count($parts) < 2)
                continue;

            $property = trim($parts[0]);
            $value = trim($parts[1]);

            // Handle shorthand properties
            if ($property === 'padding' || $property === 'margin') {
                $values = preg_split('/\s+/', $value);
                $css_array[$property . '-top'] = $values[0];
                $css_array[$property . '-right'] = isset($values[1]) ? $values[1] : $values[0];
                $css_array[$property . '-bottom'] = isset($values[2]) ? $values[2] : $values[0];
                $css_array[$property . '-left'] = isset($values[3]) ? $values[3] :
                    (isset($values[1]) ? $values[1] : $values[0]);
            }

            $css_array[$property] = $value;
        }

        return $css_array;
    }


    public static function generate_control_group($field, $property)
    {

        $proActive = Utilities::isProActive();

        $additional_class = '';
        if (! $proActive) {
            $additional_class = 'advgb-blur';

            if (isset($field_config['aliases'])) {
                unset($field_config['aliases']);
            }
            if (isset($field_config['special_values'])) {
                unset($field_config['special_values']);
            }
            $property = 'promo-' . rand(0, 99) . '_' . rand(0, 99);
        }

        if ($field['type'] == 'promo' && $proActive) {
            return;
        }

        $html = '';
        if ($field['type'] !== 'promo') {
            $html = '<div class="control-group '. esc_attr($additional_class) .'">';
            $html .= '<label>' . esc_html($field['label']) . '</label>';
        }

        $field_config = [
            'type' => $field['type'],
            'property' => $property
        ];

        if (isset($field['aliases'])) {
            $field_config['aliases'] = $field['aliases'];
        }

        if (isset($field['special_values'])) {
            $field_config['special_values'] = $field['special_values'];
        }

        switch ($field['type']) {
            case 'color':
                $html .= '<input type="text" class="minicolors style-input"
                        data-css-property="' . esc_attr($property) . '"
                        data-field-config="' . esc_attr(json_encode($field_config)) . '"';

                if (isset($field['special_values'])) {
                    $html .= ' data-special-values="' . esc_attr(json_encode($field['special_values'])) . '"';
                }
                $html .= ' />';
                break;

            case 'text':
                $html .= '<input type="text" class="style-input"
                        data-css-property="' . esc_attr($property) . '"
                        data-field-config="' . esc_attr(json_encode($field_config)) . '"';

                if (isset($field['placeholder'])) {
                    $html .= ' placeholder="' . esc_attr($field['placeholder']) . '"';
                }
                $html .= ' />';
                break;

            case 'number':
                $attrs = '';
                if (isset($field['min']))
                    $attrs .= ' min="' . esc_attr($field['min']) . '"';
                if (isset($field['max']))
                    $attrs .= ' max="' . esc_attr($field['max']) . '"';
                if (isset($field['step']))
                    $attrs .= ' step="' . esc_attr($field['step']) . '"';

                $html .= '<input type="number" class="style-input"
                        data-css-property="' . esc_attr($property) . '"
                        data-field-config="' . esc_attr(json_encode($field_config)) . '"';

                if (isset($field['unit'])) {
                    $html .= ' data-unit="' . esc_attr($field['unit']) . '"';
                    $field_config['unit'] = $field['unit'];
                }
                $html .= $attrs . ' />';
                break;

            case 'select':
                $html .= '<select class="style-input"
                        data-css-property="' . esc_attr($property) . '"
                        data-field-config="' . esc_attr(json_encode($field_config)) . '">';

                foreach ($field['options'] as $value => $label) {
                    $html .= '<option value="' . esc_attr($value) . '">' . esc_html($label) . '</option>';
                }
                $html .= '</select>';
                break;

            case 'promo':
                $html .= '<div class="advgb-pro-small-overlay-text">
                            <a class="advgb-pro-link" href="' . esc_url(ADVANCED_GUTENBERG_UPGRADE_LINK) .'" target="_blank">
                                <span class="dashicons dashicons-lock"></span> '. __('Pro feature', 'advanced-gutenberg') .'
                            </a>
                        </div>
                        ';
                break;
        }

        if ($field['type'] !== 'promo') {
            $html .= '</div>';
        }
        return $html;
    }

    public static function get_style_fields()
    {
        $felds = [
            'colors' => [
                'background-color' => [
                    'label' => __('Background Color', 'advanced-gutenberg'),
                    'type' => 'color',
                    'aliases' => ['background'],
                    'special_values' => ['none', 'transparent']
                ],
                /*'background' => [ // should background support gradients and not just color? Maybe use this optio instead.
                    'label' => __('Background', 'advanced-gutenberg'),
                    'type' => 'text',
                    'placeholder' => 'e.g. #fff or linear-gradient(...)',
                    'aliases' => ['background-color'],
                    'special_values' => ['none', 'transparent']
                ],*/
                'colors-promo' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                'color' => [
                    'label' => __('Text Color', 'advanced-gutenberg'),
                    'type' => 'color'
                ]
            ],
            'spacing' => [
                'padding' => [
                    'label' => __('Padding (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'padding-top' => [
                    'label' => __('Padding Top (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'padding-right' => [
                    'label' => __('Padding Right (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'padding-bottom' => [
                    'label' => __('Padding Bottom (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'spacing-promo-1' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                'padding-left' => [
                    'label' => __('Padding Left (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'margin' => [
                    'label' => __('Margin (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px'
                ],
                'margin-top' => [
                    'label' => __('Margin Top (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px'
                ],
                'margin-right' => [
                    'label' => __('Margin Right (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px'
                ],
                'margin-bottom' => [
                    'label' => __('Margin Bottom (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px'
                ],
                'margin-left' => [
                    'label' => __('Margin Left (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px'
                ],
                'border-width' => [
                    'label' => __('Border Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-top-width' => [
                    'label' => __('Border Top Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-right-width' => [
                    'label' => __('Border Right Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'spacing-promo-2' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                'border-bottom-width' => [
                    'label' => __('Border Bottom Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-left-width' => [
                    'label' => __('Border Left Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-radius' => [
                    'label' => __('Border Radius (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-top-left-radius' => [
                    'label' => __('Border Top Left Radius (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-top-right-radius' => [
                    'label' => __('Border Top Right Radius (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-bottom-right-radius' => [
                    'label' => __('Border Bottom Right Radius (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-bottom-left-radius' => [
                    'label' => __('Border Bottom Left Radius (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
            ],
            'typography' => [
                'font-family' => [
                    'label' => __('Font Family', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'Arial' => 'Arial',
                        'Helvetica' => 'Helvetica',
                        'Times New Roman' => 'Times New Roman',
                        'Courier New' => 'Courier New',
                        'Georgia' => 'Georgia',
                        'Verdana' => 'Verdana',
                        'system-ui' => 'System UI',
                        'inherit' => 'Inherit'
                    ]
                ],
                'font-size' => [
                    'label' => __('Font Size (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 8
                ],
                'font-style' => [
                    'label' => __('Font Style', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'normal' => __('Normal', 'advanced-gutenberg'),
                        'italic' => __('Italic', 'advanced-gutenberg'),
                        'oblique' => __('Oblique', 'advanced-gutenberg')
                    ]
                ],
                'typography-promo-1' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                'font-weight' => [
                    'label' => __('Font Weight', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'normal' => __('Normal', 'advanced-gutenberg'),
                        'bold' => __('Bold', 'advanced-gutenberg'),
                        'lighter' => __('Lighter', 'advanced-gutenberg'),
                        '100' => '100',
                        '200' => '200',
                        '300' => '300',
                        '400' => '400',
                        '500' => '500',
                        '600' => '600',
                        '700' => '700',
                        '800' => '800',
                        '900' => '900'
                    ]
                ],
                'line-height' => [
                    'label' => __('Line Height', 'advanced-gutenberg'),
                    'type' => 'number',
                    'step' => 0.1,
                    'min' => 0.5,
                    'unit' => 'px'
                ],
                'letter-spacing' => [
                    'label' => __('Letter Spacing (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px'
                ],
                'text-align' => [
                    'label' => __('Text Align', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'left' => __('Left', 'advanced-gutenberg'),
                        'center' => __('Center', 'advanced-gutenberg'),
                        'right' => __('Right', 'advanced-gutenberg'),
                        'justify' => __('Justify', 'advanced-gutenberg')
                    ]
                ],
                'typography-promo-2' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                'text-decoration' => [
                    'label' => __('Text Decoration', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'none' => __('None', 'advanced-gutenberg'),
                        'underline' => __('Underline', 'advanced-gutenberg'),
                        'overline' => __('Overline', 'advanced-gutenberg'),
                        'line-through' => __('Line Through', 'advanced-gutenberg')
                    ]
                ],
                'text-transform' => [
                    'label' => __('Text Transform', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'none' => __('None', 'advanced-gutenberg'),
                        'capitalize' => __('Capitalize', 'advanced-gutenberg'),
                        'uppercase' => __('Uppercase', 'advanced-gutenberg'),
                        'lowercase' => __('Lowercase', 'advanced-gutenberg')
                    ]
                ],
                'text-shadow' => [
                    'label' => __('Text Shadow', 'advanced-gutenberg'),
                    'type' => 'text',
                    'placeholder' => 'e.g. 1px 1px 2px #000'
                ]
            ],
            'layout' => [
                'display' => [
                    'label' => __('Display', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'block' => __('Block', 'advanced-gutenberg'),
                        'inline' => __('Inline', 'advanced-gutenberg'),
                        'inline-block' => __('Inline Block', 'advanced-gutenberg'),
                        'flex' => __('Flex', 'advanced-gutenberg'),
                        'grid' => __('Grid', 'advanced-gutenberg'),
                        'none' => __('None', 'advanced-gutenberg')
                    ]
                ],
                'position' => [
                    'label' => __('Position', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'static' => __('Static', 'advanced-gutenberg'),
                        'relative' => __('Relative', 'advanced-gutenberg'),
                        'absolute' => __('Absolute', 'advanced-gutenberg'),
                        'fixed' => __('Fixed', 'advanced-gutenberg'),
                        'sticky' => __('Sticky', 'advanced-gutenberg')
                    ]
                ],
                'width' => [
                    'label' => __('Width (%)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => '%',
                    'min' => 0,
                    'max' => 100
                ],
                'layout-promo-1' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                'height' => [
                    'label' => __('Height (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'max-width' => [
                    'label' => __('Max Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'min-width' => [
                    'label' => __('Min Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'max-height' => [
                    'label' => __('Max Height (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'min-height' => [
                    'label' => __('Min Height (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'float' => [
                    'label' => __('Float', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('None', 'advanced-gutenberg'),
                        'left' => __('Left', 'advanced-gutenberg'),
                        'right' => __('Right', 'advanced-gutenberg')
                    ]
                ],
                'layout-promo-2' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                'clear' => [
                    'label' => __('Clear', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('None', 'advanced-gutenberg'),
                        'left' => __('Left', 'advanced-gutenberg'),
                        'right' => __('Right', 'advanced-gutenberg'),
                        'both' => __('Both', 'advanced-gutenberg')
                    ]
                ],
                'overflow' => [
                    'label' => __('Overflow', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'visible' => __('Visible', 'advanced-gutenberg'),
                        'hidden' => __('Hidden', 'advanced-gutenberg'),
                        'scroll' => __('Scroll', 'advanced-gutenberg'),
                        'auto' => __('Auto', 'advanced-gutenberg')
                    ]
                ],
                'z-index' => [
                    'label' => __('Z-Index', 'advanced-gutenberg'),
                    'type' => 'number'
                ],
            ],
            'border' => [
                // Left Border Components
                'border-left-width' => [
                    'label' => __('Left Border Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-left-style' => [
                    'label' => __('Left Border Style', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'none' => __('None', 'advanced-gutenberg'),
                        'solid' => __('Solid', 'advanced-gutenberg'),
                        'dashed' => __('Dashed', 'advanced-gutenberg'),
                        'dotted' => __('Dotted', 'advanced-gutenberg'),
                        'double' => __('Double', 'advanced-gutenberg')
                    ]
                ],
                'border-left-color' => [
                    'label' => __('Left Border Color', 'advanced-gutenberg'),
                    'type' => 'color'
                ],
                'border-promo-1' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                // Right Border Components
                'border-right-width' => [
                    'label' => __('Right Border Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-right-style' => [
                    'label' => __('Right Border Style', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'none' => __('None', 'advanced-gutenberg'),
                        'solid' => __('Solid', 'advanced-gutenberg'),
                        'dashed' => __('Dashed', 'advanced-gutenberg'),
                        'dotted' => __('Dotted', 'advanced-gutenberg'),
                        'double' => __('Double', 'advanced-gutenberg')
                    ]
                ],
                'border-right-color' => [
                    'label' => __('Right Border Color', 'advanced-gutenberg'),
                    'type' => 'color'
                ],
                // Top Border Components
                'border-top-width' => [
                    'label' => __('Top Border Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-top-style' => [
                    'label' => __('Top Border Style', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'none' => __('None', 'advanced-gutenberg'),
                        'solid' => __('Solid', 'advanced-gutenberg'),
                        'dashed' => __('Dashed', 'advanced-gutenberg'),
                        'dotted' => __('Dotted', 'advanced-gutenberg'),
                        'double' => __('Double', 'advanced-gutenberg')
                    ]
                ],
                'border-top-color' => [
                    'label' => __('Top Border Color', 'advanced-gutenberg'),
                    'type' => 'color'
                ],
                'border-promo-2' => [
                    'label' => '',
                    'type' => 'promo'
                ],
                // Bottom Border Components
                'border-bottom-width' => [
                    'label' => __('Bottom Border Width (px)', 'advanced-gutenberg'),
                    'type' => 'number',
                    'unit' => 'px',
                    'min' => 0
                ],
                'border-bottom-style' => [
                    'label' => __('Bottom Border Style', 'advanced-gutenberg'),
                    'type' => 'select',
                    'options' => [
                        '' => __('Default', 'advanced-gutenberg'),
                        'none' => __('None', 'advanced-gutenberg'),
                        'solid' => __('Solid', 'advanced-gutenberg'),
                        'dashed' => __('Dashed', 'advanced-gutenberg'),
                        'dotted' => __('Dotted', 'advanced-gutenberg'),
                        'double' => __('Double', 'advanced-gutenberg')
                    ]
                ],
                'border-bottom-color' => [
                    'label' => __('Bottom Border Color', 'advanced-gutenberg'),
                    'type' => 'color'
                ],
            ],
        ];

        return $felds;
    }
}