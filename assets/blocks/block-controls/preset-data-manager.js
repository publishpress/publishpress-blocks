// Global Preset Data Manager
(function () {
    'use strict';

    const { __ } = wp.i18n;

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
        updatePresets(newPresets, operation = 'update') {
            this.presets = Array.isArray(newPresets) ? newPresets : [];
            // Update the original global variable for backward compatibility
            if (typeof advgb_block_controls_vars !== 'undefined') {
                advgb_block_controls_vars.presets = this.presets;
            }

            /*const messages = {
                'add': __('Preset added successfully!', 'advanced-gutenberg'),
                'update': __('Preset updated successfully!', 'advanced-gutenberg'),
                'delete': __('Preset deleted successfully!', 'advanced-gutenberg')
            };

            if (messages[operation]) {
                this.advgbTimerStatus(messages[operation], 'success');
            }*/

            this.notifySubscribers();
        },

        advgbTimerStatus(message = '', type = 'success') {
            setTimeout(function () {
                var uniqueClass = "advgb-floating-msg-" + Math.round(new Date().getTime() + Math.random() * 100);

                if (message === '') {
                    message = type === "success" ? __("Changes saved!", "advanced-gutenberg") : __(" Error: changes can't be saved.", "advanced-gutenberg");
                }

                var instances = document.querySelectorAll('.advgb-floating-status').length;
                var statusElement = document.createElement('span');
                statusElement.className = 'advgb-floating-status advgb-floating-status--' + type + ' ' + uniqueClass;
                statusElement.textContent = message;

                var wpbodyContent = document.getElementById('wpbody-content');
                if (wpbodyContent) {
                    wpbodyContent.parentNode.insertBefore(statusElement, wpbodyContent.nextSibling);
                }

                statusElement.style.bottom = (instances * 45) + 'px';
                statusElement.style.display = 'block';

                setTimeout(function() {
                    statusElement.style.opacity = '0';
                    setTimeout(function() {
                        if (statusElement.parentNode) {
                            statusElement.parentNode.removeChild(statusElement);
                        }
                    }, 1000);
                }, 10000);
            }, 500);
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