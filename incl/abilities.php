<?php
/**
 * Read-only WordPress Abilities API integration for PublishPress Blocks.
 */

defined('ABSPATH') || die;

// WordPress 6.9 introduced the Abilities API. Keep older supported sites working.
if (!function_exists('wp_register_ability')) {
    return;
}

class PublishPressBlocksAbilities
{
    const CATEGORY = 'publishpress-blocks';

    public static function init()
    {
        add_action('wp_abilities_api_categories_init', [__CLASS__, 'registerCategory']);
        add_action('wp_abilities_api_init', [__CLASS__, 'registerAbilities']);
    }

    public static function registerCategory()
    {
        wp_register_ability_category(self::CATEGORY, [
            'label'       => __('PublishPress Blocks', 'advanced-gutenberg'),
            'description' => __('Inspect PublishPress Blocks configuration without changing site content or settings.', 'advanced-gutenberg'),
        ]);
    }

    public static function registerAbilities()
    {
        wp_register_ability('publishpress-blocks/list-block-types', self::abilityArgs(
            __('List PublishPress Block Types', 'advanced-gutenberg'),
            __('Lists registered PublishPress Blocks block types and their editor metadata.', 'advanced-gutenberg'),
            self::emptyInputSchema(),
            self::arrayOutputSchema('blocks'),
            [__CLASS__, 'listBlockTypes'],
            [__CLASS__, 'canManageOptions']
        ));

        wp_register_ability('publishpress-blocks/get-block-configuration', self::abilityArgs(
            __('Get Block Configuration', 'advanced-gutenberg'),
            __('Gets saved default configuration for PublishPress Blocks block types.', 'advanced-gutenberg'),
            self::emptyInputSchema(),
            self::objectOutputSchema('configuration'),
            [__CLASS__, 'getBlockConfiguration'],
            [__CLASS__, 'canManageOptions']
        ));

        wp_register_ability('publishpress-blocks/list-control-presets', self::abilityArgs(
            __('List Block Control Presets', 'advanced-gutenberg'),
            __('Lists saved PublishPress Blocks visibility-control presets.', 'advanced-gutenberg'),
            self::emptyInputSchema(),
            self::arrayOutputSchema('presets'),
            [__CLASS__, 'listControlPresets'],
            [__CLASS__, 'canManageOptions']
        ));

        wp_register_ability('publishpress-blocks/list-custom-styles', self::abilityArgs(
            __('List Custom Block Styles', 'advanced-gutenberg'),
            __('Lists saved PublishPress Blocks custom styles.', 'advanced-gutenberg'),
            self::emptyInputSchema(),
            self::arrayOutputSchema('styles'),
            [__CLASS__, 'listCustomStyles'],
            [__CLASS__, 'canManageOptions']
        ));

        wp_register_ability('publishpress-blocks/list-auto-insert-rules', self::abilityArgs(
            __('List Auto Insert Rules', 'advanced-gutenberg'),
            __('Lists Auto Insert Block rules and their targeting metadata.', 'advanced-gutenberg'),
            self::emptyInputSchema(),
            self::arrayOutputSchema('rules'),
            [__CLASS__, 'listAutoInsertRules'],
            [__CLASS__, 'canManageOptions']
        ));

        wp_register_ability('publishpress-blocks/inspect-post-blocks', self::abilityArgs(
            __('Inspect Post Blocks', 'advanced-gutenberg'),
            __('Returns a compact, ordered inventory of blocks in one editable post without returning block content.', 'advanced-gutenberg'),
            [
                'type'                 => 'object',
                'properties'           => [
                    'post_id' => ['type' => 'integer', 'minimum' => 1],
                ],
                'required'             => ['post_id'],
                'additionalProperties' => false,
            ],
            self::arrayOutputSchema('blocks'),
            [__CLASS__, 'inspectPostBlocks'],
            [__CLASS__, 'canInspectPostBlocks']
        ));
    }

    private static function abilityArgs($label, $description, $inputSchema, $outputSchema, $callback, $permissionCallback)
    {
        return [
            'label'               => $label,
            'description'         => $description,
            'category'            => self::CATEGORY,
            'input_schema'        => $inputSchema,
            'output_schema'       => $outputSchema,
            'execute_callback'    => $callback,
            'permission_callback' => $permissionCallback,
            'meta'                => [
                'show_in_rest' => true,
                'mcp'          => ['public' => true],
                'annotations'  => [
                    'readonly'    => true,
                    'destructive' => false,
                    'idempotent'  => true,
                ],
            ],
        ];
    }

    private static function emptyInputSchema()
    {
        return [
            'type'                 => 'object',
            'properties'           => [],
            'additionalProperties' => false,
        ];
    }

