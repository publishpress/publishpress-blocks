/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/blocks/0-adv-components/datetime.jsx"
/*!*****************************************************!*\
  !*** ./assets/blocks/0-adv-components/datetime.jsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdvDateTimeControl: () => (/* binding */ AdvDateTimeControl),
/* harmony export */   AdvDaysControl: () => (/* binding */ AdvDaysControl),
/* harmony export */   AdvTimeControl: () => (/* binding */ AdvTimeControl),
/* harmony export */   AdvTimezoneControl: () => (/* binding */ AdvTimezoneControl),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var hour_convert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hour-convert */ "./node_modules/hour-convert/index.js");
/* harmony import */ var hour_convert__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hour_convert__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }

var _wp$components = wp.components,
  ButtonGroup = _wp$components.ButtonGroup,
  Button = _wp$components.Button,
  DateTimePicker = _wp$components.DateTimePicker,
  TextControl = _wp$components.TextControl,
  CheckboxControl = _wp$components.CheckboxControl,
  Popover = _wp$components.Popover,
  Tooltip = _wp$components.Tooltip,
  SelectControl = _wp$components.SelectControl,
  Icon = _wp$components.Icon;
var _wp$element = wp.element,
  Component = _wp$element.Component,
  Fragment = _wp$element.Fragment,
  useState = _wp$element.useState;
var _wp$i18n = wp.i18n,
  __ = _wp$i18n.__,
  _x = _wp$i18n._x;
var applyFilters = wp.hooks.applyFilters;
function AdvDateTimeControl(props) {
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    popupState = _useState2[0],
    setPopupState = _useState2[1];
  var togglePopup = function togglePopup() {
    setPopupState(!popupState);
  };
  var buttonLabel = props.buttonLabel,
    dateLabel = props.dateLabel,
    date = props.date,
    onChangeDate = props.onChangeDate,
    onDateClear = props.onDateClear,
    onInvalidDate = props.onInvalidDate,
    placement = props.placement,
    offset = props.offset;
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "advgb-advcalendar-control"
  }, /*#__PURE__*/React.createElement("label", null, dateLabel), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    isLink: true,
    icon: "calendar",
    onClick: togglePopup
  }, /*#__PURE__*/React.createElement(Tooltip, {
    text: __('Change date', 'advanced-gutenberg')
  }, /*#__PURE__*/React.createElement("span", null, date ? moment(date).format("MMMM DD YYYY, h:mm a") : buttonLabel))), date && /*#__PURE__*/React.createElement(Button, {
    icon: "no-alt",
    className: "advgb-advcalendar-remove-icon",
    onClick: function onClick() {
      return onDateClear();
    }
  }))), popupState && /*#__PURE__*/React.createElement(Popover, {
    className: "advgb-advcalendar-popover",
    onClose: setPopupState.bind(null, false),
    resize: false,
    placement: placement,
    offset: offset
  }, /*#__PURE__*/React.createElement("label", {
    className: "advgb-advcalendar-popover-label"
  }, dateLabel, /*#__PURE__*/React.createElement(Button, {
    icon: "no-alt",
    className: "advgb-advcalendar-remove-icon",
    onClick: togglePopup
  })), /*#__PURE__*/React.createElement(DateTimePicker, {
    currentDate: date,
    onChange: onChangeDate,
    is12Hour: true,
    isInvalidDate: onInvalidDate
  })));
}
AdvDateTimeControl.defaultProps = {
  placement: 'left',
  offset: 40
};
function AdvDaysControl(props) {
  var allDays = [{
    slug: 0,
    label: _x('S', 'Sunday first letter', 'advanced-gutenberg')
  }, {
    slug: 1,
    label: __('M', 'advanced-gutenberg')
  }, {
    slug: 2,
    label: _x('T', 'Tuesday first letter', 'advanced-gutenberg')
  }, {
    slug: 3,
    label: __('W', 'advanced-gutenberg')
  }, {
    slug: 4,
    label: _x('T', 'Thursday first letter', 'advanced-gutenberg')
  }, {
    slug: 5,
    label: __('F', 'advanced-gutenberg')
  }, {
    slug: 6,
    label: _x('S', 'Saturday first letter', 'advanced-gutenberg')
  }];
  var label = props.label,
    _props$days = props.days,
    days = _props$days === void 0 ? [] : _props$days,
    onChangeDays = props.onChangeDays;

  // Use a single state variable to store the selected days
  var _useState3 = useState(Array.isArray(days) ? days : []),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedDays = _useState4[0],
    setSelectedDays = _useState4[1];

  /**
  * Check if the day is selected or not
  *
  * @since 3.1.2
  *
  * @param {string} Day slug e.g. 'u' for Sunday, 't' for Tuesday
  *
  * @return {bool}
  */
  function isDaySelected(slug) {
    return selectedDays.some(function (el) {
      return el === slug;
    });
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
  function onChangeDay(slug) {
    // Check if the day is already selected
    var isSelected = isDaySelected(slug);

    // Create a new array with the updated selection
    var updatedDays;
    if (isSelected) {
      // Remove the day from the selected days
      updatedDays = selectedDays.filter(function (el) {
        return el !== slug;
      });
    } else {
      // Add the day to the selected days
      var findDay = allDays.find(function (el) {
        return el.slug === slug;
      });
      updatedDays = [].concat(_toConsumableArray(selectedDays), [findDay.slug]);
    }

    // Remove duplicates
    var uniqueDays = _toConsumableArray(new Set(updatedDays));

    // Update the selected days state
    setSelectedDays(uniqueDays);

    // Call the onChangeDays prop to notify the parent component of the change
    if (onChangeDays) {
      onChangeDays(updatedDays);
    }
  }
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "advgb-checkbox-wrapper"
  }, /*#__PURE__*/React.createElement("label", null, label), /*#__PURE__*/React.createElement("div", {
    className: "advgb-checkbox-inline"
  }, allDays.map(function (day) {
    return /*#__PURE__*/React.createElement(CheckboxControl, {
      label: day.label,
      checked: isDaySelected(day.slug),
      onChange: function onChange() {
        return onChangeDay(day.slug);
      }
    });
  }))));
}
var AdvTimeClass = /*#__PURE__*/function (_Component) {
  function AdvTimeClass(props) {
    var _this;
    _classCallCheck(this, AdvTimeClass);
    _this = _callSuper(this, AdvTimeClass, [props]);
    _this.state = {
      onChangeTime: null,
      currentTime: _this.props.currentTime || null,
      hours: null,
      minutes: null,
      meridian: 'am',
      onInit: true
    };
    return _this;
  }
  _inherits(AdvTimeClass, _Component);
  return _createClass(AdvTimeClass, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this$state = this.state,
        onChangeTime = _this$state.onChangeTime,
        currentTime = _this$state.currentTime,
        onInit = _this$state.onInit;
      if (this.props.onChangeTime !== onChangeTime) {
        this.setState({
          onChangeTime: this.props.onChangeTime
        });
      }
      if (this.props.currentTime !== currentTime) {
        this.setState({
          currentTime: this.props.currentTime
        });
      }

      // Init
      if (currentTime && currentTime.includes(':') && onInit) {
        this.setState({
          hours: currentTime.split(':')[0],
          minutes: currentTime.split(':')[1],
          meridian: parseInt(currentTime.split(':')[0]) > 11 ? 'pm' : 'am',
          // We set > 11 because PM starts from 12:00:00
          onInit: false
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props = this.props,
        onChangeTime = _this$props.onChangeTime,
        currentTime = _this$props.currentTime;
      var _this$state2 = this.state,
        hours = _this$state2.hours,
        minutes = _this$state2.minutes,
        meridian = _this$state2.meridian;
      var prevHours = prevState.hours,
        prevMinutes = prevState.minutes,
        prevMeridian = prevState.meridian;
      if (hours !== prevHours || minutes !== prevMinutes || meridian !== prevMeridian) {
        // When clearing time
        if (!hours && !minutes) {
          return;
        }

        // Default minutes when hours selected
        if (hours && !minutes) {
          this.setState({
            minutes: '00'
          });
        }

        // Default hours when minutes selected
        if (minutes && !hours) {
          this.setState({
            hours: '01'
          });
        }

        /* Convert 12-hours to 24-hours.
         * e.g. 12:00 AM becomes 00:00:00
         *      12:00 PM becomes 12:00:00
         *      01:00 PM becomes 13:00:00
         */
        var savedTime = "".concat(this.appendZero(hour_convert__WEBPACK_IMPORTED_MODULE_0___default().to24Hour({
          hour: parseInt(hours),
          meridiem: meridian
        })), ":").concat(minutes, ":00");

        // Value saved in source/attribute
        this.props.onChangeTime(savedTime);
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
  }, {
    key: "appendZero",
    value: function appendZero(value) {
      if (isNaN(value)) {
        return;
      }
      var res = parseInt(value);
      return res > 9 ? res : "0".concat(res);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$state3 = this.state,
        onChangeTime = _this$state3.onChangeTime,
        currentTime = _this$state3.currentTime,
        hours = _this$state3.hours,
        minutes = _this$state3.minutes,
        meridian = _this$state3.meridian;

      // Make sure hours are valid. 01: min, 12: max
      var handleChangeHours = function handleChangeHours(event) {
        var value = Math.max(1, Math.min(12, Number(event.target.value)));
        _this2.setState({
          hours: _this2.appendZero(value)
        });
      };

      // Allow to use up/down keys for hours
      var handleKeyDownHours = function handleKeyDownHours(event) {
        var value = Number(event.target.value);
        if (event.key === 'ArrowUp' && value < 12) {
          _this2.setState({
            hours: _this2.appendZero(value + 1)
          });
        } else if (event.key === 'ArrowDown' && value > 1) {
          _this2.setState({
            hours: _this2.appendZero(value - 1)
          });
        }
      };

      // Make sure minutes are valid. 01: min, 59: max
      var handleChangeMinutes = function handleChangeMinutes(event) {
        var value = Math.max(0, Math.min(59, Number(event.target.value)));
        _this2.setState({
          minutes: _this2.appendZero(value)
        });
      };

      // Allow to use up/down keys for minutes
      var handleKeyDownMinutes = function handleKeyDownMinutes(event) {
        var value = Number(event.target.value);
        if (event.key === 'ArrowUp' && value < 59) {
          _this2.setState({
            minutes: _this2.appendZero(value + 1)
          });
        } else if (event.key === 'ArrowDown' && value > 0) {
          _this2.setState({
            minutes: _this2.appendZero(value - 1)
          });
        }
      };
      return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "advgb-advtime-control"
      }, /*#__PURE__*/React.createElement("label", null, this.props.label), /*#__PURE__*/React.createElement("div", {
        className: "advgb-advtime-hours-minutes"
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        value: hours ? this.appendZero(hour_convert__WEBPACK_IMPORTED_MODULE_0___default().to12Hour(parseInt(hours)).hour) : '',
        onChange: handleChangeHours,
        onKeyDown: handleKeyDownHours,
        placeholder: "--"
      }), /*#__PURE__*/React.createElement("span", null, ":"), /*#__PURE__*/React.createElement("input", {
        type: "text",
        value: minutes ? minutes : '',
        onChange: handleChangeMinutes,
        onKeyDown: handleKeyDownMinutes,
        placeholder: "--"
      })), /*#__PURE__*/React.createElement(ButtonGroup, {
        className: "advgb-advtime-meridian"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: meridian === null || meridian === 'am' ? 'primary' : 'secondary',
        onClick: function onClick() {
          _this2.setState({
            meridian: 'am'
          });
        },
        disabled: hours && minutes ? false : true
      }, __('AM', 'advanced-gutenberg')), /*#__PURE__*/React.createElement(Button, {
        variant: meridian === 'pm' ? 'primary' : 'secondary',
        onClick: function onClick() {
          _this2.setState({
            meridian: 'pm'
          });
        },
        disabled: hours && minutes ? false : true
      }, __('PM', 'advanced-gutenberg'))), hours && minutes && /*#__PURE__*/React.createElement(Button, {
        className: "advgb-advtime-remove-icon",
        icon: "no-alt",
        onClick: function onClick() {
          _this2.props.onTimeClear();
          _this2.setState({
            hours: null,
            minutes: null,
            meridian: 'am'
          });
        }
      })));
    }
  }]);
}(Component);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AdvTimeClass);
function AdvTimeControl(props) {
  var label = props.label,
    currentTime = props.currentTime,
    onChangeTime = props.onChangeTime,
    onTimeClear = props.onTimeClear;
  return /*#__PURE__*/React.createElement(AdvTimeClass, {
    label: label,
    currentTime: currentTime,
    onChangeTime: onChangeTime,
    onTimeClear: onTimeClear
  });
}
function AdvTimezoneControl(props) {
  var label = props.label,
    defaultTimezone = props.defaultTimezone;
  return /*#__PURE__*/React.createElement(Fragment, null, applyFilters('advgb.timezoneControl', /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "advgb-promo-overlay-area"
  }, /*#__PURE__*/React.createElement("div", {
    className: "advgb-blur"
  }, label, /*#__PURE__*/React.createElement(SelectControl, {
    value: defaultTimezone,
    options: [{
      label: defaultTimezone,
      value: defaultTimezone
    }],
    disabled: true
  })), /*#__PURE__*/React.createElement("div", {
    class: "advgb-pro-overlay-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    class: "advgb-pro-small-overlay-text advgb-tooltips ppb-tooltips-library click",
    "data-toggle": "ppbtooltip",
    "data-placement": "top"
  }, /*#__PURE__*/React.createElement("span", {
    class: "advgb-promo-text"
  }, /*#__PURE__*/React.createElement("span", {
    class: "dashicons dashicons-lock",
    style: {
      color: 'initial'
    }
  }), " ", __('Pro feature', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("span", {
    class: "tooltip-text"
  }, /*#__PURE__*/React.createElement("p", null, __('PublishPress Blocks Pro supports Timezone configuration.', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    class: "clickable",
    href: "https://publishpress.com/links/blocks",
    target: "_blank"
  }, __('Upgrade to Pro', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("i", null))))), /*#__PURE__*/React.createElement(React.Fragment, null)), props));
}

