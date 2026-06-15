jQuery(document).ready(function($){
    function setAccordionHeaderState($header, isExpanded) {
        $header.attr('aria-expanded', isExpanded ? 'true' : 'false');
    }

    function initExpandAllMode($accordion) {
        const $headers = $accordion.find('> .advgb-accordion-item > .advgb-accordion-header');

        $headers.each(function() {
            const $header = $(this);
            const $body = $header.next('.advgb-accordion-body');

            $body.show();
            setAccordionHeaderState($header, true);
            $header.attr({ tabindex: '0', role: 'button' });
        });

        function toggleItem($header) {
            const $body = $header.next('.advgb-accordion-body');
            const isExpanded = $header.attr('aria-expanded') === 'true';
            if (isExpanded) {
                $body.stop(true, true).slideUp(200);
                setAccordionHeaderState($header, false);
            } else {
                $body.stop(true, true).slideDown(200);
                setAccordionHeaderState($header, true);
            }
        }

        $headers.on('click', function() {
            toggleItem($(this));
        });

        $headers.on('keydown', function(e) {
            const $header = $(this);
            const idx = $headers.index($header);
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    toggleItem($header);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    $headers.eq((idx + 1) % $headers.length).focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    $headers.eq((idx - 1 + $headers.length) % $headers.length).focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    $headers.first().focus();
                    break;
                case 'End':
                    e.preventDefault();
                    $headers.last().focus();
                    break;
            }
        });
    }

    $(".advgb-accordion-wrapper").each(function() {
        const $wrapper = $(this);

        if ($wrapper.data('expand-all')) {
            initExpandAllMode($wrapper);
            return;
        }

        $wrapper.accordion({
            header: "> div > .advgb-accordion-header",
            heightStyle: "content",
            collapsible: true,
            active: $wrapper.data("collapsed") ? false : 0,
        });

        // Override jQuery UI's roving tabindex so Tab visits every header
        const $headers = $wrapper.find('> .advgb-accordion-item > .advgb-accordion-header');

        function restoreTabIndex() {
            $headers.attr('tabindex', '0');
        }
        restoreTabIndex();
        $wrapper.on('accordionactivate', restoreTabIndex);

        // jQuery UI handles Enter; also support Space to activate
        $headers.on('keydown', function(e) {
            if (e.key === ' ') {
                e.preventDefault();
                $(this).trigger('click');
            }
        });
    });
});
