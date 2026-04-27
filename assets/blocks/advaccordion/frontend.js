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
        });

        $headers.on('click', function() {
            const $header = $(this);
            const $body = $header.next('.advgb-accordion-body');
            const isExpanded = $header.attr('aria-expanded') === 'true';

            if (isExpanded) {
                $body.stop(true, true).slideUp(200);
                setAccordionHeaderState($header, false);
            } else {
                $body.stop(true, true).slideDown(200);
                setAccordionHeaderState($header, true);
            }
        });
    }

    $(".advgb-accordion-wrapper").each(function() {
        if ($(this).data('expand-all')) {
            initExpandAllMode($(this));
            return;
        }

        $(this).accordion({
            header: "> div > .advgb-accordion-header",
            heightStyle: "content",
            collapsible: true,
            active: $(this).data("collapsed") ? false : 0,
        });
    });
});
