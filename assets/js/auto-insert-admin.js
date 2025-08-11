(function ($) {
    'use strict';

    $(document).ready(function () {
        initAutoInsertAdmin();
    });

    function initAutoInsertAdmin() {
        // taxonomy select2
        $('.advg-insert-taxonomy-select2').pp_select2({
            placeholder: $(this).data('placeholder'),
            allowClear: true,
            ajax: {
                url: ajaxurl,
                dataType: 'json',
                data: function (params) {
                    return {
                        action: 'advgb_search_taxonomy_terms',
                        taxonomy: $(this).data('taxonomy'),
                        search: params.term,
                        nonce: advgbAutoInsertI18n.nonce
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.success ? data.data : []
                    };
                },
                cache: true
            }
        });
        // author select2
        $('.advg-insert-author-select2').pp_select2({
            placeholder: $(this).data('placeholder'),
            allowClear: true,
            ajax: {
                url: ajaxurl,
                dataType: 'json',
                data: function (params) {
                    return {
                        action: 'advgb_insert_search_author',
                        search: params.term,
                        nonce: advgbAutoInsertI18n.nonce
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.success ? data.data : []
                    };
                },
                cache: true
            }
        });
        // block select2
        $('.advg-insert-block-select2').pp_select2({
            placeholder: $(this).data('placeholder'),
            allowClear: true,
            ajax: {
                url: ajaxurl,
                dataType: 'json',
                data: function (params) {
                    return {
                        action: 'advgb_insert_search_block',
                        search: params.term,
                        nonce: advgbAutoInsertI18n.nonce
                    };
                },
                processResults: function (data) {
                    return {
                        results: data.success ? data.data : []
                    };
                },
                cache: true
            }
        }).on('select2:select', function (e) {
            var data = e.params.data;

            var input = $('<input>', {
                type: 'hidden',
                name: 'advgb_blocks[' + data.id + ']',
                value: data.text,
                'data-block-id': data.id
            });

            $('.advg-insert-block-values').append(input);
        }).on('select2:unselect', function (e) {
            var data = e.params.data;

            $('.advg-insert-block-values').find('input[data-block-id="' + data.id + '"]').remove();
        });
        // other select2
        $('.advgb-editor-aib-select2').pp_select2();


        // Handle post type changes for taxonomy visibility
        $('.post-type-checkbox').on('change', toggleTaxonomyVisibility);

        // Handle position changes for showing/hiding options
        $('#advgb_position').on('change', togglePositionOptions);

        // Initialize on page load
        toggleTaxonomyVisibility();
        togglePositionOptions();
    }

    function toggleTaxonomyVisibility() {
        var selectedPostTypes = [];
        $('.post-type-checkbox:checked').each(function () {
            selectedPostTypes.push($(this).val());
        });

        $('.taxonomy-group').hide();

        if (selectedPostTypes.length > 0) {
            selectedPostTypes.forEach(function (postType) {
                $('.taxonomy-group.post-type-' + postType).show();
            });
        }
    }

    function togglePositionOptions() {
        var position = $('#advgb_position').val();

        if (['after_heading', 'before_heading', 'after_paragraph', 'before_paragraph', 'after_block', 'before_block', 'after_specific_block', 'before_specific_block'].includes(position)) {
            $('#position-value-row').show();
        } else {
            $('#position-value-row').hide();
        }

        if (position === 'after_block' || position === 'before_block') {
            $('#excluded-blocks-row').show();
        } else {
            $('#excluded-blocks-row').hide();
        }

        if (position === 'after_specific_block' || position === 'before_specific_block') {
            $('#specific-blocks-row').show();
        } else {
            $('#specific-blocks-row').hide();
        }

        if (! advgbAutoInsertI18n.proActive && !['beginning', 'end'].includes(position)) {
            $('.position-table-row .invalid-position').show();
            lockSaveButton(true);
        } else {
            $('.position-table-row .invalid-position').hide();
            lockSaveButton(false);
        }
    }

    function lockSaveButton(lock = true) {

    }

})(jQuery);