    private static function arrayOutputSchema($property)
    {
        return [
            'type'       => 'object',
            'properties' => [
                $property => [
                    'type'  => 'array',
                    'items' => ['type' => 'object'],
                ],
            ],
        ];
    }

    private static function objectOutputSchema($property)
    {
        return [
            'type'       => 'object',
            'properties' => [
                $property => ['type' => 'object'],
            ],
        ];
    }

    public static function canManageOptions()
    {
        return current_user_can('manage_options');
    }

    public static function canInspectPostBlocks($input = [])
    {
        $postId = isset($input['post_id']) ? absint($input['post_id']) : 0;

        return $postId && current_user_can('edit_post', $postId);
    }

    public static function listBlockTypes()
    {
        $registry = WP_Block_Type_Registry::get_instance();
        $blocks   = [];

        foreach ($registry->get_all_registered() as $name => $block) {
            if (strpos($name, 'advgb/') !== 0) {
                continue;
            }

            $blocks[] = [
                'name'        => $name,
                'title'       => isset($block->title) ? (string) $block->title : $name,
                'description' => isset($block->description) ? (string) $block->description : '',
                'category'    => isset($block->category) ? (string) $block->category : '',
                'supports'    => isset($block->supports) && is_array($block->supports) ? $block->supports : [],
            ];
        }

        return ['blocks' => $blocks];
    }

    public static function getBlockConfiguration()
    {
        $configuration = get_option('advgb_blocks_default_config', []);

        return ['configuration' => is_array($configuration) ? $configuration : []];
    }

    public static function listControlPresets()
    {
        $storedPresets = get_option('advgb_block_control_presets', []);
        $presets       = [];

        foreach ((array) $storedPresets as $id => $preset) {
            if (!is_array($preset)) {
                continue;
            }

            $preset['id'] = (string) $id;
            $presets[]    = $preset;
        }

        return ['presets' => $presets];
    }

    public static function listCustomStyles()
    {
        $styles = get_option('advgb_custom_styles', []);

        return ['styles' => is_array($styles) ? array_values($styles) : []];
    }

    public static function listAutoInsertRules()
    {
        $rules  = get_posts([
            'post_type'      => 'advgb_insert_block',
            'post_status'    => 'any',
            'posts_per_page' => 100,
            'orderby'        => 'ID',
            'order'          => 'ASC',
        ]);
        $result = [];

        foreach ($rules as $rule) {
            $result[] = [
                'id'                => (int) $rule->ID,
                'title'             => (string) $rule->post_title,
                'status'            => (string) $rule->post_status,
                'block_id'          => (int) get_post_meta($rule->ID, '_advgb_block_id', true),
                'position'          => (string) get_post_meta($rule->ID, '_advgb_position', true),
                'position_value'    => get_post_meta($rule->ID, '_advgb_position_value', true),
                'priority'          => (int) get_post_meta($rule->ID, '_advgb_priority', true),
                'post_types'        => (array) get_post_meta($rule->ID, '_advgb_post_types', true),
                'taxonomies'        => (array) get_post_meta($rule->ID, '_advgb_taxonomies', true),
                'authors'           => array_map('absint', (array) get_post_meta($rule->ID, '_advgb_authors', true)),
                'post_ids'          => array_map('absint', (array) get_post_meta($rule->ID, '_advgb_post_ids', true)),
                'exclude_post_ids'  => array_map('absint', (array) get_post_meta($rule->ID, '_advgb_exclude_post_ids', true)),
            ];
        }

        return ['rules' => $result];
    }

    public static function inspectPostBlocks($input = [])
    {
        $postId = isset($input['post_id']) ? absint($input['post_id']) : 0;
        $post   = $postId ? get_post($postId) : false;

        if (!$post) {
            return new WP_Error(
                'publishpress_blocks_post_not_found',
                __('Post not found.', 'advanced-gutenberg'),
                ['status' => 404]
            );
        }

        $blocks = [];
        self::collectBlocks(parse_blocks($post->post_content), $blocks);

        return ['blocks' => $blocks];
    }

    private static function collectBlocks($parsedBlocks, &$blocks, $depth = 0)
    {
        foreach ($parsedBlocks as $block) {
            if (empty($block['blockName'])) {
                if (!empty($block['innerBlocks'])) {
                    self::collectBlocks($block['innerBlocks'], $blocks, $depth);
                }
                continue;
            }

            $blocks[] = [
                'name'       => (string) $block['blockName'],
                'depth'      => (int) $depth,
                'attributes' => isset($block['attrs']) && is_array($block['attrs']) ? $block['attrs'] : [],
            ];

            if (!empty($block['innerBlocks'])) {
                self::collectBlocks($block['innerBlocks'], $blocks, $depth + 1);
            }
        }
    }
}

PublishPressBlocksAbilities::init();
