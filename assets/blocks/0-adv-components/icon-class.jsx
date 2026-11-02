const { __, _n, sprintf } = wp.i18n;
const { Component } = wp.element;
const { Button, Modal, SelectControl, TextControl } = wp.components;

class IconListPopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchedText: '',
            selectedIcon: '',
            selectedIconTheme: 'outlined',
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Announce the number of matching icons after the search text changes
        if (prevState.searchedText !== this.state.searchedText) {
            clearTimeout(this.speakTimeout);
            this.speakTimeout = setTimeout(() => {
                const count = this.getFilteredIcons().length;
                if (window.wp && window.wp.a11y && typeof window.wp.a11y.speak === 'function') {
                    window.wp.a11y.speak(
                        sprintf(
                            _n('%d icon found.', '%d icons found.', count, 'advanced-gutenberg'),
                            count
                        )
                    );
                }
            }, 500);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.speakTimeout);
    }

    getFilteredIcons() {
        const searchedText = this.state.searchedText;
        return Object.keys(advgbBlocks.iconList['material'])
            .filter((icon) => icon.indexOf(searchedText.trim().split(' ').join('_')) > -1);
    }

    componentWillMount() {
        const {searchedText, selectedIconTheme} = this.state;
        if(this.props.selectedIcon !== searchedText) {
            this.setState({
                selectedIcon: this.props.selectedIcon,
            });
        }
        if(this.props.selectedIconTheme !== selectedIconTheme) {
            this.setState({
                selectedIconTheme: this.props.selectedIconTheme
            });
        }
    }


    render() {
        const {searchedText, selectedIcon, selectedIconTheme} = this.state;
        const popUpTitle = __('Icon List', 'advanced-gutenberg');
        const iconType = 'material';

        const applyIconButtonClass = [
            'apply-btn',
            'components-button',
            'button button-large',
            'advgb-icon-apply-btn',
            'is-primary'
        ].filter( Boolean ).join( ' ' );

        return (
            <Modal
                title={ popUpTitle }
                onRequestClose={ this.props.closePopup }
                className="advgb-icon-popup"
                isDismissible={ true }
                shouldCloseOnClickOutside={ false }
                shouldCloseOnEsc={ true }
            >
                <div
                    className="advgb-icon-popup-content"
                    ref={node => {this.node = node}}
                >
                    <div className="popup-body">
                        <TextControl
                            label={ __( 'Search icons', 'advanced-gutenberg' ) }
                            hideLabelFromVision
                            placeholder={ __( 'Search icons', 'advanced-gutenberg' ) }
                            value={ searchedText }
                            onChange={ (value) => this.setState( { searchedText: value } ) }
                        />
                        <SelectControl
                            label={ __('Style', 'advanced-gutenberg') }
                            value={ selectedIconTheme }
                            className="advgb-icon-style-select"
                            options={ [
                                { label: __('Filled', 'advanced-gutenberg'), value: '' },
                                { label: __('Outlined', 'advanced-gutenberg'), value: 'outlined' },
                                { label: __('Rounded', 'advanced-gutenberg'), value: 'round' },
                                { label: __('Two-Tone', 'advanced-gutenberg'), value: 'two-tone' },
                                { label: __('Sharp', 'advanced-gutenberg'), value: 'sharp' },
                            ] }
                            onChange={ ( value ) => {
                                this.setState({
                                    selectedIconTheme: value,
                                });
                            } }
                        />
                        <div
                            className="advgb-icon-items-wrapper button-icons-list"
                            style={ {maxHeight: 300, overflowY: 'auto', overflowX: 'hidden'} }
                            role="group"
                            aria-label={ __( 'Icons', 'advanced-gutenberg' ) }
                        >

                            {Object.keys(advgbBlocks.iconList[iconType])
                                .filter((icon) => icon.indexOf(searchedText.trim().split(' ').join('_')) > -1)
                                .map( (icon, index) => {

                                    const iconClass = [
                                        iconType === 'material' && 'material-icons',
                                        selectedIconTheme !== '' && `-${selectedIconTheme}`
                                    ].filter( Boolean ).join('');

                                    return (
                                        <div className="advgb-icon-item" key={ index }>
                                            <span
                                                className={ icon === selectedIcon ? 'active' : undefined }
                                            >
                                                <button
                                                    type="button"
                                                    className="advgb-icon-item-button"
                                                    onClick={ () => {
                                                        this.setState({
                                                            selectedIcon: icon
                                                        })
                                                    } }
                                                    title={ icon }
                                                    aria-label={ icon.split('_').join(' ') }
                                                    aria-pressed={ icon === selectedIcon }
                                                >
                                                    <i className={ iconClass } aria-hidden="true">{icon}</i>
                                                </button>
                                            </span>
                                        </div>
                                    )
                                } ) }
                        </div>
                    </div>
                    <div className="popup-footer">
                        <Button
                            disabled={selectedIcon === ''}
                            className={applyIconButtonClass}
                            isPrimary
                            onClick={() => {
                                this.props.onSelectIcon( selectedIcon );
                                this.props.onSelectIconTheme(selectedIconTheme);
                                this.props.closePopup();
                            }}>
                            { __('Apply', 'advanced-gutenberg') }
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default IconListPopup;

export function IconListPopupHook(props) {
    const { closePopup, onSelectIcon, onSelectIconTheme, selectedIcon, selectedIconTheme } = props;
    return (
        <IconListPopup
            closePopup={ closePopup }
            onSelectIcon={ onSelectIcon }
            onSelectIconTheme={ onSelectIconTheme }
            selectedIcon={ selectedIcon }
            selectedIconTheme={ selectedIconTheme }
        />
    );
}
