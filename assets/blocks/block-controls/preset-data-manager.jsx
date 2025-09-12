// Global Preset Data Manager
(function () {
    'use strict';

    window.AdvGBPresetData = {
        presets: typeof advgb_block_controls_vars !== 'undefined' && advgb_block_controls_vars.presets
            ? advgb_block_controls_vars.presets
            : [],

        subscribers: [],

        // Subscribe to preset data changes
        subscribe(callback) {
            this.subscribers.push(callback);
        },

        // Unsubscribe from preset data changes
        unsubscribe(callback) {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        },

        // Notify all subscribers of data changes
        notifySubscribers() {
            this.subscribers.forEach(callback => {
                try {
                    callback(this.presets);
                } catch (error) {
                    console.error('Error in preset data subscriber:', error);
                }
            });
        },

        // Update all presets data
        updatePresets(newPresets) {
            this.presets = Array.isArray(newPresets) ? newPresets : [];

            // Update the original global variable for backward compatibility
            if (typeof advgb_block_controls_vars !== 'undefined') {
                advgb_block_controls_vars.presets = this.presets;
            }

            this.notifySubscribers();
        },

        // Add a new preset
        addPreset(preset) {
            if (preset && preset.id) {
                this.presets.push(preset);
                this.updateGlobalVar();
                this.notifySubscribers();
            }
        },

        // Update an existing preset
        updatePreset(presetId, updatedPreset) {
            const index = this.presets.findIndex(p => p.id === presetId);
            if (index !== -1) {
                this.presets[index] = { ...this.presets[index], ...updatedPreset };
                this.updateGlobalVar();
                this.notifySubscribers();
            }
        },

        // Remove a preset
        removePreset(presetId) {
            this.presets = this.presets.filter(p => p.id !== presetId);
            this.updateGlobalVar();
            this.notifySubscribers();
        },

        // Get preset by ID
        getPreset(presetId) {
            return this.presets.find(p => p.id === presetId);
        },

        // Get all presets
        getAllPresets() {
            return [...this.presets];
        },

        // Update global variable for backward compatibility
        updateGlobalVar() {
            if (typeof advgb_block_controls_vars !== 'undefined') {
                advgb_block_controls_vars.presets = this.presets;
            }
        }
    };

    // Initialize with existing data
    if (typeof advgb_block_controls_vars !== 'undefined' && advgb_block_controls_vars.presets) {
        window.AdvGBPresetData.presets = Array.isArray(advgb_block_controls_vars.presets)
            ? advgb_block_controls_vars.presets
            : [];
    }
})();