/***/ },

/***/ "./assets/blocks/0-adv-components/utils.jsx"
/*!**************************************************!*\
  !*** ./assets/blocks/0-adv-components/utils.jsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getOptionSlugs: () => (/* binding */ getOptionSlugs),
/* harmony export */   getOptionSuggestions: () => (/* binding */ getOptionSuggestions),
/* harmony export */   getOptionTitles: () => (/* binding */ getOptionTitles)
/* harmony export */ });
/**
 * Generate option title suggestions
 *
 * @since 3.1.1
 * @param options Available options as objects with slug and title. e.g. [{slug: 'subscriber', title: 'Subscriber'}, {slug: 'new_customer', title: 'New Customer'}]
 *
 * @return {array}  Option slugs. e.g. ['subscriber','new_customer']
 */
var getOptionSuggestions = function getOptionSuggestions(options) {
  return options.map(function (item) {
    return item.title;
  });
};

/**
 * Match option slugs with its option titles
 * to display as field value (but NOT saved!).
 *
 * @since 3.1.1
 * @param slugs     Option slugs. e.g. ['subscriber','new_customer'] or [82, 92]
 * @param options   Available options as objects with slug and title. e.g. [{slug: 'subscriber', title: 'Subscriber'}, {slug: 'new_customer', title: 'New Customer'}]
 *
 * @return {array}  Option titles. e.g. ['Subscriber','New Customer']
 */
var getOptionTitles = function getOptionTitles(slugs, options) {
  var field_value = [];
  if (options !== null) {
    field_value = slugs.map(function (option_slug) {
      var find_option = options.find(function (item) {
        return item.slug === option_slug;
      });
      if (find_option === undefined || !find_option) {
        return option_slug; // It should return false but creates empty selections
      }
      return find_option.title;
    });
  }
  return field_value;
};

/**
 * Match option titles with its slugs, and save slugs
 *
 * @since 3.1.1
 * @param slugs     Option slugs. e.g. ['subscriber','new_customer']
 * @param options   Available options as objects with slug and title. e.g. [{slug: 'subscriber', title: 'Subscriber'}, {slug: 'new_customer', title: 'New Customer'}]
 *
 * @return {array}  Option slugs. e.g. ['subscriber','new_customer']
 */
var getOptionSlugs = function getOptionSlugs(slugs, options) {
  var slugs_array = [];
  slugs.map(function (option_title) {
    var matching_slug = options.find(function (item) {
      return item.title === option_title;
    });
    if (matching_slug !== undefined) {
      slugs_array.push(matching_slug.slug);
    }
  });
  return slugs_array;
};

/***/ },

/***/ "./node_modules/hour-convert/index.js"
/*!********************************************!*\
  !*** ./node_modules/hour-convert/index.js ***!
  \********************************************/
(module) {



module.exports = {

    /**
     * Convert 24-hour time to 12-hour format.
     *
     * @param {number} hour Hour to convert (0-23)
     * @return {object} { hour, meridiem } (meridian is also returned for backwards compatibility)
     */
    to12Hour: function to12Hour(hour) {
        var meridiem = hour < 12 ? 'am' : 'pm';
        return {
            hour: ((hour + 11) % 12 + 1),
            meridiem: meridiem,
            meridian: meridiem
        };
    },

    /**
     * Convert 12-hour time to 24-hour format.
     *
     * @param {object} time Time object
     * @param {number} time.hour Hour to convert (1-12)
     * @param {string} time.meridiem Hour meridiem (am/pm). 'time.meridian' is
     *  supported for backwards compatibility.
     * @return {number}
     */
    to24Hour: function to24Hour(time) {
        var meridiem = time.meridiem || time.meridian;
        return (meridiem === 'am' ? 0 : 12) + (time.hour % 12);
    }
};


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************************************!*\
  !*** ./assets/pages/block-controls/preset-manager.jsx ***!
  \********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _blocks_0_adv_components_datetime_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../blocks/0-adv-components/datetime.jsx */ "./assets/blocks/0-adv-components/datetime.jsx");
/* harmony import */ var _blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../blocks/0-adv-components/utils.jsx */ "./assets/blocks/0-adv-components/utils.jsx");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }


