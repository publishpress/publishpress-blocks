jQuery(document).ready(function ($) {

    var activeTab = localStorage.getItem('advgb_active_tab') || 'custom-css';
    var myCssArea, myEditor, myCustomCss, myStyleId;

    // Initialize UI
    function initUI() {
        // Set active tab
        $('.advgb-main-tabs .advgb-tab').removeClass('active');
        $('.advgb-main-tabs .advgb-tab[data-tab="' + activeTab + '"]').addClass('active');
        $('.advgb-tab-content.main-tab-content').hide();
        $('[data-tab-content="' + activeTab + '"]').show();

        if (activeTab === 'style-editor' && !advgbCustomStyles.isProActive) {
            $('#save_custom_styles').prop('disabled', true);
        } else {
            $('#save_custom_styles').prop('disabled', false);
        }
    }
    // Initialize other UI elements
    initCustomStyleMenu();
    initColorPickers();
    bindTabEvents();
    setupLivePreview();

    // Initialize color pickers
    function initColorPickers() {
        $('.minicolors').each(function () {
            if (!$(this).data('minicolors-initialized')) {
                $(this).minicolors({
                    theme: 'bootstrap',
                    change: function (value, opacity) {
                        updateCSSFromUI();
                    }
                });
                $(this).data('minicolors-initialized', true);
            }
        });
    }

    // Clear all fields
    function clearAllFields() {
        // Clear regular inputs
        $('.style-input').val('');

        // Clear minicolors
        $('.minicolors').each(function () {
            if ($(this).data('minicolors-initialized')) {
                $(this).minicolors('value', '');
            } else {
                $(this).val('');
            }
        });

        // Clear editor
        if (typeof myEditor !== 'undefined') {
            myEditor.setValue('');
            myEditor.refresh();
        }
    }

    // Bind tab events
    function bindTabEvents() {

        // Parent Tab switching functionality
        $(document).on('click', '.advgb-main-tabs .advgb-tabs-panel .advgb-tab', function (e) {
            e.preventDefault();
            activeTab = $(this).data('tab');
            localStorage.setItem('advgb_active_tab', activeTab);
            initUI();
            // Refresh CodeMirror when switching to CSS tab
            if (activeTab === 'custom-css' && typeof myEditor !== 'undefined') {
                myEditor.refresh();
            }

            if (activeTab === 'style-editor' && !advgbCustomStyles.isProActive) {
                $('#save_custom_styles').prop('disabled', true);
            } else {
                $('#save_custom_styles').prop('disabled', false);
            }
        });

        // Editor Tab switching functionality
        $(document).on('click', '.advgb-sub-tabs .advgb-tabs-panel .advgb-tab', function (e) {
            e.preventDefault();

            var tabId = $(this).data('tab');
            var tabWrap = $(this).closest('.advgb-tabs-panel');

            // Remove active class from all tabs and content
            tabWrap.find('.advgb-tab').removeClass('active');
            $('.advgb-tab-content.sub-tab-content').hide();

            // Add active class to clicked tab and corresponding content
            $(this).addClass('active');
            $('[data-tab-content="' + tabId + '"]').show();
        });
    }

    // Update CSS from UI fields
    function updateCSSFromUI() {
        if (activeTab !== 'style-editor' || !advgbCustomStyles.isProActive) {
            return;
        }

        var cssArray = {};
        $('.style-input').each(function () {
            var $input = $(this);
            var prop = $input.data('css-property');
            var val = $input.val();

            if (val) {
                if ($input.data('unit') && !isNaN(val)) {
                    val += $input.data('unit');
                }
                cssArray[prop] = val;
            }
        });

        // Convert to CSS string for editor
        var cssString = '';
        for (var prop in cssArray) {
            cssString += '    ' + prop + ': ' + cssArray[prop] + ';\n';
        }

        // Update editor
        if (typeof myEditor !== 'undefined') {
            myEditor.setValue('{\n' + cssString + '\n}');
            myEditor.refresh();
        }
    }

    // Populate UI fields from CSS
    function populateUIFields(cssArray) {
        if (!advgbCustomStyles.isProActive) {
            return;
        }

        if (!cssArray) {
            clearAllFields();
            return;
        }

        // Convert string to array if needed
        if (typeof cssArray === 'string') {
            cssArray = parseCSSString(cssArray);
        }

        // Handle border shorthands
        for (var prop in cssArray) {
            if (prop.match(/^border-(top|right|bottom|left)$/) && !prop.includes('-width') &&
                !prop.includes('-style') && !prop.includes('-color')) {
                var borderParts = cssArray[prop].split(/\s+/);
                if (borderParts.length >= 3) {
                    var side = prop.split('-')[1];
                    setInputValue($(`[data-css-property="border-${side}-width"]`), borderParts[0]);
                    setInputValue($(`[data-css-property="border-${side}-style"]`), borderParts[1]);
                    setInputValue($(`[data-css-property="border-${side}-color"]`), borderParts[2]);
                }
            }
        }

        // Second pass - handle all other properties
        for (var prop in cssArray) {
            // Skip if already processed as border shorthand
            if (prop.match(/^border-(top|right|bottom|left)$/)) continue;
            // Handle padding shorthand
            if (prop === 'padding') {
                // Only expand if no individual sides are set
                var hasPaddingSides = ['top', 'right', 'bottom', 'left'].some(function (side) {
                    return $('[data-css-property="padding-' + side + '"]').val() !== '';
                });

                if (!hasPaddingSides) {
                    expandShorthandProperty(prop, cssArray[prop]);
                }
                continue;
            }

            // Handle margin shorthand
            if (prop === 'margin') {
                var hasMarginSides = ['top', 'right', 'bottom', 'left'].some(function (side) {
                    return $('[data-css-property="margin-' + side + '"]').val() !== '';
                });

                if (!hasMarginSides) {
                    expandShorthandProperty(prop, cssArray[prop]);
                }
                continue;
            }

            // Handle border shorthand (e.g., border-left: 1px solid #000)
            if (prop.match(/^border-(top|right|bottom|left)$/)) {
                var side = prop.split('-')[1];
                var hasBorderComponents = ['width', 'style', 'color'].some(function (part) {
                    return $('[data-css-property="border-' + side + '-' + part + '"]').val() !== '';
                });

                if (!hasBorderComponents) {
                    var parts = cssArray[prop].split(/\s+/);
                    if (parts.length >= 3) {
                        setInputValue($('[data-css-property="border-' + side + '-width"]'), parts[0]);
                        setInputValue($('[data-css-property="border-' + side + '-style"]'), parts[1]);
                        setInputValue($('[data-css-property="border-' + side + '-color"]'), parts[2]);
                    }
                }
                continue;
            }

            // Handle all other properties
            var $input = $('[data-css-property="' + prop + '"]');
            if ($input.length && !prop.match(/^(padding|margin|border)/)) {
                setInputValue($input, cssArray[prop]);
            }
        }
    }

    function expandShorthandProperty(prop, value) {
        var values = value.split(/\s+/);
        var sides = ['top', 'right', 'bottom', 'left'];

        if (values.length === 1) {
            // All sides same value
            sides.forEach(function (side) {
                setInputValue($('[data-css-property="' + prop + '-' + side + '"]'), values[0]);
            });
        } else if (values.length === 2) {
            // vertical | horizontal
            setInputValue($('[data-css-property="' + prop + '-top"]'), values[0]);
            setInputValue($('[data-css-property="' + prop + '-right"]'), values[1]);
            setInputValue($('[data-css-property="' + prop + '-bottom"]'), values[0]);
            setInputValue($('[data-css-property="' + prop + '-left"]'), values[1]);
        } else if (values.length === 3) {
            // top | horizontal | bottom
            setInputValue($('[data-css-property="' + prop + '-top"]'), values[0]);
            setInputValue($('[data-css-property="' + prop + '-right"]'), values[1]);
            setInputValue($('[data-css-property="' + prop + '-bottom"]'), values[2]);
            setInputValue($('[data-css-property="' + prop + '-left"]'), values[1]);
        } else if (values.length === 4) {
            // top | right | bottom | left
            setInputValue($('[data-css-property="' + prop + '-top"]'), values[0]);
            setInputValue($('[data-css-property="' + prop + '-right"]'), values[1]);
            setInputValue($('[data-css-property="' + prop + '-bottom"]'), values[2]);
            setInputValue($('[data-css-property="' + prop + '-left"]'), values[3]);
        }
    }

    function setInputValue($input, value) {
        var config = $input.data('field-config');

        if (!value) return;

        if (config && config.type === 'color') {
            if ($input.hasClass('minicolors')) {
                $input.minicolors('value', value);
            } else {
                $input.val(value);
            }
        } else if (config && config.type === 'number') {
            var numVal = value.replace(/[^0-9.]/g, '');
            $input.val(numVal);
        } else {
            $input.val(value);
        }
    }

    // Parse CSS string to object
    function parseCSSString(cssString) {
        var result = {};
        if (!cssString) return result;

        // Process declarations in reverse order to respect CSS specificity
        var declarations = cssString.replace(/[{}]/g, '').trim()
            .split(';')
            .filter(Boolean)
            .reverse();

        var processedProps = new Set();

        declarations.forEach(function (decl) {
            var parts = decl.split(':').map(part => part.trim());
            if (parts.length < 2) return;

            var prop = parts[0];
            var value = parts.slice(1).join(':').trim();

            // Skip if we've already processed this property
            if (processedProps.has(prop)) return;

            result[prop] = value;
            processedProps.add(prop);

            // Enhanced border parsing
            if (prop.match(/^border-(top|right|bottom|left)$/) && !prop.includes('-width') &&
                !prop.includes('-style') && !prop.includes('-color')) {
                var borderParts = value.split(/\s+/);
                if (borderParts.length >= 3) {
                    var side = prop.split('-')[1];
                    result[`border-${side}-width`] = borderParts[0];
                    result[`border-${side}-style`] = borderParts[1];
                    result[`border-${side}-color`] = borderParts[2];
                }
            }

            // Maintain existing shorthand handling for padding/margin
            if (prop === 'padding' || prop === 'margin') {
                var hasSpecificSides = declarations.some(d => {
                    return d.includes(prop + '-left:') ||
                        d.includes(prop + '-right:') ||
                        d.includes(prop + '-top:') ||
                        d.includes(prop + '-bottom:');
                });

                if (!hasSpecificSides) {
                    var values = value.split(/\s+/);
                    if (values.length === 1) {
                        result[prop + '-top'] = values[0];
                        result[prop + '-right'] = values[0];
                        result[prop + '-bottom'] = values[0];
                        result[prop + '-left'] = values[0];
                    } else if (values.length === 2) {
                        result[prop + '-top'] = values[0];
                        result[prop + '-right'] = values[1];
                        result[prop + '-bottom'] = values[0];
                        result[prop + '-left'] = values[1];
                    } else if (values.length === 3) {
                        result[prop + '-top'] = values[0];
                        result[prop + '-right'] = values[1];
                        result[prop + '-bottom'] = values[2];
                        result[prop + '-left'] = values[1];
                    } else if (values.length === 4) {
                        result[prop + '-top'] = values[0];
                        result[prop + '-right'] = values[1];
                        result[prop + '-bottom'] = values[2];
                        result[prop + '-left'] = values[3];
                    }
                }
            }
        });

        return result;
    }

    function updateStylePreview() {
        // Get current CSS from editor
        const cssContent = myEditor.getValue();

        // Parse and apply to preview element
        const previewTarget = $("#advgb-customstyles-preview .advgb-customstyles-target");
        previewTarget.removeAttr('style');

        // Remove braces and apply each declaration
        const cleanCSS = cssContent.replace(/[{}]/g, '').trim();
        const declarations = cleanCSS.split(';').filter(Boolean);

        declarations.forEach(decl => {
            const [prop, value] = decl.split(':').map(part => part.trim());
            if (prop && value) {
                previewTarget.css(prop, value);
            }
        });
    }

    function setupLivePreview() {

        if (typeof myEditor !== 'undefined') {
            // Handle editor changes
            myEditor.on("change", function () {
                updateStylePreview();
            });
        }

        // Handle all style input changes
        $('.style-input').on('input change', function () {
            // Update the editor first
            updateCSSFromUI();
            // Then update preview
            updateStylePreview();
        });

        // Handle color picker changes
        $('.minicolors').on('change', function () {
            updateCSSFromUI();
            updateStylePreview();
        });
    }

    function initCustomStyleMenu() {
        // Add new custom style
        (initCustomStyleNew = function () {
            $('#mybootstrap a.advgb-customstyles-new').unbind('click').click(function (e) {
                that = this;
                var nonce_val = $('#advgb_cstyles_nonce_field').val();

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'advgb_custom_styles_ajax',
                        task: 'new',
                        nonce: nonce_val
                    },
                    beforeSend: function () {
                        $('#customstyles-tab').append('<div class="advgb-overlay-box"></div>');
                    },
                    success: function (res, stt) {
                        if (stt === 'success') {
                            $(that).parent().before('<li class="advgb-customstyles-items" data-id-customstyle="' + res.id + '"><a><i class="title-icon"></i><span class="advgb-customstyles-items-title">' + res.title + '</span></a><a class="copy"><span class="dashicons dashicons-admin-page"></span></a><a class="trash"><span class="dashicons dashicons-no"></span></a><ul style="margin-left: 30px"><li class="advgb-customstyles-items-class">(' + res.name + ')</li></ul></li>');
                            initCustomStyleMenu();
                        } else {
                            alert(stt);
                        }
                        $('#customstyles-tab').find('.advgb-overlay-box').remove();
                    },
                    error: function (jqxhr, textStatus, error) {
                        alert(textStatus + " : " + error + ' - ' + jqxhr.responseJSON);
                        $('#customstyles-tab').find('.advgb-overlay-box').remove();
                    }
                });
                return false;
            })
        })();

        // Delete custom style
        (initCustomStyleDelete = function () {
            $('#mybootstrap .advgb-customstyles-items a.trash').unbind('click').click(function (e) {
                that = this;
                var cf = confirm('Do you really want to delete "' + $(this).prev().prev().text().trim() + '"?');
                if (cf === true) {
                    var id = $(that).parent().data('id-customstyle');
                    var nonce_val = $('#advgb_cstyles_nonce_field').val();

                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            action: 'advgb_custom_styles_ajax',
                            id: id,
                            task: 'delete',
                            nonce: nonce_val
                        },
                        beforeSend: function () {
                            $('#customstyles-tab').append('<div class="advgb-overlay-box"></div>');
                        },
                        success: function (res, stt) {
                            if (stt === 'success') {
                                $(that).parent().remove();
                                if (res.id == myStyleId) {
                                    customStylePreview();
                                } else {
                                    customStylePreview(myStyleId);
                                }
                            } else {
                                alert(stt);
                            }
                            $('#customstyles-tab').find('.advgb-overlay-box').remove();
                        },
                        error: function (jqxhr, textStatus, error) {
                            alert(textStatus + " : " + error + ' - ' + jqxhr.responseJSON);
                            $('#customstyles-tab').find('.advgb-overlay-box').remove();
                        }
                    });
                    return false;
                }
            })
        })();

        // Copy custom style
        (initCustomStyleCopy = function () {
            $('#mybootstrap .advgb-customstyles-items a.copy').unbind('click').click(function (e) {
                that = this;
                var id = $(that).parent().data('id-customstyle');
                var nonce_val = $('#advgb_cstyles_nonce_field').val();

                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        action: 'advgb_custom_styles_ajax',
                        id: id,
                        task: 'copy',
                        nonce: nonce_val
                    },
                    beforeSend: function () {
                        $('#customstyles-tab').append('<div class="advgb-overlay-box"></div>');
                    },
                    success: function (res, stt) {
                        if (stt === 'success') {
                            $(that).parents('.advgb-customstyles-list').find('li').last().before('<li class="advgb-customstyles-items" data-id-customstyle="' + res.id + '"><a><i class="title-icon" style="background-color: ' + res.identifyColor + '"></i><span class="advgb-customstyles-items-title">' + res.title + '</span></a><a class="copy"><span class="dashicons dashicons-admin-page"></span></a><a class="trash"><span class="dashicons dashicons-no"></span></a><ul style="margin-left: 30px"><li class="advgb-customstyles-items-class">(' + res.name + ')</li></ul></li>');
                            initCustomStyleMenu();
                        } else {
                            alert(stt);
                        }
                        $('#customstyles-tab').find('.advgb-overlay-box').remove();
                    },
                    error: function (jqxhr, textStatus, error) {
                        alert(textStatus + " : " + error + ' - ' + jqxhr.responseJSON);
                        $('#customstyles-tab').find('.advgb-overlay-box').remove();
                    }
                });
                return false;
            })
        })();

        // Choose custom style
        (initTableLinks = function () {
            $('#mybootstrap .advgb-customstyles-items').unbind('click').click(function (e) {
                id = $(this).data('id-customstyle');
                customStylePreview(id);

                return false;
            })
        })();
    }

    // Add Codemirror
    myCssArea = document.getElementById('advgb-customstyles-css');
    myEditor = CodeMirror.fromTextArea(myCssArea, {
        mode: 'css',
        lineNumbers: true,
        extraKeys: { "Ctrl-Space": "autocomplete" }
    });

    $(myCssArea).on('change', function () {
        myEditor.setValue($(myCssArea).val());
        myEditor.refresh();
    });

    myEditor.on("blur", function () {
        myEditor.save();
        $(myCssArea).trigger('propertychange');

    });

    myStyleId = advgbGetCookie('advgbCustomStyleID');
    // Fix Codemirror not displayed properly
    $('a[href="#custom-styles"]').one('click', function () {
        myEditor.refresh();
        customStylePreview(myStyleId);
    });

    customStylePreview(myStyleId);
    function customStylePreview(id_element) {
        if (typeof id_element === "undefined" || !id_element) {
            var firstStyle = $('#mybootstrap ul.advgb-customstyles-list li:first-child');
            id_element = firstStyle.data('id-customstyle');
            firstStyle.addClass('active');
        }
        if (typeof id_element === "undefined" || id_element === "") return;

        clearAllFields();

        $('#mybootstrap .advgb-customstyles-list li').removeClass('active');
        $('#mybootstrap .advgb-customstyles-list li[data-id-customstyle=' + id_element + ']').addClass('active');

        document.cookie = 'advgbCustomStyleID=' + id_element;
        var nonce_val = $('#advgb_cstyles_nonce_field').val();

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'advgb_custom_styles_ajax',
                id: id_element,
                task: 'preview',
                nonce: nonce_val
            },
            beforeSend: function () {
                $('#advgb-customstyles-info').append('<div class="advgb-overlay-box"></div>');
            },
            success: function (res, stt) {
                if (stt === 'success') {
                    // Update basic fields
                    $('#advgb-customstyles-title').val(res.title);
                    $('#advgb-customstyles-classname').val(res.name);

                    // Handle identify color safely
                    var $identifyColor = $('#advgb-customstyles-identify-color');
                    if ($identifyColor.data('minicolors-initialized')) {
                        $identifyColor.minicolors('value', res.identifyColor);
                    } else {
                        $identifyColor.val(res.identifyColor);
                    }

                    // Set active tab
                    if (res.active_tab) {
                        activeTab = res.active_tab;
                        localStorage.setItem('advgb_active_tab', activeTab);
                        initUI();
                    }

                    // Handle CSS
                    myStyleId = id_element;
                    var cssContent = res.css;

                    if (res.css_array) {
                        // We have structured data
                        populateUIFields(res.css_array);
                        cssContent = '{\n' + res.css + '\n}';
                    } else {
                        // Legacy CSS string
                        populateUIFields(res.css);
                        cssContent = '{\n' + res.css + '\n}';
                    }

                    // Update editor
                    $('#advgb-customstyles-css').val(cssContent);
                    myEditor.setValue(cssContent);
                    myEditor.refresh();
                    parseCustomStyleCss();

                    $('#advgb-customstyles-info').find('.advgb-overlay-box').remove();
                } else {
                    alert(stt);
                    $('#advgb-customstyles-info').find('.advgb-overlay-box').css({
                        backgroundImage: 'none',
                        backgroundColor: '#ff0000',
                        opacity: 0.2
                    });
                }
            },
            error: function (jqxhr, textStatus, error) {
                alert(textStatus + " : " + error + ' - ' + jqxhr.responseJSON);
                $('#advgb-customstyles-info').find('.advgb-overlay-box').css({
                    backgroundImage: 'none',
                    backgroundColor: '#ff0000',
                    opacity: 0.2
                });
            }
        });
    }


    String.prototype.replaceAll = function (search, replace) {
        if (replace === undefined) {
            return this.toString();
        }
        return this.split(search).join(replace);
    };

    // Parse custom style text to css for preview
    function parseCustomStyleCss() {
        var previewTarget = $("#advgb-customstyles-preview .advgb-customstyles-target");
        var parser = new (less.Parser);
        var content = '#advgb-customstyles-preview .advgb-customstyles-target ' + myEditor.getValue();
        parser.parse(content, function (err, tree) {
            if (err) {
                // Show error to the user
                if (err.message == 'Unrecognised input' && configData.message) {
                    err.message = configData.message;
                }
                alert(err.message);
                return false;
            } else {
                cssString = tree.toCSS().replace("#advgb-customstyles-preview .advgb-customstyles-target {", "");
                cssString = cssString.replace("}", "").trim();
                cssString = cssString.replaceAll("  ", "");
                myCustomCss = cssString;

                previewTarget.removeAttr('style');

                var attributes = cssString.split(';');
                for (var i = 0; i < attributes.length; i++) {
                    if (attributes[i].indexOf(":") > -1) {
                        var entry = attributes[i].split(/:(.+)/);
                        previewTarget.css(jQuery.trim("" + entry[0] + ""), jQuery.trim(entry[1]));
                    }
                }

                return true;
            }
        })
    }

    // Bind event to preview custom style after changed css text
    (initCustomCssObserver = function () {
        var cssChangeWait;
        $('#advgb-customstyles-css').bind('input propertychange', function () {
            clearTimeout(cssChangeWait);
            cssChangeWait = setTimeout(function () {
                parseCustomStyleCss();
            }, 500);
        });
    })();

    $('#save_custom_styles').click(function (e) {
        saveCustomStyleChanges();
    });

    // Save custome style
    function saveCustomStyleChanges() {
        var myStyleTitle = $('#advgb-customstyles-title').val().trim();
        var myClassname = $('#advgb-customstyles-classname').val().trim();
        var myIdentifyColor = $('#advgb-customstyles-identify-color').val().trim();
        var nonce_val = $('#advgb_cstyles_nonce_field').val();

        var cssData = {};
        if (activeTab === 'style-editor' && advgbCustomStyles.isProActive) {
            // Get from UI fields
            $('.style-input').each(function () {
                var $input = $(this);
                var prop = $input.data('css-property');
                var val = $input.val();

                if (val) {
                    if ($input.data('unit') && !isNaN(val)) {
                        val += $input.data('unit');
                    }
                    cssData[prop] = val;
                }
            });
        } else {
            activeTab = 'custom-css';
            // Get from editor
            var cssString = myEditor.getValue();
            cssData = cssString.replace(/[{}]/g, '').trim();
        }

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            dataType: 'json',
            data: {
                action: 'advgb_custom_styles_ajax',
                id: myStyleId,
                title: myStyleTitle,
                name: myClassname,
                mycss: activeTab === 'style-editor' ? '' : cssData,
                css_array: activeTab === 'style-editor' ? cssData : null,
                mycolor: myIdentifyColor,
                active_tab: activeTab,
                task: 'style_save',
                nonce: nonce_val
            },
            beforeSend: function () {
                $('#customstyles-tab').append('<div class="advgb-overlay-box"></div>');
            },
            success: function (res, stt) {
                if (stt === 'success') {
                    $('#advgb-customstyles-info form').submit();
                } else {
                    alert(stt);
                    $('#customstyles-tab').find('.advgb-overlay-box').remove();
                }
            },
            error: function (jqxhr, textStatus, error) {
                alert(textStatus + " : " + error + ' - ' + jqxhr.responseJSON);
                $('#customstyles-tab').find('.advgb-overlay-box').remove();
            }
        });
    }

    initUI();
});
