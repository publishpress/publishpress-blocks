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

        getDefaultPreset() {
            return {
                id: null,
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
                        });
                    } else {
                        this.setState({
                            saving: false,
                            showModal: false,
                            lastAction: 'saved'
                        });
                    }
                    return response;
                }
            } catch (error) {
                this.setState({
                    error: error.message,
                    saving: false,
                    lastAction: 'error'
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
                    });

                    await this.loadPresets();
                }
            } catch (error) {
                this.setState({
                    deleting: false,
                    deletingPresetId: null,
                    error: error.message
                });
            }
        }

        createNewPreset() {
            this.setState({
                currentPreset: this.getDefaultPreset(),
                editingPreset: null,
                modalMode: 'create',
                showModal: true,
                lastAction: 'creating'
            });
        }

        editPreset(preset) {
            this.setState({
                currentPreset: { ...preset },
                modalMode: 'edit',
                editingPreset: preset,
                showModal: true,
                lastAction: 'editing'
            });
        }

        addControlSet() {
            const newControlSet = {
                id: Date.now().toString(),
                rules: []
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
                enabled: true
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
                    return { ...baseRule, taxonomies: [], approach: 'exclude' };
                case 'page':
                    return { ...baseRule, pages: [], approach: 'exclude' };
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
                            <div className="advgb-empty-icon">📋</div>
                            <h3>{__('No presets yet', 'advanced-gutenberg')}</h3>
                            <p>{__('Create your first preset or generate sample presets to get started.', 'advanced-gutenberg')}</p>
                            <div className="advgb-empty-actions">
                                <Button
                                    isPrimary
                                    onClick={() => this.createNewPreset()}
                                    className="advgb-create-first-btn"
                                >
                                    {__('Create First Preset', 'advanced-gutenberg')}
                                </Button>
                                <Button
                                    isSecondary
                                    onClick={() => this.createSamplePresets()}
                                    className="advgb-create-samples-btn"
                                >
                                    {__('Create Sample Presets', 'advanced-gutenberg')}
                                </Button>
                            </div>
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
            const { currentPreset, saving } = this.state;

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
                            <Button
                                isPrimary
                                icon="plus"
                                onClick={this.addControlSet}
                                className="advgb-add-set-btn"
                            >
                                {__('Add Control Set', 'advanced-gutenberg')}
                            </Button>
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
                            <div className="ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="top">
                                <Button
                                    className="advgb-delete-preset-btn is-destructive-outline"
                                    icon="trash"
                                    label={__('Delete Preset', 'advanced-gutenberg')}
                                >
                                    {__('Delete Preset', 'advanced-gutenberg')}
                                </Button>
                                <div className="tooltip-text">
                                    <p>
                                        {__('Are you sure you want to delete preset?', 'advanced-gutenberg')}
                                        <Button
                                            isSmall
                                            isDestructive
                                            label={__('Delete Preset', 'advanced-gutenberg')}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.deletePreset(currentPreset.id);
                                            }}
                                        >
                                            <strong>
                                                {__('Yes, Delete Preset.', 'advanced-gutenberg')}
                                            </strong>
                                        </Button>
                                        |
                                        <Button
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
                        <Button
                            isPrimary
                            onClick={() => this.savePreset(this.state.currentPreset)}
                            disabled={saving || !currentPreset.title}
                            isBusy={saving}
                            className="advgb-save-btn"
                        >
                            {saving ? __('Saving...', 'advanced-gutenberg') : __('Save Preset', 'advanced-gutenberg')}
                        </Button>
                        <Button
                            isSecondary
                            onClick={this.handleModalClose}
                            disabled={saving}
                        >
                            {__('Cancel', 'advanced-gutenberg')}
                        </Button>
                    </div>
                </div>
            );
        }

        renderControlSet(controlSet, setIndex) {
            return (
                <div className="advgb-control-set" key={controlSet.id || setIndex}>
                    <div className="advgb-control-set-header">
                        <div className="advgb-set-info">
                            <h4>{__('Control Set', 'advanced-gutenberg')} {setIndex + 1}</h4>
                            <p>{__('Show the block if any rule applies. Rules are evaluated with AND logic.', 'advanced-gutenberg')}</p>
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
                                    isSmall
                                    isDestructive
                                    icon="trash"
                                    label={__('Delete Set', 'advanced-gutenberg')}
                                />
                                <div className="tooltip-text">
                                    <p>
                                        {__('Are you sure you want to delete set?', 'advanced-gutenberg')}
                                        <Button
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
                                <div className="advgb-no-rules-icon">⚡</div>
                                <p>{__('No rules added yet. Add rules to define when this block should be visible.', 'advanced-gutenberg')}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        renderControlRule(rule, setIndex, ruleIndex) {
            return (
                <div className="advgb-control-rule">
                    <div className="advgb-rule-header">
                        <div className="advgb-rule-type">
                            <span className="advgb-rule-type-icon">📋</span>
                            <span className="advgb-rule-type-label">{this.getRuleTypeLabel(rule.type)}</span>
                        </div>
                        <div className="ppb-tooltips-library click" data-toggle="ppbtooltip" data-placement="left">
                            <Button
                                isSmall
                                isDestructive
                                icon="trash"
                                label={__('Remove Rule', 'advanced-gutenberg')}
                            />
                            <div className="tooltip-text">
                                <p>
                                    {__('Are you sure you want to remove rule?', 'advanced-gutenberg')}
                                    <Button
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

                    <div className="advgb-rule-content">
                        {this.renderRuleConfiguration(rule, setIndex, ruleIndex)}
                    </div>
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
                            isSecondary
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
            let icon, title, description;

            switch (lastAction) {
                case 'cancelled':
                    icon = '↩️';
                    title = __('Edit Cancelled', 'advanced-gutenberg');
                    description = __('Edit cancelled. Select another preset to edit or create a new one.', 'advanced-gutenberg');
                    break;

                case 'saved':
                    icon = '✅';
                    title = __('Preset Saved!', 'advanced-gutenberg');
                    description = __('Preset saved successfully! Choose another preset to edit or create a new one.', 'advanced-gutenberg');
                    break;

                case 'deleted':
                    icon = '🗑️';
                    title = __('Preset Deleted', 'advanced-gutenberg');
                    description = __('Preset deleted. Select another preset to edit or create a new one.', 'advanced-gutenberg');
                    break;

                case 'error':
                    icon = '⚠️';
                    title = __('Action Completed', 'advanced-gutenberg');
                    description = __('Operation completed. You can continue editing presets or create new ones.', 'advanced-gutenberg');
                    break;

                case 'loaded':
                    icon = '📋';
                    title = __('Select a Preset to Edit', 'advanced-gutenberg');
                    description = __('Choose a preset from the list to edit its rules, or create a new preset to get started.', 'advanced-gutenberg');
                    break;

                case 'empty':
                    icon = '📝';
                    title = __('No Presets Yet', 'advanced-gutenberg');
                    description = __('Create your first preset to start managing block visibility rules.', 'advanced-gutenberg');
                    break;

                case 'installed':
                    icon = '✅';
                    title = __('Sample Created!', 'advanced-gutenberg');
                    description = __('Preset sample created successfully! Choose a preset to edit or create a new one.', 'advanced-gutenberg');
                    break;

                default:
                    icon = '👋';
                    title = __('Manage Your Presets', 'advanced-gutenberg');
                    description = __('Select a preset to edit or create a new one to control block visibility.', 'advanced-gutenberg');
            }

            return (
                <>
                    <div className="advgb-guidance-icon">{icon}</div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <div className="advgb-guidance-actions">
                        <Button
                            isPrimary
                            onClick={() => this.createNewPreset()}
                            className="advgb-guidance-create-btn"
                        >
                            {__('Create New Preset', 'advanced-gutenberg')}
                        </Button>
                        {lastAction === 'loaded' && (
                            <Button
                                isSecondary
                                onClick={() => this.createSamplePresets()}
                                className="advgb-guidance-samples-btn"
                            >
                                {__('Add More Samples', 'advanced-gutenberg')}
                            </Button>
                        )}
                    </div>
                </>
            );
        }

        render() {
            const { showModal, loading, error, currentPreset, editingPreset, deleting, presets, lastAction } = this.state;
            const { isModal = false } = this.props;

            const hasActiveForm = currentPreset || editingPreset;
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
                <div className={`advgb-preset-manager ${deleting ? 'deleting' : ''}`}>
                    {deleting && (
                        <div className="advgb-preset-deleting-overlay">
                            <div className="advgb-preset-deleting-message">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div className="advgb-preset-sidebar">
                        <div className="advgb-preset-sidebar-header">
                            {hasPresets && !hasActiveForm && (
                                <Button
                                    isPrimary
                                    onClick={() => this.createNewPreset()}
                                >
                                    {__('Add New', 'advanced-gutenberg')}
                                </Button>
                            )}
                        </div>
                        {this.renderPresetList()}
                    </div>

                    <div className="advgb-preset-editor">
                        {/* Only show form if we have presets AND a preset is selected */}
                        {(hasPresets || lastAction == 'creating') && hasActiveForm && this.renderPresetForm()}

                        {/* Show welcome message when no presets exist */}
                        {!hasPresets && lastAction !== 'creating' && (
                            <div className="advgb-welcome-message">
                                <div className="advgb-welcome-icon">🚀</div>
                                <h3>{__('Welcome to Block Control Presets', 'advanced-gutenberg')}</h3>
                                <p>{__('Create your first preset or generate sample presets to get started with advanced block visibility rules.', 'advanced-gutenberg')}</p>
                            </div>
                        )}

                        {/* Contextual guidance message */}
                        {hasPresets && !hasActiveForm && (
                            <div
                                className="advgb-guidance-message"
                                data-action={lastAction}
                            >
                                {this.renderContextualMessage(lastAction)}
                            </div>
                        )}
                    </div>
                </div>
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