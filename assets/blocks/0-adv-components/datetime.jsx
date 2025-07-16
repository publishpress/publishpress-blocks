import hourConvert from 'hour-convert';

const { ButtonGroup, Button, DateTimePicker, TextControl, CheckboxControl, Popover, Tooltip, SelectControl, Icon } = wp.components;
const { Component, Fragment, useState } = wp.element;
const { __, _x } = wp.i18n;
const { applyFilters } = wp.hooks;

export function AdvDateTimeControl(props) {
    const [popupState, setPopupState] = useState( false );
    const togglePopup = () => {
        setPopupState( ! popupState );
    };

    const {
        buttonLabel,
        dateLabel,
        date,
        onChangeDate,
        onDateClear,
        onInvalidDate,
        placement,
        offset
    } = props;

    return (
        <Fragment>
            <div className="advgb-advcalendar-control">
                <label>
                    { dateLabel }
                </label>
                <div>
                    <Button
                        isLink
                        icon="calendar"
                        onClick={ togglePopup }
                    >
                        <Tooltip text={ __( 'Change date', 'advanced-gutenberg' ) }>
                            <span>
                                { date ? moment( date ).format( "MMMM DD YYYY, h:mm a" ) : buttonLabel }
                            </span>
                        </Tooltip>
                    </Button>
                    { date &&
        				<Button
        					icon="no-alt"
                            className="advgb-advcalendar-remove-icon"
        					onClick={ () => onDateClear() }
        				/>
        			}
                </div>
            </div>
            { popupState &&
                <Popover
                    className="advgb-advcalendar-popover"
                    onClose={ setPopupState.bind( null, false ) }
                    resize={ false }
                    placement={ placement }
                    offset={ offset }
                >
                    <label className="advgb-advcalendar-popover-label">
                        { dateLabel }
                        <Button
        					icon="no-alt"
                            className="advgb-advcalendar-remove-icon"
        					onClick={ togglePopup }
        				/>
                    </label>
                    <DateTimePicker
                        currentDate={ date }
                        onChange={ onChangeDate }
                        is12Hour={ true }
                        isInvalidDate={ onInvalidDate }
                    />
                </Popover>
            }
        </Fragment>

    )
}

AdvDateTimeControl.defaultProps = {
    placement: 'left',
    offset: 40
}

export function AdvDaysControl(props) {
    const allDays = [
        { slug: 0, label: _x( 'S', 'Sunday first letter', 'advanced-gutenberg' ) }, // Sunday
        { slug: 1, label: __( 'M', 'advanced-gutenberg' ) }, // Monday
        { slug: 2, label: _x( 'T', 'Tuesday first letter', 'advanced-gutenberg' ) }, // Tuesday
        { slug: 3, label: __( 'W', 'advanced-gutenberg' ) }, // Wednesday
        { slug: 4, label: _x( 'T', 'Thursday first letter', 'advanced-gutenberg' ) }, // Thursday
        { slug: 5, label: __( 'F', 'advanced-gutenberg' ) }, // Friday
        { slug: 6, label: _x( 'S', 'Saturday first letter', 'advanced-gutenberg' ) }  // Saturday
    ];

    const {
        label,
        days,
        onChangeDays
    } = props;

    // Use a single state variable to store the selected days
    const [ selectedDays, setSelectedDays ] = useState( days );

    /**
    * Check if the day is selected or not
    *
    * @since 3.1.2
    *
    * @param {string} Day slug e.g. 'u' for Sunday, 't' for Tuesday
    *
    * @return {bool}
    */
    function isDaySelected( slug ) {
        return selectedDays.some( el => el === slug );
    }

    /**
    * Update the selected days state when a checkbox is changed
    *
    * @since 3.1.2
    *
    * @param {string} Day slug e.g. 'u' for Sunday, 't' for Tuesday
    *
    * @return {void}
    */
    function onChangeDay( slug ) {

        // Check if the day is already selected
        const isSelected = isDaySelected( slug );

        // Create a new array with the updated selection
        let updatedDays;
        if ( isSelected ) {
            // Remove the day from the selected days
            updatedDays = selectedDays.filter( el => el !== slug );
        } else {
            // Add the day to the selected days
            const findDay = allDays.find( el => el.slug === slug );
            updatedDays = [ ...selectedDays, findDay.slug ];
        }

        // Remove duplicates
        const uniqueDays = [ ...new Set( updatedDays ) ];

        // Update the selected days state
        setSelectedDays( uniqueDays );

        // Call the onChangeDays prop to notify the parent component of the change
        if ( onChangeDays ) {
            onChangeDays( updatedDays );
        }
    }

    return (
        <Fragment>
            <div className="advgb-checkbox-wrapper">
                <label>
                    { label }
                </label>
                <div className="advgb-checkbox-inline">
                    { allDays.map( day => (
                        <CheckboxControl
                            label={ day.label }
                            checked={ isDaySelected( day.slug ) }
                            onChange={ () => onChangeDay( day.slug ) }
                        />
                    ) ) }
                </div>
            </div>
        </Fragment>
    )
}

class AdvTimeClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onChangeTime: null,
            currentTime: this.props.currentTime || null,
            hours: null,
            minutes: null,
            meridian: 'am',
            onInit: true
        };
    }

    componentWillMount() {
        const { onChangeTime, currentTime, onInit } = this.state;

        if( this.props.onChangeTime !== onChangeTime ) {
            this.setState( {
                onChangeTime: this.props.onChangeTime,
            } );
        }

        if( this.props.currentTime !== currentTime ) {
            this.setState( {
                currentTime: this.props.currentTime,
            } );
        }

        // Init
        if( currentTime && currentTime.includes(':') && onInit ) {
            this.setState( {
                hours:      currentTime.split(':')[0],
                minutes:    currentTime.split(':')[1],
                meridian:   parseInt( currentTime.split(':')[0] ) > 11 ? 'pm' : 'am', // We set > 11 because PM starts from 12:00:00
                onInit:     false
            } );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { onChangeTime, currentTime } = this.props;
        const { hours, minutes, meridian } = this.state;
        const { hours: prevHours, minutes: prevMinutes, meridian: prevMeridian } = prevState;

        if( hours !== prevHours || minutes !== prevMinutes || meridian !== prevMeridian ) {

            // When clearing time
            if( ! hours && ! minutes ) {
                return;
            }

            // Default minutes when hours selected
            if( hours && ! minutes ) {
                this.setState( {
                    minutes: '00'
                } );
            }

            // Default hours when minutes selected
            if( minutes && ! hours ) {
                this.setState( {
                    hours: '01'
                } );
            }

            /* Convert 12-hours to 24-hours.
             * e.g. 12:00 AM becomes 00:00:00
             *      12:00 PM becomes 12:00:00
             *      01:00 PM becomes 13:00:00
             */
            const savedTime   = `${this.appendZero(
                                    hourConvert.to24Hour( {
                                        hour: parseInt( hours ),
                                        meridiem: meridian
                                    } )
                                )}:${minutes}:00`;

            // Value saved in source/attribute
            this.props.onChangeTime( savedTime );
        }
    }

    /**
     * Append zero to one digit numbers. e.g. 9 becomes '09'
     *
     * @since 3.1.2
     *
     * @param {string value Hours or minutes
     *
     * @return {string}
     */
    appendZero( value ) {
        if( isNaN( value ) ) {
            return;
        }

        const res = parseInt( value );

        return res > 9 ? res : `0${res}`;
    }

    render() {
        const { onChangeTime, currentTime, hours, minutes, meridian } = this.state;

        // Make sure hours are valid. 01: min, 12: max
        const handleChangeHours = event => {
            const value = Math.max( 1, Math.min( 12, Number( event.target.value ) ) );
            this.setState( {
                hours: this.appendZero( value )
            } );
        };

        // Allow to use up/down keys for hours
        const handleKeyDownHours = event => {
            const value = Number( event.target.value );
            if( event.key === 'ArrowUp' && value < 12 ) {
                this.setState( {
                    hours: this.appendZero( value + 1 )
                } );
            } else if ( event.key === 'ArrowDown' && value > 1 ) {
                this.setState( {
                    hours: this.appendZero( value - 1 )
                } );
            }
        };

        // Make sure minutes are valid. 01: min, 59: max
        const handleChangeMinutes = event => {
            const value = Math.max( 0, Math.min( 59, Number( event.target.value ) ) );
            this.setState( {
                minutes: this.appendZero( value )
            } );
        };

        // Allow to use up/down keys for minutes
        const handleKeyDownMinutes = event => {
            const value = Number( event.target.value );
            if( event.key === 'ArrowUp' && value < 59 ) {
                this.setState( {
                    minutes: this.appendZero( value + 1 )
                } );
            } else if ( event.key === 'ArrowDown' && value > 0 ) {
                this.setState( {
                    minutes: this.appendZero( value - 1 )
                } );
            }
        };

        return (
            <Fragment>
                <div className="advgb-advtime-control">
                    <label>
                        { this.props.label }
                    </label>
                    <div className="advgb-advtime-hours-minutes">
                        <input
                            type="text"
                            value={
                                hours
                                    ? this.appendZero(
                                        hourConvert.to12Hour( parseInt( hours ) ).hour
                                    ) : ''
                            }
                            onChange={ handleChangeHours }
                            onKeyDown={ handleKeyDownHours }
                            placeholder="--"
                        />
                        <span>:</span>
                        <input
                            type="text"
                            value={
                                minutes ? minutes : ''
                            }
                            onChange={ handleChangeMinutes }
                            onKeyDown={ handleKeyDownMinutes }
                            placeholder="--"
                        />
                    </div>
                    <ButtonGroup className="advgb-advtime-meridian">
                        <Button
                            variant={
                                meridian === null || meridian === 'am' ? 'primary' : 'secondary'
                            }
                            onClick={ () => {
                                this.setState( {
                                    meridian: 'am'
                                } );
                            } }
                            disabled={ hours && minutes ? false : true }
                        >
                            { __( 'AM', 'advanced-gutenberg' ) }
                        </Button>
                        <Button
                            variant={
                                meridian === 'pm' ? 'primary' : 'secondary'
                            }
                            onClick={ () => {
                                this.setState( {
                                    meridian: 'pm'
                                } );
                            } }
                            disabled={ hours && minutes ? false : true }
                        >
                            { __( 'PM', 'advanced-gutenberg' ) }
                        </Button>
                    </ButtonGroup>
                    { hours && minutes &&
        				<Button
                            className="advgb-advtime-remove-icon"
        					icon="no-alt"
                            onClick={
                                () => {
                                    this.props.onTimeClear();
                                    this.setState( {
                                        hours: null,
                                        minutes: null,
                                        meridian: 'am'
                                    } );
                                }
                            }
        				/>
        			}
                </div>
            </Fragment>
        )
    }
}
export default AdvTimeClass;