(function (wpI18n, wpComponents, wpElement, wpData) {
  var __ = wpI18n.__,
    sprintf = wpI18n.sprintf;
  var Card = wpComponents.Card,
    CardBody = wpComponents.CardBody,
    CardHeader = wpComponents.CardHeader,
    Button = wpComponents.Button,
    TextControl = wpComponents.TextControl,
    TextareaControl = wpComponents.TextareaControl,
    SelectControl = wpComponents.SelectControl,
    ToggleControl = wpComponents.ToggleControl,
    RangeControl = wpComponents.RangeControl,
    FormTokenField = wpComponents.FormTokenField,
    Modal = wpComponents.Modal,
    Notice = wpComponents.Notice,
    Spinner = wpComponents.Spinner,
    PanelBody = wpComponents.PanelBody,
    BaseControl = wpComponents.BaseControl,
    RadioControl = wpComponents.RadioControl,
    DateTimePicker = wpComponents.DateTimePicker;
  var Component = wpElement.Component,
    Fragment = wpElement.Fragment;
  var useSelect = wpData.useSelect,
    useDispatch = wpData.useDispatch;
  var ScheduleControl = function ScheduleControl(_ref) {
    var index = _ref.index,
      schedule = _ref.schedule,
      _onChange = _ref.onChange,
      onRemove = _ref.onRemove,
      getTimezoneLabel = _ref.getTimezoneLabel,
      getTimezoneSlug = _ref.getTimezoneSlug,
      canRemove = _ref.canRemove;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 5,
        padding: 5,
        border: '1px solid #ddd',
        borderRadius: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("h4", null, sprintf(__('Schedule #%d', 'advanced-gutenberg'), index + 1)), canRemove && /*#__PURE__*/React.createElement(Button, {
      isDestructive: true,
      isLink: true,
      onClick: onRemove
    }, __('Remove', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement(_blocks_0_adv_components_datetime_jsx__WEBPACK_IMPORTED_MODULE_0__.AdvDateTimeControl, {
      buttonLabel: __('Now', 'advanced-gutenberg'),
      dateLabel: __('Start showing', 'advanced-gutenberg'),
      date: schedule.dateFrom,
      onChangeDate: function onChangeDate(newDate) {
        return _onChange('dateFrom', newDate);
      },
      onDateClear: function onDateClear() {
        return _onChange('dateFrom', null);
      },
      onInvalidDate: false
    }), /*#__PURE__*/React.createElement(_blocks_0_adv_components_datetime_jsx__WEBPACK_IMPORTED_MODULE_0__.AdvDateTimeControl, {
      buttonLabel: __('Never', 'advanced-gutenberg'),
      dateLabel: __('Stop showing', 'advanced-gutenberg'),
      date: schedule.dateTo || null,
      onChangeDate: function onChangeDate(newDate) {
        return _onChange('dateTo', newDate);
      },
      onDateClear: function onDateClear() {
        return _onChange('dateTo', null);
      },
      onInvalidDate: function onInvalidDate(date) {
        if (schedule.dateFrom) {
          var thisDate = new Date(date.getTime());
          thisDate.setHours(0, 0, 0, 0);
          var fromDate = new Date(schedule.dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          return thisDate.getTime() < fromDate.getTime();
        }
        return false;
      }
    }), schedule.dateFrom && schedule.dateTo && /*#__PURE__*/React.createElement(ToggleControl, {
      label: __('Recurring', 'advanced-gutenberg'),
      checked: schedule.recurring || false,
      onChange: function onChange() {
        return _onChange('recurring', !schedule.recurring);
      },
      help: __('If Recurring is enabled, this block will be displayed every year between the selected dates.', 'advanced-gutenberg')
    }), /*#__PURE__*/React.createElement(_blocks_0_adv_components_datetime_jsx__WEBPACK_IMPORTED_MODULE_0__.AdvDaysControl, {
      label: __('On these days (optional)', 'advanced-gutenberg'),
      days: schedule.days || [],
      onChangeDays: function onChangeDays(value) {
        return _onChange('days', value);
      }
    }), /*#__PURE__*/React.createElement("label", {
      style: {
        marginBottom: 8,
        display: 'block'
      }
    }, __('Between these times (optional)', 'advanced-gutenberg')), /*#__PURE__*/React.createElement(_blocks_0_adv_components_datetime_jsx__WEBPACK_IMPORTED_MODULE_0__.AdvTimeControl, {
      label: __('From', 'advanced-gutenberg'),
      currentTime: schedule.timeFrom || null,
      onChangeTime: function onChangeTime(newTime) {
        return _onChange('timeFrom', newTime);
      },
      onTimeClear: function onTimeClear() {
        return _onChange('timeFrom', null);
      }
    }), /*#__PURE__*/React.createElement(_blocks_0_adv_components_datetime_jsx__WEBPACK_IMPORTED_MODULE_0__.AdvTimeControl, {
      label: __('To', 'advanced-gutenberg'),
      currentTime: schedule.timeTo || null,
      onChangeTime: function onChangeTime(newTime) {
        return _onChange('timeTo', newTime);
      },
      onTimeClear: function onTimeClear() {
        return _onChange('timeTo', null);
      }
    }), schedule.timeFrom && schedule.timeTo && '01/01/2020T' + schedule.timeFrom >= '01/01/2020T' + schedule.timeTo && /*#__PURE__*/React.createElement(Notice, {
      className: "advgb-notice-sidebar",
      status: "warning",
      isDismissible: false
    }, __('"To" time should be after "From" time!', 'advanced-gutenberg')), /*#__PURE__*/React.createElement(_blocks_0_adv_components_datetime_jsx__WEBPACK_IMPORTED_MODULE_0__.AdvTimezoneControl, {
      label: __('Timezone', 'advanced-gutenberg'),
      defaultTimezone: getTimezoneLabel(),
      value: schedule.timezone || getTimezoneSlug(),
      onChangeTimezone: function onChangeTimezone(value) {
        return _onChange('timezone', value);
      }
    }));
  };
  var PresetManager = /*#__PURE__*/function (_Component) {
    function PresetManager(props) {
      var _this;
      _classCallCheck(this, PresetManager);
      _this = _callSuper(this, PresetManager, [props]);
      _this.state = {
        presets: [],
        currentPreset: _this.getDefaultPreset(),
        editingPreset: null,
        showModal: false,
        modalMode: 'create',
        // 'create' or 'edit',
        loading: false,
        saving: false,
        error: null,
        deleting: false,
        deletingPresetId: null,
        lastAction: null // 'created', 'cancelled', 'deleted', 'saved', 'loaded'
      };
      _this.messageContainerRef = React.createRef();
      _this.handleModalClose = _this.handleModalClose.bind(_this);
      _this.createNewPreset = _this.createNewPreset.bind(_this);
      _this.editPreset = _this.editPreset.bind(_this);
      _this.savePreset = _this.savePreset.bind(_this);
      _this.deletePreset = _this.deletePreset.bind(_this);
      _this.addControlSet = _this.addControlSet.bind(_this);
      _this.removeControlSet = _this.removeControlSet.bind(_this);
      _this.addRuleToSet = _this.addRuleToSet.bind(_this);
      _this.removeRuleFromSet = _this.removeRuleFromSet.bind(_this);
      _this.updateRuleData = _this.updateRuleData.bind(_this);
      return _this;
    }
    _inherits(PresetManager, _Component);
    return _createClass(PresetManager, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.setState({
          loading: true
        });
        this.initializePresets();
        this.setupDataSync();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.dataUnsubscribe && window.AdvGBPresetData) {
          window.AdvGBPresetData.unsubscribe(this.dataUnsubscribe);
        }
      }
    }, {
      key: "setupDataSync",
      value: function setupDataSync() {
        var _this2 = this;
        // Sync with global data changes
        if (window.AdvGBPresetData && window.AdvGBPresetData.subscribe) {
          this.dataUnsubscribe = window.AdvGBPresetData.subscribe(function (presets) {
            _this2.setState({
              presets: Array.isArray(presets) ? presets : [],
              // Clear editing state if the current preset was deleted
              editingPreset: _this2.state.editingPreset && presets.find(function (p) {
                return p.id === _this2.state.editingPreset.id;
              }) ? _this2.state.editingPreset : null,
              currentPreset: _this2.state.currentPreset && presets.find(function (p) {
                return p.id === _this2.state.currentPreset.id;
              }) ? _this2.state.currentPreset : null
            });
          });
        }
      }
    }, {
      key: "createSamplePresets",
      value: function () {
        var _createSamplePresets = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
          var response;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                this.setState({
                  loading: true,
                  error: null
                });
                _context.prev = 1;
                _context.next = 4;
                return wp.apiFetch({
                  path: '/advgb/v1/sample-presets',
                  method: 'POST'
                });
              case 4:
                response = _context.sent;
                if (response.success) {
                  if (window.AdvGBPresetData) {
                    window.AdvGBPresetData.updatePresets(response.presets, 'add');
                  }
                  this.setState({
                    presets: response.presets,
                    lastAction: 'installed',
                    loading: false
                  });
                }
                _context.next = 12;
                break;
              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);
                console.error('Failed to create sample presets:', _context.t0);
                this.setState({
                  error: __('Failed to create sample presets', 'advanced-gutenberg'),
                  loading: false
                });
              case 12:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[1, 8]]);
        }));
        function createSamplePresets() {
          return _createSamplePresets.apply(this, arguments);
        }
        return createSamplePresets;
      }()
    }, {
      key: "initializePresets",
      value: function () {
        var _initializePresets = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          var presets;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.waitForGlobalData();
              case 3:
                _context2.next = 5;
                return this.loadPresetsFromSources();
              case 5:
                presets = _context2.sent;
                this.setState({
                  presets: presets,
                  loading: false,
                  currentPreset: this.getDefaultPreset()
                });
                _context2.next = 13;
                break;
              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](0);
                console.error('Failed to initialize presets:', _context2.t0);
                this.setState({
                  loading: false,
                  error: __('Failed to load presets', 'advanced-gutenberg')
                });
              case 13:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this, [[0, 9]]);
        }));
        function initializePresets() {
          return _initializePresets.apply(this, arguments);
        }
        return initializePresets;
      }()
    }, {
      key: "waitForGlobalData",
      value: function waitForGlobalData() {
        return new Promise(function (resolve) {
          var checkData = function checkData() {
            if (window.AdvGBPresetData || window.advgb_block_controls_vars && window.advgb_block_controls_vars.presets) {
              resolve();
            } else {
              setTimeout(checkData, 100);
            }
          };
          checkData();
        });
      }
    }, {
      key: "loadPresetsFromSources",
      value: function () {
        var _loadPresetsFromSources = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
          var response, globalPresets, _globalPresets;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return wp.apiFetch({
                  path: '/advgb/v1/presets'
                });
              case 3:
                response = _context3.sent;
                if (!Array.isArray(response)) {
                  _context3.next = 6;
                  break;
                }
                return _context3.abrupt("return", response);
              case 6:
                if (!(window.AdvGBPresetData && typeof window.AdvGBPresetData.getAllPresets === 'function')) {
                  _context3.next = 10;
                  break;
                }
                globalPresets = window.AdvGBPresetData.getAllPresets();
                if (!Array.isArray(globalPresets)) {
                  _context3.next = 10;
                  break;
                }
                return _context3.abrupt("return", globalPresets);
              case 10:
                return _context3.abrupt("return", []);
              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](0);
                console.warn('Failed to load presets:', _context3.t0);

                // Try global data as fallback
                if (!(window.AdvGBPresetData && typeof window.AdvGBPresetData.getAllPresets === 'function')) {
                  _context3.next = 20;
                  break;
                }
                _globalPresets = window.AdvGBPresetData.getAllPresets();
                if (!Array.isArray(_globalPresets)) {
                  _context3.next = 20;
                  break;
                }
                return _context3.abrupt("return", _globalPresets);
              case 20:
                return _context3.abrupt("return", []);
              case 21:
              case "end":
                return _context3.stop();
            }
          }, _callee3, null, [[0, 13]]);
        }));
        function loadPresetsFromSources() {
          return _loadPresetsFromSources.apply(this, arguments);
        }
        return loadPresetsFromSources;
      }()
    }, {
      key: "loadPresets",
      value: function loadPresets() {
        if (window.AdvGBPresetData) {
          this.setState({
            presets: window.AdvGBPresetData.getAllPresets(),
            loading: false
          });
        }
      }
    }, {
      key: "getDefaultPreset",
      value: function getDefaultPreset() {
        var defaultpreset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        return {
          id: null,
          default: defaultpreset,
          title: '',
          controlSets: [],
          created: null,
          modified: null
        };
      }
    }, {
      key: "savePreset",
      value: function () {
        var _savePreset = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(presetData) {
          var _this3 = this;
          var response, newPreset, updatedPresets;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                this.setState({
                  saving: true,
                  error: null
                });
                _context4.prev = 1;
                _context4.next = 4;
                return wp.apiFetch({
                  path: '/advgb/v1/presets',
                  method: 'POST',
                  data: presetData
                });
              case 4:
                response = _context4.sent;
                if (!response.success) {
                  _context4.next = 11;
                  break;
                }
                _context4.next = 8;
                return this.loadPresets();
              case 8:
                newPreset = response.presets.find(function (p) {
                  return p.id === response.id;
                });
                if (newPreset) {
                  updatedPresets = response.presets || [];
                  if (window.AdvGBPresetData) {
                    window.AdvGBPresetData.updatePresets(updatedPresets);
                  }
                  this.setState({
                    editingPreset: null,
                    currentPreset: null,
                    saving: false,
                    showModal: false,
                    lastAction: 'saved'
                  }, function () {
                    // Scroll to top after state update
                    _this3.scrollToMessage();
                  });
                } else {
                  this.setState({
                    saving: false,
                    showModal: false,
                    lastAction: 'saved'
                  }, function () {
                    _this3.scrollToMessage();
                  });
                }
                return _context4.abrupt("return", response);
              case 11:
                _context4.next = 17;
                break;
              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](1);
                this.setState({
                  error: _context4.t0.message,
                  saving: false,
                  lastAction: 'error'
                }, function () {
                  _this3.scrollToMessage();
                });
                throw _context4.t0;
              case 17:
              case "end":
                return _context4.stop();
            }
          }, _callee4, this, [[1, 13]]);
        }));
        function savePreset(_x) {
          return _savePreset.apply(this, arguments);
        }
        return savePreset;
      }()
    }, {
      key: "deletePreset",
      value: function () {
        var _deletePreset = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(presetId) {
          var _this4 = this;
          var response;
          return _regeneratorRuntime().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                this.setState({
                  deleting: true,
                  deletingPresetId: presetId
                });
                _context5.prev = 1;
                _context5.next = 4;
                return wp.apiFetch({
                  path: "/advgb/v1/presets/".concat(presetId),
                  method: 'DELETE'
                });
              case 4:
                response = _context5.sent;
                if (!response.success) {
                  _context5.next = 11;
                  break;
                }
                if (window.AdvGBPresetData) {
                  window.AdvGBPresetData.updatePresets(response.presets, 'delete');
                }
                if (this.state.editingPreset && this.state.editingPreset.id === presetId) {
                  this.setState({
                    editingPreset: null,
                    currentPreset: this.getDefaultPreset()
                  });
                }
                this.setState({
                  deleting: false,
                  deletingPresetId: null,
                  currentPreset: null,
                  editingPreset: null,
                  lastAction: 'deleted'
                }, function () {
                  _this4.scrollToMessage();
                });
                _context5.next = 11;
                return this.loadPresets();
              case 11:
                _context5.next = 16;
                break;
              case 13:
                _context5.prev = 13;
                _context5.t0 = _context5["catch"](1);
                this.setState({
                  deleting: false,
                  deletingPresetId: null,
                  error: _context5.t0.message
                }, function () {
                  _this4.scrollToMessage();
                });
              case 16:
              case "end":
                return _context5.stop();
            }
          }, _callee5, this, [[1, 13]]);
        }));
        function deletePreset(_x2) {
          return _deletePreset.apply(this, arguments);
        }
        return deletePreset;
      }()
    }, {
      key: "createNewPreset",
      value: function createNewPreset() {
        var _this5 = this;
        this.setState({
          currentPreset: this.getDefaultPreset(false),
          editingPreset: null,
          modalMode: 'create',
          showModal: true,
          lastAction: 'creating'
        }, function () {
          _this5.scrollToMessage();
        });
      }
    }, {
      key: "editPreset",
      value: function editPreset(preset) {
        var _this6 = this;
        this.setState({
          currentPreset: _objectSpread({}, preset),
          modalMode: 'edit',
          editingPreset: preset,
          showModal: true,
          lastAction: 'editing'
        }, function () {
          _this6.scrollToMessage();
        });
      }
    }, {
      key: "scrollToMessage",
      value: function scrollToMessage() {
        var _this7 = this;
        console.log('now?');
        setTimeout(function () {
          console.log('wn?');
          console.log(_this7.messageContainerRef);
          console.log(_this7.messageContainerRef.current);
          if (_this7.messageContainerRef.current) {
            _this7.messageContainerRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            console.log('scroll');
          }
        }, 100);
      }
    }, {
      key: "toggleControlSet",
      value: function toggleControlSet(setIndex) {
        var currentPreset = this.state.currentPreset;
        var newControlSets = _toConsumableArray(currentPreset.controlSets);
        var isCurrentlyExpanded = newControlSets[setIndex].expanded !== false;
        newControlSets[setIndex].expanded = !isCurrentlyExpanded;
        this.setState({
          currentPreset: _objectSpread(_objectSpread({}, currentPreset), {}, {
            controlSets: newControlSets
          })
        });
      }
    }, {
      key: "toggleRule",
      value: function toggleRule(setIndex, ruleIndex) {
        var currentPreset = this.state.currentPreset;
        var newControlSets = _toConsumableArray(currentPreset.controlSets);
        var isCurrentlyExpanded = newControlSets[setIndex].rules[ruleIndex].expanded !== false;
        newControlSets[setIndex].rules[ruleIndex].expanded = !isCurrentlyExpanded;
        this.setState({
          currentPreset: _objectSpread(_objectSpread({}, currentPreset), {}, {
            controlSets: newControlSets
          })
        });
      }
    }, {
      key: "isControlSetExpanded",
      value: function isControlSetExpanded(setIndex) {
        var currentPreset = this.state.currentPreset;
        if (!currentPreset.controlSets || !currentPreset.controlSets[setIndex]) {
          return true;
        }
        return currentPreset.controlSets[setIndex].expanded !== false;
      }
    }, {
      key: "isRuleExpanded",
      value: function isRuleExpanded(setIndex, ruleIndex) {
        var currentPreset = this.state.currentPreset;
        if (!currentPreset.controlSets || !currentPreset.controlSets[setIndex] || !currentPreset.controlSets[setIndex].rules || !currentPreset.controlSets[setIndex].rules[ruleIndex]) {
          return true;
        }
        return currentPreset.controlSets[setIndex].rules[ruleIndex].expanded !== false;
      }
    }, {
      key: "addControlSet",
      value: function addControlSet() {
        var newControlSet = {
          id: Date.now().toString(),
          rules: [],
          expanded: true
        };
        var updatedControlSets = [newControlSet].concat(_toConsumableArray(this.state.currentPreset.controlSets));
        this.setState({
          currentPreset: _objectSpread(_objectSpread({}, this.state.currentPreset), {}, {
            controlSets: updatedControlSets
          })
        });
      }
    }, {
      key: "removeControlSet",
      value: function removeControlSet(setIndex) {
        var currentPreset = this.state.currentPreset;
        var newControlSets = currentPreset.controlSets.filter(function (_, index) {
          return index !== setIndex;
        });
        this.setState({
          currentPreset: _objectSpread(_objectSpread({}, currentPreset), {}, {
            controlSets: newControlSets
          })
        });
      }
    }, {
      key: "addRuleToSet",
      value: function addRuleToSet(setIndex, ruleType) {
        var newRule = this.createRuleByType(ruleType);
        var updatedControlSets = _toConsumableArray(this.state.currentPreset.controlSets);
        updatedControlSets[setIndex].rules.unshift(newRule);
        this.setState({
          currentPreset: _objectSpread(_objectSpread({}, this.state.currentPreset), {}, {
            controlSets: updatedControlSets
          })
        });
      }
    }, {
      key: "createRuleByType",
      value: function createRuleByType(ruleType) {
        var baseRule = {
          id: Date.now(),
          type: ruleType,
          enabled: true,
          expanded: true
        };
        switch (ruleType) {
          case 'schedule':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              schedules: []
            });
          case 'user_role':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              roles: [],
              approach: 'include'
            });
          case 'device_type':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              devices: []
            });
          case 'device_width':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              min_width: '',
              max_width: ''
            });
          case 'browser_device':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              browsers: [],
              approach: 'include'
            });
          case 'operating_system':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              systems: [],
              approach: 'include'
            });
          case 'cookie':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              name: '',
              condition: '=',
              value: '',
              approach: 'include'
            });
          case 'user_meta':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              key: '',
              condition: '=',
              value: '',
              approach: 'include'
            });
          case 'post_meta':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              key: '',
              condition: '=',
              value: '',
              approach: 'include'
            });
          case 'query_string':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              queries: [],
              logic: 'all',
              approach: 'include'
            });
          case 'capabilities':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              capabilities: [],
              approach: 'include'
            });
          case 'archive':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              taxonomies: [],
              approach: 'include'
            });
          case 'page':
            return _objectSpread(_objectSpread({}, baseRule), {}, {
              pages: [],
              approach: 'include'
            });
          default:
            return baseRule;
        }
      }
    }, {
      key: "getAvailableRuleTypes",
      value: function getAvailableRuleTypes() {
        return [{
          value: 'schedule',
          label: __('Schedule', 'advanced-gutenberg')
        }, {
          value: 'user_role',
          label: __('User Roles', 'advanced-gutenberg')
        }, {
          value: 'device_type',
          label: __('Device Type', 'advanced-gutenberg')
        }, {
          value: 'device_width',
          label: __('Device Width', 'advanced-gutenberg')
        }, {
          value: 'browser_device',
          label: __('Browser', 'advanced-gutenberg')
        }, {
          value: 'operating_system',
          label: __('Operating System', 'advanced-gutenberg')
        }, {
          value: 'cookie',
          label: __('Cookie', 'advanced-gutenberg')
        }, {
          value: 'user_meta',
          label: __('User Meta', 'advanced-gutenberg')
        }, {
          value: 'post_meta',
          label: __('Post Meta', 'advanced-gutenberg')
        }, {
          value: 'query_string',
          label: __('Query String', 'advanced-gutenberg')
        }, {
          value: 'capabilities',
          label: __('Capabilities', 'advanced-gutenberg')
        }, {
          value: 'archive',
          label: __('Archive', 'advanced-gutenberg')
        }, {
          value: 'page',
          label: __('Page', 'advanced-gutenberg')
        }];
      }
    }, {
      key: "formatDate",
      value: function formatDate(dateString) {
        if (!dateString) return __('Never modified', 'advanced-gutenberg');
        try {
          var date = new Date(dateString);
          if (isNaN(date.getTime())) {
            return __('Invalid date', 'advanced-gutenberg');
          }

          // Format: Sep 12, 2025 2:30 PM
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        } catch (error) {
          console.error('Date formatting error:', error);
          return __('Invalid date', 'advanced-gutenberg');
        }
      }
    }, {
      key: "getRuleTypeLabel",
      value: function getRuleTypeLabel(ruleType) {
        var ruleTypes = this.getAvailableRuleTypes();
        var ruleTypeObj = ruleTypes.find(function (type) {
          return type.value === ruleType;
        });
        return ruleTypeObj ? ruleTypeObj.label : ruleType;
      }
    }, {
      key: "renderPresetList",
      value: function renderPresetList() {
        var _this8 = this;
        var _this$state = this.state,
          presets = _this$state.presets,
          editingPreset = _this$state.editingPreset;
        return /*#__PURE__*/React.createElement("div", {
          className: "advgb-presets-list"
        }, (!presets || presets.length === 0) && /*#__PURE__*/React.createElement("div", {
          className: "advgb-empty-presets-message"
        }, /*#__PURE__*/React.createElement("h3", null, __('No presets yet', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("p", null, __('You have not created any preset.', 'advanced-gutenberg'))), presets && presets.length > 0 && presets.map(function (preset) {
          var isActive = editingPreset && editingPreset.id === preset.id;
          var itemClasses = ['advgb-preset-item', isActive && 'active'].filter(Boolean).join(' ');
          return /*#__PURE__*/React.createElement("div", {
            key: preset.id,
            className: itemClasses,
            onClick: function onClick() {
              return _this8.editPreset(preset);
            }
          }, /*#__PURE__*/React.createElement("div", {
            className: "advgb-preset-content"
          }, /*#__PURE__*/React.createElement("span", {
            className: "advgb-preset-title",
            title: preset.title
          }, preset.title)), /*#__PURE__*/React.createElement("div", {
            className: "advgb-preset-list-actions"
          }, /*#__PURE__*/React.createElement(Button, {
            isSmall: true,
            icon: "edit",
            label: __('Edit', 'advanced-gutenberg'),
            onClick: function onClick(e) {
              e.stopPropagation();
              _this8.editPreset(preset);
            }
          })));
        }));
      }
    }, {
      key: "renderPresetForm",
      value: function renderPresetForm() {
        var _this9 = this;
        var _this$state2 = this.state,
          currentPreset = _this$state2.currentPreset,
          saving = _this$state2.saving,
          deleting = _this$state2.deleting;
        if (!currentPreset) return null;
        return /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-form"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-header"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-title-section"
        }, /*#__PURE__*/React.createElement(TextControl, {
          label: __('Preset Title', 'advanced-gutenberg'),
          value: currentPreset.title || '',
          onChange: function onChange(title) {
            return _this9.setState({
              currentPreset: _objectSpread(_objectSpread({}, currentPreset), {}, {
                title: title
              })
            });
          },
          placeholder: __('Enter preset name', 'advanced-gutenberg'),
          className: "advgb-title-input"
        }))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-control-sets-container"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-control-sets-header"
        }, /*#__PURE__*/React.createElement("h3", null, __('Control Sets', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("p", {
          className: "advgb-control-sets-description"
        }, __('Show the block if any control set applies. Each set can contain multiple rules.', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("button", {
          type: "button",
          className: "button button-secondary",
          onClick: this.addControlSet
        }, __('Add Control Set', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-control-sets"
        }, (currentPreset.controlSets || []).map(function (controlSet, index) {
          return /*#__PURE__*/React.createElement(Fragment, {
            key: controlSet.id || index
          }, index > 0 && /*#__PURE__*/React.createElement("div", {
            className: "advgb-set-separator"
          }, /*#__PURE__*/React.createElement("span", {
            className: "advgb-separator-text"
          }, __('OR', 'advanced-gutenberg'))), _this9.renderControlSet(controlSet, index));
        }))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-actions"
        }, currentPreset.id && /*#__PURE__*/React.createElement("div", {
          className: "ppb-tooltips-library click advgb-delete-preset-tooltip",
          "data-toggle": "ppbtooltip",
          "data-placement": "top"
        }, /*#__PURE__*/React.createElement("button", {
          className: "advgb-delete-preset-btn button button-secondary advgb-destructive-button",
          disabled: deleting || saving
        }, deleting ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spinner, null), __('Deleting...', 'advanced-gutenberg')) : __('Delete Preset', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("div", {
          className: "tooltip-text"
        }, /*#__PURE__*/React.createElement("p", null, __('Are you sure you want to delete preset?', 'advanced-gutenberg'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          isDestructive: true,
          label: __('Delete Preset', 'advanced-gutenberg'),
          onClick: function onClick(e) {
            _this9.deletePreset(currentPreset.id);
          }
        }, /*#__PURE__*/React.createElement("strong", null, __('Yes, Delete Preset.', 'advanced-gutenberg'))), "|", /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          label: __('No, Cancel', 'advanced-gutenberg')
        }, __('No, Cancel.', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("i", null))), /*#__PURE__*/React.createElement("button", {
          onClick: function onClick() {
            return _this9.savePreset(_this9.state.currentPreset);
          },
          disabled: saving || !currentPreset.title,
          className: "advgb-save-btn button button-primary"
        }, saving ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Spinner, null), __('Saving...', 'advanced-gutenberg')) : __('Save Preset', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("button", {
          className: "button button-secondary",
          onClick: this.handleModalClose,
          disabled: saving
        }, __('Cancel', 'advanced-gutenberg'))));
      }
    }, {
      key: "renderControlSet",
      value: function renderControlSet(controlSet, setIndex) {
        var _this10 = this;
        var isExpanded = this.isControlSetExpanded(setIndex);
        return /*#__PURE__*/React.createElement("div", {
          className: "advgb-control-set",
          key: controlSet.id || setIndex
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-control-set-header"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-set-info advgb-preset-clickable-area",
          onClick: function onClick() {
            return _this10.toggleControlSet(setIndex);
          }
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-set-title-row"
        }, /*#__PURE__*/React.createElement("span", {
          className: "dashicons dashicons-arrow-".concat(isExpanded ? 'down' : 'right')
        }), /*#__PURE__*/React.createElement("div", {
          className: "title-row-text"
        }, /*#__PURE__*/React.createElement("h4", null, __('Control Set', 'advanced-gutenberg'), " ", setIndex + 1), /*#__PURE__*/React.createElement("p", null, __('Show the block if any rule applies. Rules are evaluated with AND logic.', 'advanced-gutenberg'))))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-set-actions"
        }, /*#__PURE__*/React.createElement(SelectControl, {
          value: "",
          options: [{
            value: '',
            label: __('Add Rule', 'advanced-gutenberg')
          }].concat(_toConsumableArray(this.getAvailableRuleTypes())),
          onChange: function onChange(ruleType) {
            if (ruleType) {
              _this10.addRuleToSet(setIndex, ruleType);
            }
          },
          className: "advgb-add-rule-select"
        }), /*#__PURE__*/React.createElement("div", {
          className: "ppb-tooltips-library click",
          "data-toggle": "ppbtooltip",
          "data-placement": "left"
        }, /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          isDestructive: true,
          icon: "trash",
          label: __('Delete Set', 'advanced-gutenberg')
        }), /*#__PURE__*/React.createElement("div", {
          className: "tooltip-text"
        }, /*#__PURE__*/React.createElement("p", null, __('Are you sure you want to delete set?', 'advanced-gutenberg'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          isDestructive: true,
          label: __('Delete Set', 'advanced-gutenberg'),
          onClick: function onClick() {
            return _this10.removeControlSet(setIndex);
          }
        }, /*#__PURE__*/React.createElement("strong", null, __('Yes, Delete Set.', 'advanced-gutenberg'))), "|", /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          label: __('No, Cancel', 'advanced-gutenberg')
        }, __('No, Cancel.', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("i", null))))), isExpanded && /*#__PURE__*/React.createElement("div", {
          className: "advgb-control-set-rules"
        }, (controlSet.rules || []).map(function (rule, ruleIndex) {
          return /*#__PURE__*/React.createElement("div", {
            key: rule.id || ruleIndex,
            className: "advgb-rule-container"
          }, ruleIndex > 0 && /*#__PURE__*/React.createElement("div", {
            className: "advgb-rule-separator"
          }, /*#__PURE__*/React.createElement("span", {
            className: "advgb-separator-text"
          }, __('AND', 'advanced-gutenberg'))), _this10.renderControlRule(rule, setIndex, ruleIndex));
        }), (!controlSet.rules || controlSet.rules.length === 0) && /*#__PURE__*/React.createElement("div", {
          className: "advgb-no-rules"
        }, /*#__PURE__*/React.createElement("p", null, __('No rules added yet. Add rules to define when this block should be visible.', 'advanced-gutenberg')))));
      }
    }, {
      key: "renderControlRule",
      value: function renderControlRule(rule, setIndex, ruleIndex) {
        var _this11 = this;
        var isExpanded = this.isRuleExpanded(setIndex, ruleIndex);
        return /*#__PURE__*/React.createElement("div", {
          className: "advgb-control-rule"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-rule-header"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-rule-type advgb-preset-clickable-area",
          onClick: function onClick() {
            return _this11.toggleRule(setIndex, ruleIndex);
          }
        }, /*#__PURE__*/React.createElement("span", {
          className: "dashicons dashicons-arrow-".concat(isExpanded ? 'down' : 'right')
        }), /*#__PURE__*/React.createElement("span", {
          className: "advgb-rule-type-icon"
        }, "\uD83D\uDCCB"), /*#__PURE__*/React.createElement("span", {
          className: "advgb-rule-type-label"
        }, this.getRuleTypeLabel(rule.type))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-rule-actions"
        }, /*#__PURE__*/React.createElement("div", {
          className: "ppb-tooltips-library click",
          "data-toggle": "ppbtooltip",
          "data-placement": "left"
        }, /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          isDestructive: true,
          icon: "trash",
          label: __('Remove Rule', 'advanced-gutenberg')
        }), /*#__PURE__*/React.createElement("div", {
          className: "tooltip-text"
        }, /*#__PURE__*/React.createElement("p", null, __('Are you sure you want to remove rule?', 'advanced-gutenberg'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          isDestructive: true,
          label: __('Remove Rule', 'advanced-gutenberg'),
          onClick: function onClick() {
            return _this11.removeRuleFromSet(setIndex, ruleIndex);
          }
        }, /*#__PURE__*/React.createElement("strong", null, __('Yes, Remove Rule.', 'advanced-gutenberg'))), "|", /*#__PURE__*/React.createElement(Button, {
          isLink: true,
          isSmall: true,
          label: __('No, Cancel', 'advanced-gutenberg')
        }, __('No, Cancel.', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("i", null))))), isExpanded && /*#__PURE__*/React.createElement("div", {
          className: "advgb-rule-content"
        }, this.renderRuleConfiguration(rule, setIndex, ruleIndex)));
      }
    }, {
      key: "renderRuleConfiguration",
      value: function renderRuleConfiguration(rule, setIndex, ruleIndex) {
        switch (rule.type) {
          case 'schedule':
            return this.renderScheduleConfig(rule, setIndex, ruleIndex);
          case 'user_role':
            return this.renderUserRoleConfig(rule, setIndex, ruleIndex);
          case 'device_type':
            return this.renderDeviceTypeConfig(rule, setIndex, ruleIndex);
          case 'device_width':
            return this.renderDeviceWidthConfig(rule, setIndex, ruleIndex);
          case 'browser_device':
            return this.renderBrowserDeviceConfig(rule, setIndex, ruleIndex);
          case 'operating_system':
            return this.renderOperatingSystemConfig(rule, setIndex, ruleIndex);
          case 'cookie':
            return this.renderCookieConfig(rule, setIndex, ruleIndex);
          case 'user_meta':
            return this.renderUserMetaConfig(rule, setIndex, ruleIndex);
          case 'post_meta':
            return this.renderPostMetaConfig(rule, setIndex, ruleIndex);
          case 'query_string':
            return this.renderQueryStringConfig(rule, setIndex, ruleIndex);
          case 'capabilities':
            return this.renderCapabilitiesConfig(rule, setIndex, ruleIndex);
          case 'archive':
            return this.renderArchiveConfig(rule, setIndex, ruleIndex);
          case 'page':
            return this.renderPageConfig(rule, setIndex, ruleIndex);
          default:
            return /*#__PURE__*/React.createElement("p", null, __('Configuration for this rule type is missing.', 'advanced-gutenberg'));
        }
      }
    }, {
      key: "updateRuleData",
      value: function updateRuleData(setIndex, ruleIndex, key, value) {
        var currentPreset = this.state.currentPreset;
        var newControlSets = _toConsumableArray(currentPreset.controlSets);
        newControlSets[setIndex].rules[ruleIndex][key] = value;
        this.setState({
          currentPreset: _objectSpread(_objectSpread({}, currentPreset), {}, {
            controlSets: newControlSets
          })
        });
      }
    }, {
      key: "removeRuleFromSet",
      value: function removeRuleFromSet(setIndex, ruleIndex) {
        var currentPreset = this.state.currentPreset;
        var newControlSets = _toConsumableArray(currentPreset.controlSets);
        newControlSets[setIndex].rules.splice(ruleIndex, 1);
        this.setState({
          currentPreset: _objectSpread(_objectSpread({}, currentPreset), {}, {
            controlSets: newControlSets
          })
        });
      }
    }, {
      key: "handleModalClose",
      value: function handleModalClose() {
        var _this12 = this;
        this.setState({
          showModal: false,
          currentPreset: null,
          editingPreset: null,
          modalMode: 'create',
          lastAction: 'cancelled'
        }, function () {
          _this12.scrollToMessage();
        });
      }
    }, {
      key: "getBrowserOptions",
      value: function getBrowserOptions() {
        return [{
          slug: 'chrome',
          title: 'Chrome'
        }, {
          slug: 'firefox',
          title: 'Firefox'
        }, {
          slug: 'safari',
          title: 'Safari'
        }, {
          slug: 'edge',
          title: 'Edge'
        }, {
          slug: 'opera',
          title: 'Opera'
        }, {
          slug: 'internet explorer',
          title: 'Internet Explorer'
        }];
      }
    }, {
      key: "getOperatingSystemOptions",
      value: function getOperatingSystemOptions() {
        return [{
          slug: 'windows',
          title: 'Windows'
        }, {
          slug: 'mac',
          title: 'macOS'
        }, {
          slug: 'linux',
          title: 'Linux'
        }, {
          slug: 'android',
          title: 'Android'
        }, {
          slug: 'ios',
          title: 'iOS'
        }, {
          slug: 'chrome os',
          title: 'Chrome OS'
        }];
      }
    }, {
      key: "getConditionOptions",
      value: function getConditionOptions() {
        return [{
          label: '=',
          value: '='
        }, {
          label: '!=',
          value: '!='
        }, {
          label: '<',
          value: '<'
        }, {
          label: '>',
          value: '>'
        }, {
          label: '<=',
          value: '<='
        }, {
          label: '>=',
          value: '>='
        }, {
          label: 'contains',
          value: 'contains'
        }, {
          label: 'begins with',
          value: 'beginsWith'
        }, {
          label: 'ends with',
          value: 'endsWith'
        }, {
          label: 'does not contain',
          value: 'doesNotContain'
        }, {
          label: 'does not begin with',
          value: 'doesNotBeginWith'
        }, {
          label: 'does not end with',
          value: 'doesNotEndWith'
        }, {
          label: 'is null',
          value: 'null'
        }, {
          label: 'is not null',
          value: 'notNull'
        }];
      }
    }, {
      key: "getUserRoles",
      value: function getUserRoles() {
        return typeof advgb_block_controls_vars.user_roles !== 'undefined' ? advgb_block_controls_vars.user_roles : [];
      }
    }, {
      key: "getCapabilitiesOptions",
      value: function getCapabilitiesOptions() {
        var capabilities = typeof advgb_block_controls_vars.capabilities !== 'undefined' ? advgb_block_controls_vars.capabilities : [];
        return capabilities.map(function (cap) {
          return {
            slug: cap,
            title: cap.split('_').map(function (word) {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ')
          };
        });
      }
    }, {
      key: "getArchiveOptions",
      value: function getArchiveOptions() {
        return [{
          slug: 'category',
          title: __('Category Archives', 'advanced-gutenberg')
        }, {
          slug: 'tag',
          title: __('Tag Archives', 'advanced-gutenberg')
        }, {
          slug: 'date',
          title: __('Date Archives', 'advanced-gutenberg')
        }, {
          slug: 'author',
          title: __('Author Archives', 'advanced-gutenberg')
        }];
      }
    }, {
      key: "getPageOptions",
      value: function getPageOptions() {
        return typeof advgb_block_controls_vars.page !== 'undefined' ? advgb_block_controls_vars.page : [];
      }
    }, {
      key: "getTimezoneLabel",
      value: function getTimezoneLabel() {
        return __('WordPress settings timezone', 'advanced-gutenberg');
      }
    }, {
      key: "getTimezoneSlug",
      value: function getTimezoneSlug() {
        return typeof advgbBlocks.timezone !== 'undefined' && advgbBlocks.timezone.length ? advgbBlocks.timezone : 'UTC';
      }
    }, {
      key: "renderScheduleConfig",
      value: function renderScheduleConfig(rule, setIndex, ruleIndex) {
        var _this13 = this;
        var schedules = rule.schedules && rule.schedules.length > 0 ? rule.schedules : [{
          dateFrom: null,
          dateTo: null,
          recurring: false,
          days: [],
          timeFrom: null,
          timeTo: null,
          timezone: this.getTimezoneSlug()
        }];
        return /*#__PURE__*/React.createElement(Fragment, null, schedules.map(function (schedule, scheduleIndex) {
          return /*#__PURE__*/React.createElement(ScheduleControl, {
            key: scheduleIndex,
            index: scheduleIndex,
            schedule: schedule,
            onChange: function onChange(key, value) {
              var updatedSchedules = _toConsumableArray(schedules);
              updatedSchedules[scheduleIndex][key] = value;
              _this13.updateRuleData(setIndex, ruleIndex, 'schedules', updatedSchedules);
            },
            onRemove: function onRemove() {
              if (schedules.length > 1) {
                var updatedSchedules = schedules.filter(function (_, idx) {
                  return idx !== scheduleIndex;
                });
                _this13.updateRuleData(setIndex, ruleIndex, 'schedules', updatedSchedules);
              }
            },
            getTimezoneLabel: function getTimezoneLabel() {
              return _this13.getTimezoneLabel();
            },
            getTimezoneSlug: function getTimezoneSlug() {
              return _this13.getTimezoneSlug();
            },
            canRemove: schedules.length > 1
          });
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            marginBottom: 16
          }
        }, /*#__PURE__*/React.createElement(Button, {
          style: {
            width: '100%',
            display: 'block'
          },
          className: "button button-secondary",
          onClick: function onClick() {
            var newSchedule = {
              dateFrom: null,
              dateTo: null,
              recurring: false,
              days: [],
              timeFrom: null,
              timeTo: null,
              timezone: _this13.getTimezoneSlug()
            };
            _this13.updateRuleData(setIndex, ruleIndex, 'schedules', [].concat(_toConsumableArray(schedules), [newSchedule]));
          }
        }, __('Add Another Schedule', 'advanced-gutenberg'))));
      }
    }, {
      key: "renderUserRoleConfig",
      value: function renderUserRoleConfig(rule, setIndex, ruleIndex) {
        var _this14 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'public',
          options: [{
            value: 'public',
            label: __('Show to everyone', 'advanced-gutenberg')
          }, {
            value: 'hidden',
            label: __('Hide from everyone', 'advanced-gutenberg')
          }, {
            value: 'login',
            label: __('Show to logged in users', 'advanced-gutenberg')
          }, {
            value: 'logout',
            label: __('Show to logged out users', 'advanced-gutenberg')
          }, {
            value: 'include',
            label: __('Show to selected user roles', 'advanced-gutenberg')
          }, {
            value: 'exclude',
            label: __('Hide from selected user roles', 'advanced-gutenberg')
          }],
          onChange: function onChange(value) {
            return _this14.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }), (rule.approach === 'include' || rule.approach === 'exclude') && /*#__PURE__*/React.createElement(FormTokenField, {
          multiple: true,
          label: __('Select user roles', 'advanced-gutenberg'),
          placeholder: __('Search roles', 'advanced-gutenberg'),
          suggestions: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSuggestions)(this.getUserRoles()),
          maxSuggestions: 10,
          value: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionTitles)(rule.roles || [], this.getUserRoles()),
          onChange: function onChange(value) {
            _this14.updateRuleData(setIndex, ruleIndex, 'roles', (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSlugs)(value, _this14.getUserRoles()));
          },
          __experimentalExpandOnFocus: true
        }));
      }
    }, {
      key: "renderDeviceTypeConfig",
      value: function renderDeviceTypeConfig(rule, setIndex, ruleIndex) {
        var _this15 = this;
        var devices = rule.devices || [];
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
          style: {
            paddingLeft: '17%'
          }
        }, ['desktop', 'tablet', 'mobile', 'robot'].map(function (deviceType) {
          return /*#__PURE__*/React.createElement(ToggleControl, {
            key: deviceType,
            label: __(deviceType.charAt(0).toUpperCase() + deviceType.slice(1), 'advanced-gutenberg'),
            checked: devices.includes(deviceType),
            onChange: function onChange() {
              var newDevices = devices.includes(deviceType) ? devices.filter(function (d) {
                return d !== deviceType;
              }) : [].concat(_toConsumableArray(devices), [deviceType]);
              _this15.updateRuleData(setIndex, ruleIndex, 'devices', newDevices);
            }
          });
        })));
      }
    }, {
      key: "renderDeviceWidthConfig",
      value: function renderDeviceWidthConfig(rule, setIndex, ruleIndex) {
        var _this16 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextControl, {
          type: "number",
          label: __('Minimum width (px)', 'advanced-gutenberg'),
          value: rule.min_width || '',
          onChange: function onChange(value) {
            return _this16.updateRuleData(setIndex, ruleIndex, 'min_width', value);
          },
          placeholder: __('No minimum', 'advanced-gutenberg')
        }), /*#__PURE__*/React.createElement(TextControl, {
          type: "number",
          label: __('Maximum width (px)', 'advanced-gutenberg'),
          value: rule.max_width || '',
          onChange: function onChange(value) {
            return _this16.updateRuleData(setIndex, ruleIndex, 'max_width', value);
          },
          placeholder: __('No maximum', 'advanced-gutenberg')
        }));
      }
    }, {
      key: "renderBrowserDeviceConfig",
      value: function renderBrowserDeviceConfig(rule, setIndex, ruleIndex) {
        var _this17 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(FormTokenField, {
          multiple: true,
          label: __('Select Browsers', 'advanced-gutenberg'),
          placeholder: __('Search browsers', 'advanced-gutenberg'),
          suggestions: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSuggestions)(this.getBrowserOptions()),
          maxSuggestions: 10,
          value: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionTitles)(rule.browsers || [], this.getBrowserOptions()),
          onChange: function onChange(value) {
            _this17.updateRuleData(setIndex, ruleIndex, 'browsers', (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSlugs)(value, _this17.getBrowserOptions()));
          },
          __experimentalExpandOnFocus: true
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show to selected browsers', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide from selected browsers', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this17.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderOperatingSystemConfig",
      value: function renderOperatingSystemConfig(rule, setIndex, ruleIndex) {
        var _this18 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(FormTokenField, {
          multiple: true,
          label: __('Select Operating Systems', 'advanced-gutenberg'),
          placeholder: __('Search operating systems', 'advanced-gutenberg'),
          suggestions: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSuggestions)(this.getOperatingSystemOptions()),
          maxSuggestions: 10,
          value: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionTitles)(rule.systems || [], this.getOperatingSystemOptions()),
          onChange: function onChange(value) {
            _this18.updateRuleData(setIndex, ruleIndex, 'systems', (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSlugs)(value, _this18.getOperatingSystemOptions()));
          },
          __experimentalExpandOnFocus: true
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show to selected OS', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide from selected OS', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this18.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderCookieConfig",
      value: function renderCookieConfig(rule, setIndex, ruleIndex) {
        var _this19 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextControl, {
          label: __('Cookie Name', 'advanced-gutenberg'),
          value: rule.name || '',
          onChange: function onChange(value) {
            return _this19.updateRuleData(setIndex, ruleIndex, 'name', value);
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Condition', 'advanced-gutenberg'),
          value: rule.condition || '=',
          options: this.getConditionOptions(),
          onChange: function onChange(value) {
            return _this19.updateRuleData(setIndex, ruleIndex, 'condition', value);
          }
        }), /*#__PURE__*/React.createElement(TextControl, {
          label: __('Value', 'advanced-gutenberg'),
          value: rule.value || '',
          onChange: function onChange(value) {
            return _this19.updateRuleData(setIndex, ruleIndex, 'value', value);
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show when condition matches', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide when condition matches', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this19.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderUserMetaConfig",
      value: function renderUserMetaConfig(rule, setIndex, ruleIndex) {
        var _this20 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextControl, {
          label: __('Meta Key', 'advanced-gutenberg'),
          value: rule.key || '',
          onChange: function onChange(value) {
            return _this20.updateRuleData(setIndex, ruleIndex, 'key', value);
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Condition', 'advanced-gutenberg'),
          value: rule.condition || '=',
          options: this.getConditionOptions(),
          onChange: function onChange(value) {
            return _this20.updateRuleData(setIndex, ruleIndex, 'condition', value);
          }
        }), /*#__PURE__*/React.createElement(TextControl, {
          label: __('Value', 'advanced-gutenberg'),
          value: rule.value || '',
          onChange: function onChange(value) {
            return _this20.updateRuleData(setIndex, ruleIndex, 'value', value);
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show when condition matches', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide when condition matches', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this20.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }

      // Post Meta Configuration
    }, {
      key: "renderPostMetaConfig",
      value: function renderPostMetaConfig(rule, setIndex, ruleIndex) {
        var _this21 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextControl, {
          label: __('Meta Key', 'advanced-gutenberg'),
          value: rule.key || '',
          onChange: function onChange(value) {
            return _this21.updateRuleData(setIndex, ruleIndex, 'key', value);
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Condition', 'advanced-gutenberg'),
          value: rule.condition || '=',
          options: this.getConditionOptions(),
          onChange: function onChange(value) {
            return _this21.updateRuleData(setIndex, ruleIndex, 'condition', value);
          }
        }), /*#__PURE__*/React.createElement(TextControl, {
          label: __('Value', 'advanced-gutenberg'),
          value: rule.value || '',
          onChange: function onChange(value) {
            return _this21.updateRuleData(setIndex, ruleIndex, 'value', value);
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show when condition matches', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide when condition matches', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this21.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderQueryStringConfig",
      value: function renderQueryStringConfig(rule, setIndex, ruleIndex) {
        var _this22 = this;
        var queriesValue = Array.isArray(rule.queries) ? rule.queries.join('\n') : rule.queries || '';
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(TextareaControl, {
          label: __('Query Parameters', 'advanced-gutenberg'),
          help: __('Enter query parameter names, one per line', 'advanced-gutenberg'),
          value: queriesValue,
          onChange: function onChange(value) {
            _this22.updateRuleData(setIndex, ruleIndex, 'queries', value);
          },
          placeholder: __('utm_source\nutm_medium\nref', 'advanced-gutenberg')
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Logic', 'advanced-gutenberg'),
          value: rule.logic || 'all',
          options: [{
            label: __('All parameters must be present', 'advanced-gutenberg'),
            value: 'all'
          }, {
            label: __('Any parameter must be present', 'advanced-gutenberg'),
            value: 'any'
          }],
          onChange: function onChange(value) {
            return _this22.updateRuleData(setIndex, ruleIndex, 'logic', value);
          }
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show when condition matches', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide when condition matches', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this22.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderCapabilitiesConfig",
      value: function renderCapabilitiesConfig(rule, setIndex, ruleIndex) {
        var _this23 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(FormTokenField, {
          multiple: true,
          label: __('Select Capabilities', 'advanced-gutenberg'),
          placeholder: __('Search capabilities', 'advanced-gutenberg'),
          suggestions: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSuggestions)(this.getCapabilitiesOptions()),
          maxSuggestions: 10,
          value: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionTitles)(rule.capabilities || [], this.getCapabilitiesOptions()),
          onChange: function onChange(value) {
            _this23.updateRuleData(setIndex, ruleIndex, 'capabilities', (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSlugs)(value, _this23.getCapabilitiesOptions()));
          },
          __experimentalExpandOnFocus: true
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show to users with selected capabilities', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide from users with selected capabilities', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this23.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderArchiveConfig",
      value: function renderArchiveConfig(rule, setIndex, ruleIndex) {
        var _this24 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(FormTokenField, {
          multiple: true,
          label: __('Select Archive Types', 'advanced-gutenberg'),
          placeholder: __('Search archive types', 'advanced-gutenberg'),
          suggestions: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSuggestions)(this.getArchiveOptions()),
          maxSuggestions: 10,
          value: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionTitles)(rule.archives || [], this.getArchiveOptions()),
          onChange: function onChange(value) {
            _this24.updateRuleData(setIndex, ruleIndex, 'archives', (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSlugs)(value, _this24.getArchiveOptions()));
          },
          __experimentalExpandOnFocus: true
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show on selected archives', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide from selected archives', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this24.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderPageConfig",
      value: function renderPageConfig(rule, setIndex, ruleIndex) {
        var _this25 = this;
        return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement(FormTokenField, {
          multiple: true,
          label: __('Select Pages', 'advanced-gutenberg'),
          placeholder: __('Search pages', 'advanced-gutenberg'),
          suggestions: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSuggestions)(this.getPageOptions()),
          maxSuggestions: 10,
          value: (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionTitles)(rule.pages || [], this.getPageOptions()),
          onChange: function onChange(value) {
            _this25.updateRuleData(setIndex, ruleIndex, 'pages', (0,_blocks_0_adv_components_utils_jsx__WEBPACK_IMPORTED_MODULE_1__.getOptionSlugs)(value, _this25.getPageOptions()));
          },
          __experimentalExpandOnFocus: true
        }), /*#__PURE__*/React.createElement(SelectControl, {
          label: __('Approach', 'advanced-gutenberg'),
          value: rule.approach || 'include',
          options: [{
            label: __('Show on selected pages', 'advanced-gutenberg'),
            value: 'include'
          }, {
            label: __('Hide from selected pages', 'advanced-gutenberg'),
            value: 'exclude'
          }],
          onChange: function onChange(value) {
            return _this25.updateRuleData(setIndex, ruleIndex, 'approach', value);
          }
        }));
      }
    }, {
      key: "renderContextualMessage",
      value: function renderContextualMessage(lastAction) {
        var _this26 = this;
        var presets = this.state.presets;
        var title,
          description,
          icon,
          showFeatures = false,
          showStats = false;
        var hasPresets = presets && presets.length > 0;
        switch (lastAction) {
          case 'cancelled':
            title = __('Edit Cancelled', 'advanced-gutenberg');
            description = __('Edit cancelled. Select another preset to edit or create a new one.', 'advanced-gutenberg');
            icon = 'dismiss';
            break;
          case 'saved':
            title = __('Preset Saved!', 'advanced-gutenberg');
            description = __('Preset saved successfully! Choose another preset to edit or create a new one.', 'advanced-gutenberg');
            icon = 'yes-alt';
            break;
          case 'deleted':
            title = __('Preset Deleted', 'advanced-gutenberg');
            description = __('Preset deleted. Select another preset to edit or create a new one.', 'advanced-gutenberg');
            icon = 'trash';
            break;
          case 'error':
            title = __('Action Completed', 'advanced-gutenberg');
            description = __('Operation completed. You can continue editing presets or create new ones.', 'advanced-gutenberg');
            icon = 'info';
            break;
          case 'loaded':
            title = __('Select a Preset to Edit', 'advanced-gutenberg');
            description = __('Choose a preset from the list to edit its rules, or create a new preset to get started.', 'advanced-gutenberg');
            icon = 'admin-settings';
            break;
          case 'empty':
            title = __('No Presets Yet', 'advanced-gutenberg');
            description = __('Create your first preset to start managing block visibility rules.', 'advanced-gutenberg');
            icon = 'welcome-add-page';
            showFeatures = true;
            break;
          case 'installed':
            title = __('Samples Created!', 'advanced-gutenberg');
            description = __('Preset samples created successfully! Choose a preset to edit or create a new one.', 'advanced-gutenberg');
            icon = 'portfolio';
            showStats = true;
            break;
          default:
            title = __('Manage Your Presets', 'advanced-gutenberg');
            description = __('Select a preset to edit or create a new one to control block visibility.', 'advanced-gutenberg');
            icon = 'admin-generic';
            showStats = true;
        }
        return /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.createElement("div", {
          className: "advgb-guidance-icon"
        }, /*#__PURE__*/React.createElement("span", {
          className: "dashicons dashicons-".concat(icon)
        })), /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("p", null, description), showStats && this.renderPresetStats(), showFeatures && this.renderFeatureGrid(), /*#__PURE__*/React.createElement("div", {
          className: "advgb-guidance-actions"
        }, /*#__PURE__*/React.createElement("button", {
          className: "button button-primary",
          onClick: function onClick() {
            return _this26.createNewPreset();
          }
        }, __('Create New Preset', 'advanced-gutenberg')), !hasPresets && /*#__PURE__*/React.createElement("button", {
          className: "button button-secondary",
          onClick: function onClick() {
            return _this26.createSamplePresets();
          }
        }, __('Generate Samples', 'advanced-gutenberg'))));
      }
    }, {
      key: "renderPresetStats",
      value: function renderPresetStats() {
        var presets = this.state.presets;
        var totalPresets = (presets === null || presets === void 0 ? void 0 : presets.length) || 0;
        var totalRules = (presets === null || presets === void 0 ? void 0 : presets.reduce(function (count, preset) {
          var _preset$controlSets;
          return count + (((_preset$controlSets = preset.controlSets) === null || _preset$controlSets === void 0 ? void 0 : _preset$controlSets.reduce(function (setCount, set) {
            var _set$rules;
            return setCount + (((_set$rules = set.rules) === null || _set$rules === void 0 ? void 0 : _set$rules.length) || 0);
          }, 0)) || 0);
        }, 0)) || 0;
        return /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-stats-overview"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-stat-card"
        }, /*#__PURE__*/React.createElement("span", {
          className: "advgb-preset-stat-number"
        }, totalPresets), /*#__PURE__*/React.createElement("span", {
          className: "advgb-preset-stat-label"
        }, __('Total Presets', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-stat-card"
        }, /*#__PURE__*/React.createElement("span", {
          className: "advgb-preset-stat-number"
        }, totalRules), /*#__PURE__*/React.createElement("span", {
          className: "advgb-preset-stat-label"
        }, __('Rules Created', 'advanced-gutenberg'))));
      }
    }, {
      key: "renderFeatureGrid",
      value: function renderFeatureGrid() {
        return /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-features-grid"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-feature-card"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-feature-icon"
        }, /*#__PURE__*/React.createElement("span", {
          className: "dashicons dashicons-visibility"
        })), /*#__PURE__*/React.createElement("h4", null, __('Conditional Visibility', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("p", null, __('Control when blocks appear based on user roles, devices, schedules, and more', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-feature-card"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-feature-icon"
        }, /*#__PURE__*/React.createElement("span", {
          className: "dashicons dashicons-admin-users"
        })), /*#__PURE__*/React.createElement("h4", null, __('User Targeting', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("p", null, __('Show or hide content to specific user roles, logged-in status, or capabilities', 'advanced-gutenberg'))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-feature-card"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-feature-icon"
        }, /*#__PURE__*/React.createElement("span", {
          className: "dashicons dashicons-clock"
        })), /*#__PURE__*/React.createElement("h4", null, __('Scheduling', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("p", null, __('Set time-based rules to display content only during specific periods', 'advanced-gutenberg'))));
      }
    }, {
      key: "render",
      value: function render() {
        var _this27 = this;
        var _this$state3 = this.state,
          showModal = _this$state3.showModal,
          loading = _this$state3.loading,
          error = _this$state3.error,
          currentPreset = _this$state3.currentPreset,
          editingPreset = _this$state3.editingPreset,
          deleting = _this$state3.deleting,
          presets = _this$state3.presets,
          lastAction = _this$state3.lastAction;
        var _this$props$isModal = this.props.isModal,
          isModal = _this$props$isModal === void 0 ? false : _this$props$isModal;
        var hasActiveForm = currentPreset && !currentPreset.default || editingPreset;
        var hasPresets = presets && presets.length > 0;
        if (loading) {
          return /*#__PURE__*/React.createElement("div", {
            className: "advgb-preset-loading-container"
          }, /*#__PURE__*/React.createElement("div", {
            className: "advgb-preset-loading-spinner"
          }, /*#__PURE__*/React.createElement("div", {
            className: "advgb-spinner"
          }, /*#__PURE__*/React.createElement("div", {
            className: "advgb-spinner-circle"
          })), /*#__PURE__*/React.createElement("p", null, __('Loading presets...', 'advanced-gutenberg'))));
        }
        if (error) {
          return /*#__PURE__*/React.createElement(Notice, {
            status: "error"
          }, error);
        }
        var content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-sidebar-header",
          ref: this.messageContainerRef
        }, !hasActiveForm && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
          className: "button button-secondary",
          onClick: function onClick() {
            return _this27.createNewPreset();
          }
        }, __('Add New Preset', 'advanced-gutenberg')), !hasPresets && /*#__PURE__*/React.createElement("button", {
          className: "button button-primary",
          onClick: function onClick() {
            return _this27.createSamplePresets();
          }
        }, __('Generate Sample Preset', 'advanced-gutenberg')))), /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-manager ".concat(deleting ? 'deleting' : '')
        }, deleting && /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-deleting-overlay"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-deleting-message"
        }, /*#__PURE__*/React.createElement(Spinner, null))), (hasPresets || hasActiveForm) && /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-sidebar"
        }, this.renderPresetList()), /*#__PURE__*/React.createElement("div", {
          className: "advgb-preset-editor"
        }, (hasPresets || lastAction == 'creating') && hasActiveForm && this.renderPresetForm(), !hasPresets && lastAction !== 'creating' && /*#__PURE__*/React.createElement("div", {
          className: "advgb-welcome-message"
        }, /*#__PURE__*/React.createElement("div", {
          className: "advgb-welcome-icon"
        }, /*#__PURE__*/React.createElement("svg", {
          width: "48px",
          height: "48px",
          viewBox: "0 0 155.00 155.00",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          stroke: "#2271b1"
        }, /*#__PURE__*/React.createElement("g", {
          id: "SVGRepo_bgCarrier",
          "stroke-width": "0"
        }), /*#__PURE__*/React.createElement("g", {
          id: "SVGRepo_tracerCarrier",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        }), /*#__PURE__*/React.createElement("g", {
          id: "SVGRepo_iconCarrier"
        }, " ", /*#__PURE__*/React.createElement("path", {
          d: "M106.407 96.8913C111.542 102.976 114.23 109.624 114.119 117.272C113.966 127.809 108.553 135.741 100.947 142.254C92.0832 149.843 81.3711 153.044 69.9069 153.943C67.396 154.087 64.8793 154.095 62.3675 153.968C61.2825 153.947 60.2075 153.756 59.1817 153.401C55.071 151.912 54.4462 148.867 57.7062 146.002C60.9065 143.191 64.3602 140.658 67.443 137.729C69.8054 135.468 71.9448 132.984 73.8318 130.313C75.8297 127.501 76.0056 124.257 74.7671 120.518C72.7928 121.437 70.9019 122.169 69.1639 123.165C65.5199 125.253 63.4643 125.166 60.3381 122.422C57.3006 119.755 54.3156 117.028 51.2938 114.343C50.8442 113.992 50.3743 113.668 49.8866 113.373C48.0535 115.067 46.3496 116.757 44.523 118.301C42.1025 120.348 39.7016 120.401 38.131 118.589C36.6588 116.893 36.901 114.651 39.0282 112.471C40.5377 110.923 42.2626 109.584 43.5372 108.461C40.1098 104.278 36.6555 100.848 34.1719 96.8237C31.2696 92.1178 34.8565 87.9231 37.0979 83.3189C32.8192 83.0504 29.3006 83.8341 26.4724 86.0033C23.7734 88.1917 21.3394 90.6881 19.2199 93.4416C17.1669 95.975 15.57 98.8767 13.7474 101.599C12.0291 104.166 10.2688 106.864 6.65102 106.491C4.14644 106.233 0.654067 101.721 0.422379 98.33C-0.102691 90.599 0.881819 83.0753 4.49168 76.0867C11.1049 63.2881 21.523 54.9657 35.0947 50.5131C40.7812 48.6478 46.5098 49.2418 52.3098 51.0087C52.6314 50.6385 53.0088 50.2697 53.3107 49.8476C68.9736 27.9581 90.3183 14.0634 115.597 5.81196C124.206 3.00217 132.916 0.444402 142.093 0.21009C144.385 0.151676 146.679 -0.0235928 148.97 0.00266074C151.958 0.036134 153.448 1.09614 153.327 4.01488C153.172 9.66322 152.644 15.2951 151.744 20.8736C148.056 41.8521 137.967 59.8443 124.863 76.254C119.763 82.6415 114.02 88.5177 108.563 94.621C107.918 95.3403 107.232 96.0243 106.407 96.8913ZM55.4163 106.628C58.8292 109.34 61.3148 111.468 63.9867 113.323C64.4408 113.537 64.9369 113.646 65.4389 113.644C65.9408 113.641 66.4358 113.527 66.8877 113.308C71.1231 111.063 75.4543 108.915 79.3969 106.215C93.4392 96.5986 106.143 85.4257 116.822 72.1336C122.616 64.9224 127.917 57.3167 133.55 49.7426L100.91 19.4316C99.8323 19.9355 98.7827 20.4966 97.7652 21.1125C91.3987 25.3374 84.9081 29.3961 78.7602 33.9196C71.8687 38.9892 66.0371 45.1843 60.8311 52.0129C52.1969 63.3367 47.1136 76.5599 40.7248 89.0828C40.0895 90.3299 40.4459 92.8417 41.3464 93.9568C43.6901 96.8598 46.5925 99.3126 49.7416 102.406C54.6641 97.3035 58.9959 92.5352 63.6454 88.0938C66.324 85.689 69.196 83.5087 72.2323 81.575C73.8285 80.4907 75.8664 80.1212 77.3268 81.7864C78.8068 83.4745 77.5322 85.1277 76.4919 86.4844C75.2622 88.0169 73.9298 89.4642 72.504 90.8162C69.5505 93.7356 66.5904 96.6465 63.5476 99.4701C60.9951 101.843 58.3212 104.081 55.4163 106.628ZM147.141 6.3889C133.175 6.41712 120.848 11.6094 108.28 15.8349L108.056 16.7045L136.962 41.0731C141.915 33.2233 145.713 20.2816 147.141 6.3889ZM77.9707 141.64C89.7309 139.425 98.8422 133.46 103.962 122.528C107.375 115.232 104.991 108.423 100.968 101.949C94.1966 107.118 87.7199 112.064 81.2445 117.008C86.3449 126.009 83.7327 133.936 77.9707 141.64ZM48.698 56.4944C31.8839 53.7377 8.64104 76.4733 10.1486 92.0817C17.0146 81.239 25.8253 74.7064 39.084 77.0567L48.698 56.4944Z",
          fill: "#2271b1"
        }), " ", /*#__PURE__*/React.createElement("path", {
          d: "M14.6051 140.579C15.1033 139.678 15.6382 138.038 16.7054 136.898C20.7301 132.601 24.9024 128.441 29.0774 124.288C30.3034 123.068 31.8543 122.299 33.4499 123.601C35.1327 124.974 34.3963 126.615 33.402 127.973C29.989 132.633 26.5682 137.293 22.9616 141.802C21.8888 143.034 20.5253 143.979 18.9947 144.55C16.7225 145.446 14.5257 143.644 14.6051 140.579Z",
          fill: "#2271b1"
        }), " ", /*#__PURE__*/React.createElement("path", {
          d: "M51.9876 123.87C54.4075 123.936 56.1665 126.118 55.0901 127.808C52.3487 132.062 49.3371 136.136 46.074 140.004C44.905 141.404 42.8061 141.206 41.3214 139.866C40.6426 139.292 40.1985 138.488 40.0735 137.607C39.9485 136.727 40.1513 135.831 40.6434 135.09C41.5342 133.607 42.5933 132.232 43.7998 130.991C45.587 129.088 47.4753 127.273 49.4167 125.529C50.22 124.897 51.0807 124.342 51.9876 123.87Z",
          fill: "#2271b1"
        }), " ", /*#__PURE__*/React.createElement("path", {
          d: "M30.3682 105.409C29.9062 106.43 29.3605 107.411 28.7366 108.341C25.689 112.145 22.5946 115.911 19.4534 119.638C18.8631 120.274 18.1765 120.813 17.4187 121.234C15.8501 122.199 14.2552 122.197 12.9904 120.769C11.6836 119.294 11.9737 117.656 13.2838 116.387C17.5723 112.23 21.91 108.121 26.3337 104.109C26.912 103.584 28.1433 103.499 28.9893 103.655C29.4973 103.749 29.8465 104.705 30.3682 105.409Z",
          fill: "#2271b1"
        }), " ", /*#__PURE__*/React.createElement("path", {
          d: "M99.4671 35.7334C103.729 35.6749 107.015 37.4181 110.313 40.1649C113.732 43.0121 116.286 46.049 117.548 50.2935C120.461 60.111 114.697 67.338 105.35 68.6599C97.775 69.731 91.3495 66.6114 86.6757 60.6814C82.672 55.6 82.5638 49.6871 85.3407 44.0052C88.1407 38.2721 93.1846 35.7944 99.4671 35.7334ZM90.4707 51.4625C91.5654 53.3514 92.3511 55.7595 93.9821 57.2317C95.6715 58.7564 98.1281 59.5118 100.344 60.3545C103.255 61.4624 105.775 60.2889 107.753 58.2294C109.668 56.2374 109.739 53.7354 108.803 51.1869C107.329 47.1688 103.891 45.1524 100.438 43.3337C97.3373 41.7008 94.3949 42.6774 92.6274 45.7353C91.7262 47.2915 91.3232 49.1358 90.4707 51.4625Z",
          fill: "#2271b1"
        }), " "))), /*#__PURE__*/React.createElement("h3", null, __('Welcome to Block Control Presets', 'advanced-gutenberg')), /*#__PURE__*/React.createElement("p", null, __('This screen allows you to create powerful visibility rules for your blocks.', 'advanced-gutenberg'), /*#__PURE__*/React.createElement("br", null), " ", __('These preset rules are available when you\'re writing posts.', 'advanced-gutenberg')), this.renderFeatureGrid(), /*#__PURE__*/React.createElement("div", {
          className: "advgb-guidance-actions"
        }, /*#__PURE__*/React.createElement("button", {
          className: "button button-primary",
          onClick: function onClick() {
            return _this27.createNewPreset();
          }
        }, __('Create Your First Preset', 'advanced-gutenberg')), !hasPresets && /*#__PURE__*/React.createElement("button", {
          className: "button button-secondary",
          onClick: function onClick() {
            return _this27.createSamplePresets();
          }
        }, __('Generate Sample Presets', 'advanced-gutenberg')))), hasPresets && !hasActiveForm && /*#__PURE__*/React.createElement("div", {
          className: "advgb-guidance-message",
          "data-action": lastAction
        }, this.renderContextualMessage(lastAction)))));
        if (isModal) {
          return /*#__PURE__*/React.createElement(Modal, {
            title: __('Block Control Presets', 'advanced-gutenberg'),
            onRequestClose: this.handleModalClose,
            isDismissible: true,
            shouldCloseOnClickOutside: false,
            shouldCloseOnEsc: true,
            isFullScreen: true,
            className: "advgb-preset-modal"
          }, content);
        }
        return content;
      }
    }]);
  }(Component);
  window.AdvGBPresetManager = PresetManager;
})(wp.i18n, wp.components, wp.element, wp.data);
})();

/******/ })()
;
//# sourceMappingURL=preset-manager.js.map