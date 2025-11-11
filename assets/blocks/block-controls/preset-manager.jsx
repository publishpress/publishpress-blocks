import { AdvDateTimeControl, AdvDaysControl, AdvTimeControl, AdvTimezoneControl } from "../0-adv-components/datetime.jsx";
import {
    getOptionSuggestions,
    getOptionTitles,
    getOptionSlugs
} from "../0-adv-components/utils.jsx";

(function (wpI18n, wpComponents, wpElement, wpData) {
    const { __, sprintf } = wpI18n;
    const {
        Card,
        CardBody,
        CardHeader,
        Button,
        TextControl,
        TextareaControl,
        SelectControl,
        ToggleControl,
        RangeControl,
        FormTokenField,
        Modal,
        Notice,
        Spinner,
        PanelBody,
        BaseControl,
        RadioControl,
        DateTimePicker
    } = wpComponents;
    const { Component, Fragment } = wpElement;
    const { useSelect, useDispatch } = wpData;



    const ScheduleControl = ({ index, schedule, onChange, onRemove, getTimezoneLabel, getTimezoneSlug, canRemove }) => {
        return (
            <div style={{
                marginBottom: 5,
                padding: 5,
                border: '1px solid #ddd',
                borderRadius: 4
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h4>{sprintf(__('Schedule #%d', 'advanced-gutenberg'), index + 1)}</h4>
                    {canRemove && (
                        <Button
                            isDestructive
                            isLink
                            onClick={onRemove}
                        >
                            {__('Remove', 'advanced-gutenberg')}
                        </Button>
                    )}
                </div>

                <AdvDateTimeControl
                    buttonLabel={__('Now', 'advanced-gutenberg')}
                    dateLabel={__('Start showing', 'advanced-gutenberg')}
                    date={schedule.dateFrom}
                    onChangeDate={(newDate) => onChange('dateFrom', newDate)}
                    onDateClear={() => onChange('dateFrom', null)}
                    onInvalidDate={false}
                />
                <AdvDateTimeControl
                    buttonLabel={__('Never', 'advanced-gutenberg')}
                    dateLabel={__('Stop showing', 'advanced-gutenberg')}
                    date={schedule.dateTo || null}
                    onChangeDate={(newDate) => onChange('dateTo', newDate)}
                    onDateClear={() => onChange('dateTo', null)}
                    onInvalidDate={(date) => {
                        if (schedule.dateFrom) {
                            let thisDate = new Date(date.getTime());
                            thisDate.setHours(0, 0, 0, 0);
                            let fromDate = new Date(schedule.dateFrom);
                            fromDate.setHours(0, 0, 0, 0);
                            return thisDate.getTime() < fromDate.getTime();
                        }
                        return false;
                    }}
                />

                {(schedule.dateFrom && schedule.dateTo) &&
                    <ToggleControl
                        label={__('Recurring', 'advanced-gutenberg')}
                        checked={schedule.recurring || false}
                        onChange={() => onChange('recurring', !schedule.recurring)}
                        help={__('If Recurring is enabled, this block will be displayed every year between the selected dates.', 'advanced-gutenberg')}
                    />
                }

                <AdvDaysControl
                    label={__('On these days (optional)', 'advanced-gutenberg')}
                    days={schedule.days || []}
                    onChangeDays={(value) => onChange('days', value)}
                />

                <label style={{ marginBottom: 8, display: 'block' }}>
                    {__('Between these times (optional)', 'advanced-gutenberg')}
                </label>
                <AdvTimeControl
                    label={__('From', 'advanced-gutenberg')}
                    currentTime={schedule.timeFrom || null}
                    onChangeTime={(newTime) => onChange('timeFrom', newTime)}
                    onTimeClear={() => onChange('timeFrom', null)}
                />
                <AdvTimeControl
                    label={__('To', 'advanced-gutenberg')}
                    currentTime={schedule.timeTo || null}
                    onChangeTime={(newTime) => onChange('timeTo', newTime)}
                    onTimeClear={() => onChange('timeTo', null)}
                />

                {(
                    schedule.timeFrom
                    && schedule.timeTo
                    && (
                        '01/01/2020T' + schedule.timeFrom >= '01/01/2020T' + schedule.timeTo
                    )
                ) &&
                    <Notice
                        className="advgb-notice-sidebar"
                        status="warning"
                        isDismissible={false}
                    >
                        {__('"To" time should be after "From" time!', 'advanced-gutenberg')}
                    </Notice>
                }

                <AdvTimezoneControl
                    label={__('Timezone', 'advanced-gutenberg')}
                    defaultTimezone={getTimezoneLabel()}
                    value={schedule.timezone || getTimezoneSlug()}
                    onChangeTimezone={(value) => onChange('timezone', value)}
                />
            </div>
        );
    };

    class PresetManager extends Component {
        constructor(props) {
            super(props);
            this.state = {
                presets: [],
                currentPreset: this.getDefaultPreset(),
                editingPreset: null,
                showModal: false,
                modalMode: 'create', // 'create' or 'edit',
                loading: false,
                saving: false,
                error: null,
                deleting: false,
                deletingPresetId: null,
                lastAction: null, // 'created', 'cancelled', 'deleted', 'saved', 'loaded'
            };

            this.messageContainerRef = React.createRef();

            this.handleModalClose = this.handleModalClose.bind(this);
            this.createNewPreset = this.createNewPreset.bind(this);
            this.editPreset = this.editPreset.bind(this);
            this.savePreset = this.savePreset.bind(this);
            this.deletePreset = this.deletePreset.bind(this);
            this.addControlSet = this.addControlSet.bind(this);
            this.removeControlSet = this.removeControlSet.bind(this);
            this.addRuleToSet = this.addRuleToSet.bind(this);
            this.removeRuleFromSet = this.removeRuleFromSet.bind(this);
            this.updateRuleData = this.updateRuleData.bind(this);
        }

        componentDidMount() {
            this.setState({ loading: true });
            this.initializePresets();
            this.setupDataSync();
        }

        componentWillUnmount() {
            if (this.dataUnsubscribe && window.AdvGBPresetData) {
                window.AdvGBPresetData.unsubscribe(this.dataUnsubscribe);
            }
        }

        setupDataSync() {
            // Sync with global data changes
            if (window.AdvGBPresetData && window.AdvGBPresetData.subscribe) {
                this.dataUnsubscribe = window.AdvGBPresetData.subscribe((presets) => {
                    this.setState({
                        presets: Array.isArray(presets) ? presets : [],
                        // Clear editing state if the current preset was deleted
                        editingPreset: this.state.editingPreset && presets.find(p => p.id === this.state.editingPreset.id)
                            ? this.state.editingPreset
                            : null,
                        currentPreset: this.state.currentPreset && presets.find(p => p.id === this.state.currentPreset.id)
                            ? this.state.currentPreset
                            : null
                    });
                });
            }
        }

        async createSamplePresets() {
            this.setState({ loading: true, error: null });

            try {
                const response = await wp.apiFetch({
                    path: '/advgb/v1/sample-presets',
                    method: 'POST'
                });

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
            } catch (error) {
                console.error('Failed to create sample presets:', error);
                this.setState({
                    error: __('Failed to create sample presets', 'advanced-gutenberg'),
                    loading: false
                });
            }
        }


        async initializePresets() {
            try {
                await this.waitForGlobalData();

                const presets = await this.loadPresetsFromSources();

                this.setState({
                    presets: presets,
                    loading: false,
                    currentPreset: this.getDefaultPreset()
                });
            } catch (error) {
                console.error('Failed to initialize presets:', error);
                this.setState({
                    loading: false,
                    error: __('Failed to load presets', 'advanced-gutenberg')
                });
            }
        }

        waitForGlobalData() {
            return new Promise((resolve) => {
                const checkData = () => {
                    if (window.AdvGBPresetData || (window.advgb_block_controls_vars && window.advgb_block_controls_vars.presets)) {
                        resolve();
                    } else {
                        setTimeout(checkData, 100);
                    }
                };
                checkData();
            });
        }

        async loadPresetsFromSources() {
            try {
                // Try API first
                const response = await wp.apiFetch({
                    path: '/advgb/v1/presets'
                });

                if (Array.isArray(response)) {
                    return response;
                }

                // Fallback to global data
                if (window.AdvGBPresetData && typeof window.AdvGBPresetData.getAllPresets === 'function') {
                    const globalPresets = window.AdvGBPresetData.getAllPresets();
                    if (Array.isArray(globalPresets)) {
                        return globalPresets;
                    }
                }

                // Final fallback
                return [];

            } catch (error) {
                console.warn('Failed to load presets:', error);

                // Try global data as fallback
                if (window.AdvGBPresetData && typeof window.AdvGBPresetData.getAllPresets === 'function') {
                    const globalPresets = window.AdvGBPresetData.getAllPresets();
                    if (Array.isArray(globalPresets)) {
                        return globalPresets;
                    }
                }

                return [];
            }
        }

        async loadPresets() {
            this.setState({ loading: true });
            try {
                const presets = await this.loadPresetsFromSources();
                this.setState({
                    presets: presets,
                    loading: false,
                    lastAction: presets.length > 0 ? 'loaded' : 'empty'
                });
            } catch (error) {
                console.error('Failed to load presets:', error);
                this.setState({
                    error: __('Failed to load presets', 'advanced-gutenberg'),
                    loading: false,
                    lastAction: 'error'
                });
            }
        }

        getDefaultPreset(defaultpreset = true) {
            return {
                id: null,
                default: defaultpreset,
                title: '',
                controlSets: [],
                created: null,
                modified: null
            };
        }

        loadPresets() {
            if (window.AdvGBPresetData) {
                this.setState({
                    presets: window.AdvGBPresetData.getAllPresets(),
                    loading: false
                });
            }
        }

        async savePreset(presetData) {
            this.setState({ saving: true, error: null });

            try {
                const response = await wp.apiFetch({
                    path: '/advgb/v1/presets',
                    method: 'POST',
                    data: presetData
                });

                if (response.success) {
                    await this.loadPresets();

                    const newPreset = response.presets.find(p => p.id === response.id);
                    if (newPreset) {

                        const updatedPresets = response.presets || [];
                        // Update global preset data
                        if (window.AdvGBPresetData) {
                            window.AdvGBPresetData.updatePresets(updatedPresets);
                        }

                        this.setState({
                            editingPreset: null,
                            currentPreset: null,
                            saving: false,
                            showModal: false,
                            lastAction: 'saved'
                        }, () => {
                            this.scrollToMessage();
                        });
                    } else {
                        this.setState({
                            saving: false,
                            showModal: false,
                            lastAction: 'saved'
                        }, () => {
                            this.scrollToMessage();
                        });
                    }
                    return response;
                }
            } catch (error) {
                this.setState({
                    error: error.message,
                    saving: false,
                    lastAction: 'error'
                }, () => {
                    this.scrollToMessage();
                });
                throw error;
            }
        }

        async savePreset(presetData) {
            this.setState({ saving: true, error: null });

            try {
                const response = await wp.apiFetch({
                    path: '/advgb/v1/presets',
                    method: 'POST',
                    data: presetData
                });

                if (response.success) {
                    await this.loadPresets();

                    const newPreset = response.presets.find(p => p.id === response.id);
                    if (newPreset) {
                        const updatedPresets = response.presets || [];
                        if (window.AdvGBPresetData) {
                            window.AdvGBPresetData.updatePresets(updatedPresets);
                        }

                        this.setState({
                            editingPreset: null,
                            currentPreset: null,
                            saving: false,
                            showModal: false,
                            lastAction: 'saved'
                        }, () => {
                            // Scroll to top after state update
                            this.scrollToMessage();
                        });
                    } else {
                        this.setState({
                            saving: false,
                            showModal: false,
                            lastAction: 'saved'
                        }, () => {
                            this.scrollToMessage();
                        });
                    }
                    return response;
                }
            } catch (error) {
                this.setState({
                    error: error.message,
                    saving: false,
                    lastAction: 'error'
                }, () => {
                    this.scrollToMessage();
                });
                throw error;
            }
        }

        async deletePreset(presetId) {
            this.setState({
                deleting: true,
                deletingPresetId: presetId
            });

            try {
                const response = await wp.apiFetch({
                    path: `/advgb/v1/presets/${presetId}`,
                    method: 'DELETE'
                });

                if (response.success) {
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
                    }, () => {
                        this.scrollToMessage();
                    });
                    await this.loadPresets();
                }
            } catch (error) {
                this.setState({
                    deleting: false,
                    deletingPresetId: null,
                    error: error.message
                }, () => {
                    this.scrollToMessage();
                });
            }
        }

        createNewPreset() {
            this.setState({
                currentPreset: this.getDefaultPreset(false),
                editingPreset: null,
                modalMode: 'create',
                showModal: true,
                lastAction: 'creating'
            }, () => {
                this.scrollToMessage();
            });
        }

        editPreset(preset) {
            this.setState({
                currentPreset: { ...preset },
                modalMode: 'edit',
                editingPreset: preset,
                showModal: true,
                lastAction: 'editing'
            }, () => {
                this.scrollToMessage();
            });
        }

        scrollToMessage() {
            console.log('now?')
            setTimeout(() => {
                console.log('wn?')
                console.log(this.messageContainerRef);
                console.log(this.messageContainerRef.current);
                if (this.messageContainerRef.current) {
                    this.messageContainerRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    console.log('scroll')
                }
            }, 100);
        }

        toggleControlSet(setIndex) {
            const { currentPreset } = this.state;
            const newControlSets = [...currentPreset.controlSets];

            const isCurrentlyExpanded = newControlSets[setIndex].expanded !== false;
            newControlSets[setIndex].expanded = !isCurrentlyExpanded;

            this.setState({
                currentPreset: {
                    ...currentPreset,
                    controlSets: newControlSets
                }
            });
        }

        toggleRule(setIndex, ruleIndex) {
            const { currentPreset } = this.state;
            const newControlSets = [...currentPreset.controlSets];

            const isCurrentlyExpanded = newControlSets[setIndex].rules[ruleIndex].expanded !== false;
            newControlSets[setIndex].rules[ruleIndex].expanded = !isCurrentlyExpanded;

            this.setState({
                currentPreset: {
                    ...currentPreset,
                    controlSets: newControlSets
                }
            });
        }

        isControlSetExpanded(setIndex) {
            const { currentPreset } = this.state;
            if (!currentPreset.controlSets || !currentPreset.controlSets[setIndex]) {
                return true;
            }
            return currentPreset.controlSets[setIndex].expanded !== false;
        }

        isRuleExpanded(setIndex, ruleIndex) {
            const { currentPreset } = this.state;
            if (!currentPreset.controlSets ||
                !currentPreset.controlSets[setIndex] ||
                !currentPreset.controlSets[setIndex].rules ||
                !currentPreset.controlSets[setIndex].rules[ruleIndex]) {
                return true;
            }
            return currentPreset.controlSets[setIndex].rules[ruleIndex].expanded !== false;
        }

        addControlSet() {
            const newControlSet = {
                id: Date.now().toString(),
                rules: [],
                expanded: true
            };

            const updatedControlSets = [newControlSet, ...this.state.currentPreset.controlSets];

            this.setState({
                currentPreset: {
                    ...this.state.currentPreset,
                    controlSets: updatedControlSets
                }
            });
        }

        removeControlSet(setIndex) {

            const { currentPreset } = this.state;
            const newControlSets = currentPreset.controlSets.filter((_, index) => index !== setIndex);

            this.setState({
                currentPreset: {
                    ...currentPreset,
                    controlSets: newControlSets
                }
            });
        }

        addRuleToSet(setIndex, ruleType) {
            const newRule = this.createRuleByType(ruleType);

            const updatedControlSets = [...this.state.currentPreset.controlSets];
            updatedControlSets[setIndex].rules.unshift(newRule);

            this.setState({
                currentPreset: {
                    ...this.state.currentPreset,
                    controlSets: updatedControlSets
                }
            });
        }

        createRuleByType(ruleType) {
            const baseRule = {
                id: Date.now(),
                type: ruleType,
                enabled: true,
                expanded: true
            };

            switch (ruleType) {
                case 'schedule':
                    return { ...baseRule, schedules: [] };
                case 'user_role':
                    return { ...baseRule, roles: [], approach: 'include' };
                case 'device_type':
                    return { ...baseRule, devices: [] };
                case 'device_width':
                    return { ...baseRule, min_width: '', max_width: '' };
                case 'browser_device':
                    return { ...baseRule, browsers: [], approach: 'include' };
                case 'operating_system':
                    return { ...baseRule, systems: [], approach: 'include' };
                case 'cookie':
                    return { ...baseRule, name: '', condition: '=', value: '', approach: 'include' };
                case 'user_meta':
                    return { ...baseRule, key: '', condition: '=', value: '', approach: 'include' };
                case 'post_meta':
                    return { ...baseRule, key: '', condition: '=', value: '', approach: 'include' };
                case 'query_string':
                    return { ...baseRule, queries: [], logic: 'all', approach: 'include' };
                case 'capabilities':
                    return { ...baseRule, capabilities: [], approach: 'include' };
                case 'archive':
                    return { ...baseRule, taxonomies: [], approach: 'include' };
                case 'page':
                    return { ...baseRule, pages: [], approach: 'include' };
                default:
                    return baseRule;
            }
        }

        getAvailableRuleTypes() {
            return [
                { value: 'schedule', label: __('Schedule', 'advanced-gutenberg') },
                { value: 'user_role', label: __('User Roles', 'advanced-gutenberg') },
                { value: 'device_type', label: __('Device Type', 'advanced-gutenberg') },
                { value: 'device_width', label: __('Device Width', 'advanced-gutenberg') },
                { value: 'browser_device', label: __('Browser', 'advanced-gutenberg') },
                { value: 'operating_system', label: __('Operating System', 'advanced-gutenberg') },
                { value: 'cookie', label: __('Cookie', 'advanced-gutenberg') },
                { value: 'user_meta', label: __('User Meta', 'advanced-gutenberg') },
                { value: 'post_meta', label: __('Post Meta', 'advanced-gutenberg') },
                { value: 'query_string', label: __('Query String', 'advanced-gutenberg') },
                { value: 'capabilities', label: __('Capabilities', 'advanced-gutenberg') },
                { value: 'archive', label: __('Archive', 'advanced-gutenberg') },
                { value: 'page', label: __('Page', 'advanced-gutenberg') }
            ];
        }

        formatDate(dateString) {
            if (!dateString) return __('Never modified', 'advanced-gutenberg');

            try {
                const date = new Date(dateString);

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

        getRuleTypeLabel(ruleType) {
            const ruleTypes = this.getAvailableRuleTypes();
            const ruleTypeObj = ruleTypes.find(type => type.value === ruleType);
            return ruleTypeObj ? ruleTypeObj.label : ruleType;
        }


        renderPresetList() {
            const { presets, editingPreset } = this.state;

            return (
                <div className="advgb-presets-list">
                    {(!presets || presets.length === 0) && (
                        <div className="advgb-empty-presets-message">
                            <h3>{__('No presets yet', 'advanced-gutenberg')}</h3>
                            <p>{__('You have not created any preset.', 'advanced-gutenberg')}</p>
                        </div>
                    )}

                    {presets && presets.length > 0 && presets.map(preset => {
                        const isActive = editingPreset && editingPreset.id === preset.id;
                        const itemClasses = [
                            'advgb-preset-item',
                            isActive && 'active'
                        ].filter(Boolean).join(' ');

                        return (
                            <div
                                key={preset.id}
                                className={itemClasses}
                                onClick={() => this.editPreset(preset)}
                            >
                                <div className="advgb-preset-content">
                                    <span className="advgb-preset-title" title={preset.title}>{preset.title}</span>
                                </div>
                                <div className="advgb-preset-list-actions">
                                    <Button
                                        isSmall
                                        icon="edit"
                                        label={__('Edit', 'advanced-gutenberg')}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.editPreset(preset);
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        renderPresetForm() {
            const { currentPreset, saving, deleting } = this.state;

            if (!currentPreset) return null;

            return (
                <div className="advgb-preset-form">
                    <div className="advgb-preset-header">
                        <div className="advgb-preset-title-section">
                            <TextControl
                                label={__('Preset Title', 'advanced-gutenberg')}
                                value={currentPreset.title || ''}
                                onChange={(title) => this.setState({
                                    currentPreset: { ...currentPreset, title }
                                })}
                                placeholder={__('Enter preset name', 'advanced-gutenberg')}
                                className="advgb-title-input"
                            />
                        </div>
                    </div>

                    <div className="advgb-control-sets-container">
                        <div className="advgb-control-sets-header">
                            <h3>{__('Control Sets', 'advanced-gutenberg')}</h3>
                            <p className="advgb-control-sets-description">
                                {__('Show the block if any control set applies. Each set can contain multiple rules.', 'advanced-gutenberg')}
                            </p>

                            <button type="button"
                                className="button button-secondary"
                                onClick={this.addControlSet}>
                                {__('Add Control Set', 'advanced-gutenberg')}
                            </button>
                        </div>

                        <div className="advgb-control-sets">
                            {(currentPreset.controlSets || []).map((controlSet, index) => (
                                <Fragment key={controlSet.id || index}>
                                    {index > 0 && (
                                        <div className="advgb-set-separator">
                                            <span className="advgb-separator-text">{__('OR', 'advanced-gutenberg')}</span>
                                        </div>
                                    )}
                                    {this.renderControlSet(controlSet, index)}
                                </Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="advgb-preset-actions">
                        {currentPreset.id && (
                            <div className="ppb-tooltips-library click advgb-delete-preset-tooltip" data-toggle="ppbtooltip" data-placement="top">
                                <button className="advgb-delete-preset-btn button button-secondary advgb-destructive-button"
                                    disabled={deleting || saving}
                                >
                                    {deleting ? (
                                        <>
                                            <Spinner />
                                            {__('Deleting...', 'advanced-gutenberg')}
                                        </>
                                    ) : (
                                        __('Delete Preset', 'advanced-gutenberg')
                                    )}
                                </button>
                                <div className="tooltip-text">
                                    <p>
                                        {__('Are you sure you want to delete preset?', 'advanced-gutenberg')}
                                        <br />
                                        <Button
                                            isLink
                                            isSmall
                                            isDestructive
                                            label={__('Delete Preset', 'advanced-gutenberg')}
                                            onClick={(e) => {
                                                this.deletePreset(currentPreset.id);
                                            }}
                                        >
                                            <strong>
                                                {__('Yes, Delete Preset.', 'advanced-gutenberg')}
                                            </strong>
                                        </Button>
                                        |
                                        <Button
                                            isLink
                                            isSmall
                                            label={__('No, Cancel', 'advanced-gutenberg')}
                                        >
                                            {__('No, Cancel.', 'advanced-gutenberg')}
                                        </Button>
                                    </p>
                                    <i></i>
                                </div>
                            </div>
                        )}
                        <button
                         onClick={() => this.savePreset(this.state.currentPreset)}
                            disabled={saving || !currentPreset.title}
                        className="advgb-save-btn button button-primary">
                             {saving ? (
                                <>
                                    <Spinner />
                                    {__('Saving...', 'advanced-gutenberg')}
                                </>
                            ) : (
                                __('Save Preset', 'advanced-gutenberg')
                            )}
                        </button>
                        <button
                            className="button button-secondary"
                            onClick={this.handleModalClose}
                            disabled={saving}>
                             {__('Cancel', 'advanced-gutenberg')}
                        </button>
                    </div>
                </div>
            );
        }

        renderControlSet(controlSet, setIndex) {
            const isExpanded = this.isControlSetExpanded(setIndex);

            return (
                <div className="advgb-control-set" key={controlSet.id || setIndex}>
                    <div className="advgb-control-set-header">
                        <div
                            className="advgb-set-info advgb-preset-clickable-area"
                            onClick={() => this.toggleControlSet(setIndex)}
                        >
                            <div className="advgb-set-title-row">
                                <span className={`dashicons dashicons-arrow-${isExpanded ? 'down' : 'right'}`}></span>
                                <div className="title-row-text">
                                    <h4>{__('Control Set', 'advanced-gutenberg')} {setIndex + 1}</h4>
                                    <p>{__('Show the block if any rule applies. Rules are evaluated with AND logic.', 'advanced-gutenberg')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="advgb-set-actions">
                            <SelectControl
                                value=""
                                options={[
                                    { value: '', label: __('Add Rule', 'advanced-gutenberg') },
                                    ...this.getAvailableRuleTypes()
                                ]}
                                onChange={(ruleType) => {
                                    if (ruleType) {
                                        this.addRuleToSet(setIndex, ruleType);
                                    }
                                }}
                                className="advgb-add-rule-select"
                            />
                            <div className="ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="left">
                                <Button
                                    isLink
                                    isSmall
                                    isDestructive
                                    icon="trash"
                                    label={__('Delete Set', 'advanced-gutenberg')}
                                />
                                <div className="tooltip-text">
                                    <p>
                                        {__('Are you sure you want to delete set?', 'advanced-gutenberg')}
                                        <br />
                                        <Button
                                            isLink
                                            isSmall
                                            isDestructive
                                            label={__('Delete Set', 'advanced-gutenberg')}
                                            onClick={() => this.removeControlSet(setIndex)}
                                        >
                                            <strong>
                                                {__('Yes, Delete Set.', 'advanced-gutenberg')}
                                            </strong>
                                        </Button>
                                        |
                                        <Button
                                            isLink
                                            isSmall
                                            label={__('No, Cancel', 'advanced-gutenberg')}
                                        >
                                            {__('No, Cancel.', 'advanced-gutenberg')}
                                        </Button>
                                    </p>
                                    <i></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="advgb-control-set-rules">
                            {(controlSet.rules || []).map((rule, ruleIndex) => (
                                <div key={rule.id || ruleIndex} className="advgb-rule-container">
                                    {ruleIndex > 0 && (
                                        <div className="advgb-rule-separator">
                                            <span className="advgb-separator-text">{__('AND', 'advanced-gutenberg')}</span>
                                        </div>
                                    )}
                                    {this.renderControlRule(rule, setIndex, ruleIndex)}
                                </div>
                            ))}

                            {(!controlSet.rules || controlSet.rules.length === 0) && (
                                <div className="advgb-no-rules">
                                    <p>{__('No rules added yet. Add rules to define when this block should be visible.', 'advanced-gutenberg')}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        renderControlRule(rule, setIndex, ruleIndex) {
            const isExpanded = this.isRuleExpanded(setIndex, ruleIndex);

            return (
                <div className="advgb-control-rule">
                    <div className="advgb-rule-header">
                        <div
                            className="advgb-rule-type advgb-preset-clickable-area"
                            onClick={() => this.toggleRule(setIndex, ruleIndex)}
                        >
                            <span className={`dashicons dashicons-arrow-${isExpanded ? 'down' : 'right'}`}></span>
                            <span className="advgb-rule-type-icon">📋</span>
                            <span className="advgb-rule-type-label">{this.getRuleTypeLabel(rule.type)}</span>
                        </div>
                        <div className="advgb-rule-actions">
                            <div className="ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="left">
                                <Button
                                    isLink
                                    isSmall
                                    isDestructive
                                    icon="trash"
                                    label={__('Remove Rule', 'advanced-gutenberg')}
                                />
                                <div className="tooltip-text">
                                    <p>
                                        {__('Are you sure you want to remove rule?', 'advanced-gutenberg')}
                                        <br />
                                        <Button
                                            isLink
                                            isSmall
                                            isDestructive
                                            label={__('Remove Rule', 'advanced-gutenberg')}
                                            onClick={() => this.removeRuleFromSet(setIndex, ruleIndex)}
                                        >
                                            <strong>
                                                {__('Yes, Remove Rule.', 'advanced-gutenberg')}
                                            </strong>
                                        </Button>
                                        |
                                        <Button
                                            isLink
                                            isSmall
                                            label={__('No, Cancel', 'advanced-gutenberg')}
                                        >
                                            {__('No, Cancel.', 'advanced-gutenberg')}
                                        </Button>
                                    </p>
                                    <i></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="advgb-rule-content">
                            {this.renderRuleConfiguration(rule, setIndex, ruleIndex)}
                        </div>
                    )}
                </div>
            );
        }

        renderRuleConfiguration(rule, setIndex, ruleIndex) {
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
                    return <p>{__('Configuration for this rule type is missing.', 'advanced-gutenberg')}</p>;
            }
        }

        updateRuleData(setIndex, ruleIndex, key, value) {
            const { currentPreset } = this.state;
            const newControlSets = [...currentPreset.controlSets];
            newControlSets[setIndex].rules[ruleIndex][key] = value;

            this.setState({
                currentPreset: {
                    ...currentPreset,
                    controlSets: newControlSets
                }
            });
        }

        removeRuleFromSet(setIndex, ruleIndex) {

            const { currentPreset } = this.state;
            const newControlSets = [...currentPreset.controlSets];
            newControlSets[setIndex].rules.splice(ruleIndex, 1);

            this.setState({
                currentPreset: {
                    ...currentPreset,
                    controlSets: newControlSets
                }
            });
        }

        handleModalClose() {
            this.setState({
                showModal: false,
                currentPreset: null,
                editingPreset: null,
                modalMode: 'create',
                lastAction: 'cancelled'
            }, () => {
                this.scrollToMessage();
            });
        }

        getBrowserOptions() {
            return [
                { slug: 'chrome', title: 'Chrome' },
                { slug: 'firefox', title: 'Firefox' },
                { slug: 'safari', title: 'Safari' },
                { slug: 'edge', title: 'Edge' },
                { slug: 'opera', title: 'Opera' },
                { slug: 'internet explorer', title: 'Internet Explorer' }
            ];
        }

        getOperatingSystemOptions() {
            return [
                { slug: 'windows', title: 'Windows' },
                { slug: 'mac', title: 'macOS' },
                { slug: 'linux', title: 'Linux' },
                { slug: 'android', title: 'Android' },
                { slug: 'ios', title: 'iOS' },
                { slug: 'chrome os', title: 'Chrome OS' }
            ];
        }

        getConditionOptions() {
            return [
                { label: '=', value: '=' },
                { label: '!=', value: '!=' },
                { label: '<', value: '<' },
                { label: '>', value: '>' },
                { label: '<=', value: '<=' },
                { label: '>=', value: '>=' },
                { label: 'contains', value: 'contains' },
                { label: 'begins with', value: 'beginsWith' },
                { label: 'ends with', value: 'endsWith' },
                { label: 'does not contain', value: 'doesNotContain' },
                { label: 'does not begin with', value: 'doesNotBeginWith' },
                { label: 'does not end with', value: 'doesNotEndWith' },
                { label: 'is null', value: 'null' },
                { label: 'is not null', value: 'notNull' }
            ];
        }

        getUserRoles() {
            return typeof advgb_block_controls_vars.user_roles !== 'undefined'
                && advgb_block_controls_vars.user_roles.length > 0
                ? advgb_block_controls_vars.user_roles
                : [];
        }

        getCapabilitiesOptions() {
            const capabilities = typeof advgb_block_controls_vars.capabilities !== 'undefined'
                ? advgb_block_controls_vars.capabilities
                : [];

            return capabilities.map(cap => ({
                slug: cap,
                title: cap.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
            }));
        }

        getArchiveOptions() {
            return typeof advgb_block_controls_vars.taxonomies !== 'undefined'
                && advgb_block_controls_vars.taxonomies.length > 0
                ? advgb_block_controls_vars.taxonomies
                : [];
        }

        getPageOptions() {
            return typeof advgb_block_controls_vars.page !== 'undefined'
                && advgb_block_controls_vars.page.length > 0
                ? advgb_block_controls_vars.page
                : [];
        }

        getTimezoneLabel() {
            return __('WordPress settings timezone', 'advanced-gutenberg');
        }

        getTimezoneSlug() {
            return typeof advgbBlocks.timezone !== 'undefined' && advgbBlocks.timezone.length
                ? advgbBlocks.timezone
                : 'UTC';
        }


        renderScheduleConfig(rule, setIndex, ruleIndex) {
            const schedules = rule.schedules && rule.schedules.length > 0
                ? rule.schedules
                : [{
                    dateFrom: null,
                    dateTo: null,
                    recurring: false,
                    days: [],
                    timeFrom: null,
                    timeTo: null,
                    timezone: this.getTimezoneSlug()
                }];

            return (
                <Fragment>
                    {schedules.map((schedule, scheduleIndex) => (
                        <ScheduleControl
                            key={scheduleIndex}
                            index={scheduleIndex}
                            schedule={schedule}
                            onChange={(key, value) => {
                                const updatedSchedules = [...schedules];
                                updatedSchedules[scheduleIndex][key] = value;
                                this.updateRuleData(setIndex, ruleIndex, 'schedules', updatedSchedules);
                            }}
                            onRemove={() => {
                                if (schedules.length > 1) {
                                    const updatedSchedules = schedules.filter((_, idx) => idx !== scheduleIndex);
                                    this.updateRuleData(setIndex, ruleIndex, 'schedules', updatedSchedules);
                                }
                            }}
                            getTimezoneLabel={() => this.getTimezoneLabel()}
                            getTimezoneSlug={() => this.getTimezoneSlug()}
                            canRemove={schedules.length > 1}
                        />
                    ))}
                    <div style={{ marginBottom: 16 }}>
                        <Button
                            style={{ width: '100%', display: 'block' }}
                            className="button button-secondary"
                            onClick={() => {
                                const newSchedule = {
                                    dateFrom: null,
                                    dateTo: null,
                                    recurring: false,
                                    days: [],
                                    timeFrom: null,
                                    timeTo: null,
                                    timezone: this.getTimezoneSlug()
                                };
                                this.updateRuleData(setIndex, ruleIndex, 'schedules', [...schedules, newSchedule]);
                            }}
                        >
                            {__('Add Another Schedule', 'advanced-gutenberg')}
                        </Button>
                    </div>
                </Fragment>
            );
        }

        renderUserRoleConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'public'}
                        options={[
                            { value: 'public', label: __('Show to everyone', 'advanced-gutenberg') },
                            { value: 'hidden', label: __('Hide from everyone', 'advanced-gutenberg') },
                            { value: 'login', label: __('Show to logged in users', 'advanced-gutenberg') },
                            { value: 'logout', label: __('Show to logged out users', 'advanced-gutenberg') },
                            { value: 'include', label: __('Show to selected user roles', 'advanced-gutenberg') },
                            { value: 'exclude', label: __('Hide from selected user roles', 'advanced-gutenberg') }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                    {(rule.approach === 'include' || rule.approach === 'exclude') && (
                        <FormTokenField
                            multiple
                            label={__('Select user roles', 'advanced-gutenberg')}
                            placeholder={__('Search roles', 'advanced-gutenberg')}
                            suggestions={getOptionSuggestions(this.getUserRoles())}
                            maxSuggestions={10}
                            value={getOptionTitles(rule.roles || [], this.getUserRoles())}
                            onChange={(value) => {
                                this.updateRuleData(setIndex, ruleIndex, 'roles', getOptionSlugs(value, this.getUserRoles()));
                            }}
                            __experimentalExpandOnFocus
                        />
                    )}
                </Fragment>
            );
        }

        renderDeviceTypeConfig(rule, setIndex, ruleIndex) {
            const devices = rule.devices || [];
            return (
                <Fragment>
                    <div style={{ paddingLeft: '17%' }}>
                        {['desktop', 'tablet', 'mobile', 'robot'].map(deviceType => (
                            <ToggleControl
                                key={deviceType}
                                label={__(deviceType.charAt(0).toUpperCase() + deviceType.slice(1), 'advanced-gutenberg')}
                                checked={devices.includes(deviceType)}
                                onChange={() => {
                                    const newDevices = devices.includes(deviceType)
                                        ? devices.filter(d => d !== deviceType)
                                        : [...devices, deviceType];
                                    this.updateRuleData(setIndex, ruleIndex, 'devices', newDevices);
                                }}
                            />
                        ))}
                    </div>
                </Fragment>
            );
        }

        renderDeviceWidthConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <TextControl
                        type="number"
                        label={__('Minimum width (px)', 'advanced-gutenberg')}
                        value={rule.min_width || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'min_width', value)}
                        placeholder={__('No minimum', 'advanced-gutenberg')}
                    />
                    <TextControl
                        type="number"
                        label={__('Maximum width (px)', 'advanced-gutenberg')}
                        value={rule.max_width || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'max_width', value)}
                        placeholder={__('No maximum', 'advanced-gutenberg')}
                    />
                </Fragment>
            );
        }

        renderBrowserDeviceConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <FormTokenField
                        multiple
                        label={__('Select Browsers', 'advanced-gutenberg')}
                        placeholder={__('Search browsers', 'advanced-gutenberg')}
                        suggestions={getOptionSuggestions(this.getBrowserOptions())}
                        maxSuggestions={10}
                        value={getOptionTitles(rule.browsers || [], this.getBrowserOptions())}
                        onChange={(value) => {
                            this.updateRuleData(setIndex, ruleIndex, 'browsers', getOptionSlugs(value, this.getBrowserOptions()));
                        }}
                        __experimentalExpandOnFocus
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show to selected browsers', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide from selected browsers', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        renderOperatingSystemConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <FormTokenField
                        multiple
                        label={__('Select Operating Systems', 'advanced-gutenberg')}
                        placeholder={__('Search operating systems', 'advanced-gutenberg')}
                        suggestions={getOptionSuggestions(this.getOperatingSystemOptions())}
                        maxSuggestions={10}
                        value={getOptionTitles(rule.systems || [], this.getOperatingSystemOptions())}
                        onChange={(value) => {
                            this.updateRuleData(setIndex, ruleIndex, 'systems', getOptionSlugs(value, this.getOperatingSystemOptions()));
                        }}
                        __experimentalExpandOnFocus
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show to selected OS', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide from selected OS', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        renderCookieConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <TextControl
                        label={__('Cookie Name', 'advanced-gutenberg')}
                        value={rule.name || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'name', value)}
                    />
                    <SelectControl
                        label={__('Condition', 'advanced-gutenberg')}
                        value={rule.condition || '='}
                        options={this.getConditionOptions()}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'condition', value)}
                    />
                    <TextControl
                        label={__('Value', 'advanced-gutenberg')}
                        value={rule.value || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'value', value)}
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show when condition matches', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide when condition matches', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        renderUserMetaConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <TextControl
                        label={__('Meta Key', 'advanced-gutenberg')}
                        value={rule.key || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'key', value)}
                    />
                    <SelectControl
                        label={__('Condition', 'advanced-gutenberg')}
                        value={rule.condition || '='}
                        options={this.getConditionOptions()}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'condition', value)}
                    />
                    <TextControl
                        label={__('Value', 'advanced-gutenberg')}
                        value={rule.value || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'value', value)}
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show when condition matches', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide when condition matches', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        // Post Meta Configuration
        renderPostMetaConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <TextControl
                        label={__('Meta Key', 'advanced-gutenberg')}
                        value={rule.key || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'key', value)}
                    />
                    <SelectControl
                        label={__('Condition', 'advanced-gutenberg')}
                        value={rule.condition || '='}
                        options={this.getConditionOptions()}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'condition', value)}
                    />
                    <TextControl
                        label={__('Value', 'advanced-gutenberg')}
                        value={rule.value || ''}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'value', value)}
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show when condition matches', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide when condition matches', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        renderQueryStringConfig(rule, setIndex, ruleIndex) {
            const queriesValue = Array.isArray(rule.queries)
                ? rule.queries.join('\n')
                : (rule.queries || '');
            return (
                <Fragment>
                    <TextareaControl
                        label={__('Query Parameters', 'advanced-gutenberg')}
                        help={__('Enter query parameter names, one per line', 'advanced-gutenberg')}
                        value={queriesValue}
                        onChange={(value) => {
                            this.updateRuleData(setIndex, ruleIndex, 'queries', value);
                        }}
                        placeholder={__('utm_source\nutm_medium\nref', 'advanced-gutenberg')}
                    />
                    <SelectControl
                        label={__('Logic', 'advanced-gutenberg')}
                        value={rule.logic || 'all'}
                        options={[
                            { label: __('All parameters must be present', 'advanced-gutenberg'), value: 'all' },
                            { label: __('Any parameter must be present', 'advanced-gutenberg'), value: 'any' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'logic', value)}
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show when condition matches', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide when condition matches', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        renderCapabilitiesConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <FormTokenField
                        multiple
                        label={__('Select Capabilities', 'advanced-gutenberg')}
                        placeholder={__('Search capabilities', 'advanced-gutenberg')}
                        suggestions={getOptionSuggestions(this.getCapabilitiesOptions())}
                        maxSuggestions={10}
                        value={getOptionTitles(rule.capabilities || [], this.getCapabilitiesOptions())}
                        onChange={(value) => {
                            this.updateRuleData(setIndex, ruleIndex, 'capabilities', getOptionSlugs(value, this.getCapabilitiesOptions()));
                        }}
                        __experimentalExpandOnFocus
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show to users with selected capabilities', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide from users with selected capabilities', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        renderArchiveConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <FormTokenField
                        multiple
                        label={__('Select Archive Types', 'advanced-gutenberg')}
                        placeholder={__('Search archive types', 'advanced-gutenberg')}
                        suggestions={getOptionSuggestions(this.getArchiveOptions())}
                        maxSuggestions={10}
                        value={getOptionTitles(rule.archives || [], this.getArchiveOptions())}
                        onChange={(value) => {
                            this.updateRuleData(setIndex, ruleIndex, 'archives', getOptionSlugs(value, this.getArchiveOptions()));
                        }}
                        __experimentalExpandOnFocus
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show on selected archives', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide from selected archives', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        renderPageConfig(rule, setIndex, ruleIndex) {
            return (
                <Fragment>
                    <FormTokenField
                        multiple
                        label={__('Select Pages', 'advanced-gutenberg')}
                        placeholder={__('Search pages', 'advanced-gutenberg')}
                        suggestions={getOptionSuggestions(this.getPageOptions())}
                        maxSuggestions={10}
                        value={getOptionTitles(rule.pages || [], this.getPageOptions())}
                        onChange={(value) => {
                            this.updateRuleData(setIndex, ruleIndex, 'pages', getOptionSlugs(value, this.getPageOptions()));
                        }}
                        __experimentalExpandOnFocus
                    />
                    <SelectControl
                        label={__('Approach', 'advanced-gutenberg')}
                        value={rule.approach || 'include'}
                        options={[
                            { label: __('Show on selected pages', 'advanced-gutenberg'), value: 'include' },
                            { label: __('Hide from selected pages', 'advanced-gutenberg'), value: 'exclude' }
                        ]}
                        onChange={(value) => this.updateRuleData(setIndex, ruleIndex, 'approach', value)}
                    />
                </Fragment>
            );
        }

        getUserRoles() {
            return typeof advgb_block_controls_vars.user_roles !== 'undefined'
                ? advgb_block_controls_vars.user_roles
                : [];
        }

        getCapabilitiesOptions() {
            const capabilities = typeof advgb_block_controls_vars.capabilities !== 'undefined'
                ? advgb_block_controls_vars.capabilities
                : [];

            return capabilities.map(cap => ({
                slug: cap,
                title: cap.split('_').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')
            }));
        }

        getArchiveOptions() {
            return [
                { slug: 'category', title: __('Category Archives', 'advanced-gutenberg') },
                { slug: 'tag', title: __('Tag Archives', 'advanced-gutenberg') },
                { slug: 'date', title: __('Date Archives', 'advanced-gutenberg') },
                { slug: 'author', title: __('Author Archives', 'advanced-gutenberg') }
            ];
        }

        getPageOptions() {
            return typeof advgb_block_controls_vars.page !== 'undefined'
                ? advgb_block_controls_vars.page
                : [];
        }

        removeRuleFromSet(setIndex, ruleIndex) {
            const { currentPreset } = this.state;
            const newControlSets = [...currentPreset.controlSets];
            newControlSets[setIndex].rules.splice(ruleIndex, 1);

            this.setState({
                currentPreset: {
                    ...currentPreset,
                    controlSets: newControlSets
                }
            });
        }


        renderContextualMessage(lastAction) {
            const { presets } = this.state;

            let title, description, icon, showFeatures = false, showStats = false;

            const hasPresets = presets && presets.length > 0;
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

            return (
                <>
                    {icon && (
                        <div className="advgb-guidance-icon">
                            <span className={`dashicons dashicons-${icon}`}></span>
                        </div>
                    )}
                    <h3>{title}</h3>
                    <p>{description}</p>

                    {showStats && this.renderPresetStats()}
                    {showFeatures && this.renderFeatureGrid()}

                    <div className="advgb-guidance-actions">

                        <button className="button button-primary"
                            onClick={() => this.createNewPreset()}
                        >
                            {__('Create New Preset', 'advanced-gutenberg')}
                        </button>
                        {!hasPresets && (
                            <button className="button button-secondary"
                                onClick={() => this.createSamplePresets()}
                            >
                                {__('Generate Samples', 'advanced-gutenberg')}
                            </button>
                        )}
                    </div>
                </>
            );
        }

        renderPresetStats() {
            const { presets } = this.state;
            const totalPresets = presets?.length || 0;
            const totalRules = presets?.reduce((count, preset) => {
                return count + (preset.controlSets?.reduce((setCount, set) => {
                    return setCount + (set.rules?.length || 0);
                }, 0) || 0);
            }, 0) || 0;

            return (
                <div className="advgb-preset-stats-overview">
                    <div className="advgb-preset-stat-card">
                        <span className="advgb-preset-stat-number">{totalPresets}</span>
                        <span className="advgb-preset-stat-label">{__('Total Presets', 'advanced-gutenberg')}</span>
                    </div>
                    <div className="advgb-preset-stat-card">
                        <span className="advgb-preset-stat-number">{totalRules}</span>
                        <span className="advgb-preset-stat-label">{__('Rules Created', 'advanced-gutenberg')}</span>
                    </div>
                </div>
            );
        }

        renderFeatureGrid() {
            return (
                <div className="advgb-preset-features-grid">
                    <div className="advgb-preset-feature-card">
                        <div className="advgb-preset-feature-icon">
                            <span className="dashicons dashicons-visibility"></span>
                        </div>
                        <h4>{__('Conditional Visibility', 'advanced-gutenberg')}</h4>
                        <p>{__('Control when blocks appear based on user roles, devices, schedules, and more', 'advanced-gutenberg')}</p>
                    </div>

                    <div className="advgb-preset-feature-card">
                        <div className="advgb-preset-feature-icon">
                            <span className="dashicons dashicons-admin-users"></span>
                        </div>
                        <h4>{__('User Targeting', 'advanced-gutenberg')}</h4>
                        <p>{__('Show or hide content to specific user roles, logged-in status, or capabilities', 'advanced-gutenberg')}</p>
                    </div>

                    <div className="advgb-preset-feature-card">
                        <div className="advgb-preset-feature-icon">
                            <span className="dashicons dashicons-clock"></span>
                        </div>
                        <h4>{__('Scheduling', 'advanced-gutenberg')}</h4>
                        <p>{__('Set time-based rules to display content only during specific periods', 'advanced-gutenberg')}</p>
                    </div>
                </div>
            );
        }

        render() {
            const { showModal, loading, error, currentPreset, editingPreset, deleting, presets, lastAction } = this.state;
            const { isModal = false } = this.props;

            const hasActiveForm = (currentPreset && !currentPreset.default) || editingPreset;
            const hasPresets = presets && presets.length > 0;

            if (loading) {
                return (
                    <div className="advgb-preset-loading-container">
                        <div className="advgb-preset-loading-spinner">
                            <div className="advgb-spinner">
                                <div className="advgb-spinner-circle"></div>
                            </div>
                            <p>{__('Loading presets...', 'advanced-gutenberg')}</p>
                        </div>
                    </div>
                );
            }


            if (error) {
                return <Notice status="error">{error}</Notice>;
            }

            const content = (
                <>
                    <div className="advgb-preset-sidebar-header" ref={this.messageContainerRef}>
                        {!hasActiveForm && (
                            <>
                                <button className="button button-secondary"
                                    onClick={() => this.createNewPreset()}
                                >
                                    {__('Add New Preset', 'advanced-gutenberg')}
                                </button>
                                {!hasPresets && (
                                    <button className="button button-primary"
                                        onClick={() => this.createSamplePresets()}
                                    >
                                        {__('Generate Sample Preset', 'advanced-gutenberg')}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    <div className={`advgb-preset-manager ${deleting ? 'deleting' : ''}`}>
                        {deleting && (
                            <div className="advgb-preset-deleting-overlay">
                                <div className="advgb-preset-deleting-message">
                                    <Spinner />
                                </div>
                            </div>
                        )}

                        {(hasPresets || hasActiveForm) && (
                            <div className="advgb-preset-sidebar">
                                {this.renderPresetList()}
                            </div>
                        )}

                        <div className="advgb-preset-editor">
                            {(hasPresets || lastAction == 'creating') && hasActiveForm && this.renderPresetForm()}

                            {(!hasPresets && lastAction !== 'creating') && (
                                <div className="advgb-welcome-message">
                                    <div className="advgb-welcome-icon">
                                        <svg
                                        width="48px" height="48px" viewBox="0 0 155.00 155.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#2271b1"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M106.407 96.8913C111.542 102.976 114.23 109.624 114.119 117.272C113.966 127.809 108.553 135.741 100.947 142.254C92.0832 149.843 81.3711 153.044 69.9069 153.943C67.396 154.087 64.8793 154.095 62.3675 153.968C61.2825 153.947 60.2075 153.756 59.1817 153.401C55.071 151.912 54.4462 148.867 57.7062 146.002C60.9065 143.191 64.3602 140.658 67.443 137.729C69.8054 135.468 71.9448 132.984 73.8318 130.313C75.8297 127.501 76.0056 124.257 74.7671 120.518C72.7928 121.437 70.9019 122.169 69.1639 123.165C65.5199 125.253 63.4643 125.166 60.3381 122.422C57.3006 119.755 54.3156 117.028 51.2938 114.343C50.8442 113.992 50.3743 113.668 49.8866 113.373C48.0535 115.067 46.3496 116.757 44.523 118.301C42.1025 120.348 39.7016 120.401 38.131 118.589C36.6588 116.893 36.901 114.651 39.0282 112.471C40.5377 110.923 42.2626 109.584 43.5372 108.461C40.1098 104.278 36.6555 100.848 34.1719 96.8237C31.2696 92.1178 34.8565 87.9231 37.0979 83.3189C32.8192 83.0504 29.3006 83.8341 26.4724 86.0033C23.7734 88.1917 21.3394 90.6881 19.2199 93.4416C17.1669 95.975 15.57 98.8767 13.7474 101.599C12.0291 104.166 10.2688 106.864 6.65102 106.491C4.14644 106.233 0.654067 101.721 0.422379 98.33C-0.102691 90.599 0.881819 83.0753 4.49168 76.0867C11.1049 63.2881 21.523 54.9657 35.0947 50.5131C40.7812 48.6478 46.5098 49.2418 52.3098 51.0087C52.6314 50.6385 53.0088 50.2697 53.3107 49.8476C68.9736 27.9581 90.3183 14.0634 115.597 5.81196C124.206 3.00217 132.916 0.444402 142.093 0.21009C144.385 0.151676 146.679 -0.0235928 148.97 0.00266074C151.958 0.036134 153.448 1.09614 153.327 4.01488C153.172 9.66322 152.644 15.2951 151.744 20.8736C148.056 41.8521 137.967 59.8443 124.863 76.254C119.763 82.6415 114.02 88.5177 108.563 94.621C107.918 95.3403 107.232 96.0243 106.407 96.8913ZM55.4163 106.628C58.8292 109.34 61.3148 111.468 63.9867 113.323C64.4408 113.537 64.9369 113.646 65.4389 113.644C65.9408 113.641 66.4358 113.527 66.8877 113.308C71.1231 111.063 75.4543 108.915 79.3969 106.215C93.4392 96.5986 106.143 85.4257 116.822 72.1336C122.616 64.9224 127.917 57.3167 133.55 49.7426L100.91 19.4316C99.8323 19.9355 98.7827 20.4966 97.7652 21.1125C91.3987 25.3374 84.9081 29.3961 78.7602 33.9196C71.8687 38.9892 66.0371 45.1843 60.8311 52.0129C52.1969 63.3367 47.1136 76.5599 40.7248 89.0828C40.0895 90.3299 40.4459 92.8417 41.3464 93.9568C43.6901 96.8598 46.5925 99.3126 49.7416 102.406C54.6641 97.3035 58.9959 92.5352 63.6454 88.0938C66.324 85.689 69.196 83.5087 72.2323 81.575C73.8285 80.4907 75.8664 80.1212 77.3268 81.7864C78.8068 83.4745 77.5322 85.1277 76.4919 86.4844C75.2622 88.0169 73.9298 89.4642 72.504 90.8162C69.5505 93.7356 66.5904 96.6465 63.5476 99.4701C60.9951 101.843 58.3212 104.081 55.4163 106.628ZM147.141 6.3889C133.175 6.41712 120.848 11.6094 108.28 15.8349L108.056 16.7045L136.962 41.0731C141.915 33.2233 145.713 20.2816 147.141 6.3889ZM77.9707 141.64C89.7309 139.425 98.8422 133.46 103.962 122.528C107.375 115.232 104.991 108.423 100.968 101.949C94.1966 107.118 87.7199 112.064 81.2445 117.008C86.3449 126.009 83.7327 133.936 77.9707 141.64ZM48.698 56.4944C31.8839 53.7377 8.64104 76.4733 10.1486 92.0817C17.0146 81.239 25.8253 74.7064 39.084 77.0567L48.698 56.4944Z" fill="#2271b1"></path> <path d="M14.6051 140.579C15.1033 139.678 15.6382 138.038 16.7054 136.898C20.7301 132.601 24.9024 128.441 29.0774 124.288C30.3034 123.068 31.8543 122.299 33.4499 123.601C35.1327 124.974 34.3963 126.615 33.402 127.973C29.989 132.633 26.5682 137.293 22.9616 141.802C21.8888 143.034 20.5253 143.979 18.9947 144.55C16.7225 145.446 14.5257 143.644 14.6051 140.579Z" fill="#2271b1"></path> <path d="M51.9876 123.87C54.4075 123.936 56.1665 126.118 55.0901 127.808C52.3487 132.062 49.3371 136.136 46.074 140.004C44.905 141.404 42.8061 141.206 41.3214 139.866C40.6426 139.292 40.1985 138.488 40.0735 137.607C39.9485 136.727 40.1513 135.831 40.6434 135.09C41.5342 133.607 42.5933 132.232 43.7998 130.991C45.587 129.088 47.4753 127.273 49.4167 125.529C50.22 124.897 51.0807 124.342 51.9876 123.87Z" fill="#2271b1"></path> <path d="M30.3682 105.409C29.9062 106.43 29.3605 107.411 28.7366 108.341C25.689 112.145 22.5946 115.911 19.4534 119.638C18.8631 120.274 18.1765 120.813 17.4187 121.234C15.8501 122.199 14.2552 122.197 12.9904 120.769C11.6836 119.294 11.9737 117.656 13.2838 116.387C17.5723 112.23 21.91 108.121 26.3337 104.109C26.912 103.584 28.1433 103.499 28.9893 103.655C29.4973 103.749 29.8465 104.705 30.3682 105.409Z" fill="#2271b1"></path> <path d="M99.4671 35.7334C103.729 35.6749 107.015 37.4181 110.313 40.1649C113.732 43.0121 116.286 46.049 117.548 50.2935C120.461 60.111 114.697 67.338 105.35 68.6599C97.775 69.731 91.3495 66.6114 86.6757 60.6814C82.672 55.6 82.5638 49.6871 85.3407 44.0052C88.1407 38.2721 93.1846 35.7944 99.4671 35.7334ZM90.4707 51.4625C91.5654 53.3514 92.3511 55.7595 93.9821 57.2317C95.6715 58.7564 98.1281 59.5118 100.344 60.3545C103.255 61.4624 105.775 60.2889 107.753 58.2294C109.668 56.2374 109.739 53.7354 108.803 51.1869C107.329 47.1688 103.891 45.1524 100.438 43.3337C97.3373 41.7008 94.3949 42.6774 92.6274 45.7353C91.7262 47.2915 91.3232 49.1358 90.4707 51.4625Z" fill="#2271b1"></path> </g>
                                        </svg>
                                    </div>
                                    <h3>{__('Welcome to Block Control Presets', 'advanced-gutenberg')}</h3>
                                    <p>{__('This screen allows you to create powerful visibility rules for your blocks.', 'advanced-gutenberg')}
                                    <br /> {__('These preset rules are available when you\'re writing posts.', 'advanced-gutenberg')}</p>
                                    {this.renderFeatureGrid()}

                                    <div className="advgb-guidance-actions">
                                        <button className="button button-primary"
                                            onClick={() => this.createNewPreset()}
                                        >
                                            {__('Create Your First Preset', 'advanced-gutenberg')}
                                        </button>
                                        {!hasPresets && (
                                            <button className="button button-secondary"
                                                onClick={() => this.createSamplePresets()}
                                            >
                                                {__('Generate Sample Presets', 'advanced-gutenberg')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {(hasPresets && !hasActiveForm) && (
                                <div
                                    className="advgb-guidance-message"
                                    data-action={lastAction}
                                >
                                    {this.renderContextualMessage(lastAction)}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            );

            if (isModal) {
                return (
                    <Modal
                        title={__('Block Control Presets', 'advanced-gutenberg')}
                        onRequestClose={this.handleModalClose}
                        isDismissible={true}
                        shouldCloseOnClickOutside={false}
                        shouldCloseOnEsc={true}
                        isFullScreen={true}
                        className="advgb-preset-modal"
                    >
                        {content}
                    </Modal>
                );
            }

            return content;
        }
    }

    window.AdvGBPresetManager = PresetManager;

})(wp.i18n, wp.components, wp.element, wp.data);