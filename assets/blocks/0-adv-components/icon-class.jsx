const { __ } = wp.i18n;
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
                        <div className="advgb-icon-items-wrapper button-icons-list" style={ {maxHeight: 300, overflowY: 'auto', overflowX: 'hidden'} }>

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
                                                onClick={ () => {
                                                    this.setState({
                                                        selectedIcon: icon
                                                    })
                                                } }
                                                className={ icon === selectedIcon && 'active' }
                                                title={ icon }
                                            >
                                                <i className={ iconClass }>{icon}</i>
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