export function AdvTimeControl(props) {
    const { label, currentTime, onChangeTime, onTimeClear } = props;

    return(
        <AdvTimeClass
            label={ label }
            currentTime={ currentTime }
            onChangeTime={ onChangeTime }
            onTimeClear={ onTimeClear }
        />
    );
}

export function AdvTimezoneControl(props) {
    const { label, defaultTimezone } = props;

    return (
        <Fragment>
            { applyFilters( 'advgb.timezoneControl',
                <Fragment>
                    <div className="advgb-promo-overlay-area">
                        <div className="advgb-blur">
                            { label }
                            <SelectControl
                                value={ defaultTimezone }
                                options={ [ {
                                        label: defaultTimezone,
                                        value: defaultTimezone
                                    }
                                ] }
                                disabled={ true }
                            />
                        </div>
                        <div class="advgb-pro-overlay-wrap">
                            <div class="advgb-pro-overlay-text advgb-tooltips ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                <span class="advgb-promo-icon">
                                    <i class="dashicons dashicons dashicons-lock block-promo-button"></i>
                                </span>
                                <span class="tooltip-text">
                                    <p>
                                        {__('PublishPress Blocks Pro supports Timezone configuration.', 'advanced-gutenberg')}
                                    </p>
                                    <p>
                                        <a class="clickable" href="https://publishpress.com/links/blocks" target="_blank">
                                            { __( 'Upgrade to Pro', 'advanced-gutenberg' ) }
                                        </a>
                                    </p>
                                    <i></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <></>
                </Fragment>,
                props
            ) }
        </Fragment>
    )
}
