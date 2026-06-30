/* global wp, advgbLegacyDisabled */
( function () {
    if ( typeof wp === 'undefined' || ! wp.blocks || ! wp.domReady ) {
        return;
    }

    var disabled = ( typeof advgbLegacyDisabled !== 'undefined' && advgbLegacyDisabled ) || [];
    if ( ! disabled.length ) {
        return;
    }

    // Unregister disabled legacy blocks once all blocks have registered.
    wp.domReady( function () {
        disabled.forEach( function ( name ) {
            try {
                if ( wp.blocks.getBlockType( name ) ) {
                    wp.blocks.unregisterBlockType( name );
                }
            } catch ( e ) {}
        } );
    } );
} )();
