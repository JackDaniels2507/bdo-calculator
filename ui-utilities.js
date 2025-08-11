// ============================================
// UI Utility Functions for BDO Enhancement Calculator
// ============================================

/**
 * Creates a DOM element with attributes and children
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - Key-value pairs of attributes
 * @param {Array|string} [children] - Child elements or text content
 * @returns {HTMLElement} - The created element
 */
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key === 'style' && typeof value === 'string') {
            element.style.cssText = value;
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Add children
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

/**
 * Common styles and color schemes used throughout the application
 */
const UI_STYLES = {
    colors: {
        vendor: 'rgba(52, 152, 219, 0.2)',
        costume: 'rgba(155, 89, 182, 0.2)',
        neutral: 'rgba(155, 89, 182, 0.1)',
        vendorRGB: '#3498db',
        costumeRGB: '#9b59b6',
        danger: '#e74c3c'
    },
    button: {
        base: 'border: none; color: white; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.9em;',
        vendor: 'background-color: #3498db;',
        costume: 'background-color: #9b59b6;',
        danger: 'background-color: #e74c3c;'
    }
};

/**
 * Creates a standardized button with preset styles
 * @param {string} text - Button text
 * @param {string} type - Button type: 'vendor', 'costume', or 'danger'
 * @param {Function} onClick - Click handler function
 * @returns {HTMLElement} - The created button element
 */
function createStandardButton(text, type, onClick) {
    const button = createElement('button', {
        type: 'button',
        className: `btn btn-sm btn-${type}`,
        style: UI_STYLES.button.base + UI_STYLES.button[type]
    }, text);
    
    if (onClick) {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

/**
 * Creates a set of cron selector buttons (Vendor, Costume, Clear)
 * @param {string} containerClass - CSS class for the container
 * @param {Object} handlers - Object with vendorHandler, costumeHandler, clearHandler functions
 * @returns {HTMLElement} - Container with all three buttons
 */
function createCronSelectorButtons(containerClass, handlers) {
    const container = createElement('div', {
        className: containerClass,
        style: 'display: flex; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 5px;'
    });

    const vendorBtn = createStandardButton('Select All Vendor Crons', 'vendor', handlers.vendorHandler);
    const costumeBtn = createStandardButton('Select All Costume Crons', 'costume', handlers.costumeHandler);
    const clearBtn = createStandardButton('Clear All Crons', 'danger', handlers.clearHandler);

    container.appendChild(vendorBtn);
    container.appendChild(costumeBtn);
    container.appendChild(clearBtn);

    return container;
}

/**
 * Sets cron checkbox state and visual styling
 * @param {HTMLElement} checkbox - The checkbox element
 * @param {string} cronType - 'vendor' or 'costume'
 * @param {boolean} checked - Whether to check the checkbox
 * @param {HTMLElement} container - Container element for background styling
 */
function setCronCheckboxState(checkbox, cronType, checked, container) {
    if (!checkbox) return;
    
    if (!checkbox.disabled) {
        checkbox.checked = checked;
        checkbox.dataset.manuallyChanged = 'true';
    }
    
    if (checked) {
        checkbox.dataset.cronType = cronType;
        if (container) {
            container.style.backgroundColor = UI_STYLES.colors[cronType];
        }
    } else {
        delete checkbox.dataset.cronType;
        if (container) {
            container.style.backgroundColor = UI_STYLES.colors.neutral;
        }
    }
}

/**
 * Unified radio button state management
 * @param {HTMLElement} vendorRadio - Vendor radio button
 * @param {HTMLElement} costumeRadio - Costume radio button
 * @param {boolean} enabled - Whether radio buttons should be enabled
 * @param {string|null} selectedType - 'vendor', 'costume', or null to clear selection
 */
function setRadioButtonState(vendorRadio, costumeRadio, enabled, selectedType = null) {
    if (!vendorRadio || !costumeRadio) return;
    
    // Find containers and labels
    const vendorContainer = vendorRadio.closest('.cron-type-radio');
    const costumeContainer = costumeRadio.closest('.cron-type-radio');
    const vendorLabel = document.querySelector(`label[for="${vendorRadio.id}"]`);
    const costumeLabel = document.querySelector(`label[for="${costumeRadio.id}"]`);
    
    if (enabled) {
        // Enable radio buttons
        vendorRadio.disabled = false;
        costumeRadio.disabled = false;
        
        // Enable containers
        if (vendorContainer) {
            vendorContainer.classList.add('enabled');
            vendorContainer.style.opacity = '1';
            vendorContainer.style.pointerEvents = 'auto';
            vendorContainer.style.cursor = 'pointer';
        }
        if (costumeContainer) {
            costumeContainer.classList.add('enabled');
            costumeContainer.style.opacity = '1';
            costumeContainer.style.pointerEvents = 'auto';
            costumeContainer.style.cursor = 'pointer';
        }
        
        // Enable labels
        if (vendorLabel) {
            vendorLabel.style.pointerEvents = 'auto';
            vendorLabel.style.cursor = 'pointer';
            vendorLabel.style.opacity = '1';
        }
        if (costumeLabel) {
            costumeLabel.style.pointerEvents = 'auto';
            costumeLabel.style.cursor = 'pointer';
            costumeLabel.style.opacity = '1';
        }
        
        // Set selection
        if (selectedType === 'vendor') {
            vendorRadio.checked = true;
            costumeRadio.checked = false;
        } else if (selectedType === 'costume') {
            vendorRadio.checked = false;
            costumeRadio.checked = true;
        } else if (selectedType === null) {
            // Clear selection but keep enabled
            vendorRadio.checked = false;
            costumeRadio.checked = false;
        }
        // If selectedType is undefined, don't change current selection
        
    } else {
        // Disable radio buttons
        vendorRadio.disabled = true;
        costumeRadio.disabled = true;
        vendorRadio.checked = false;
        costumeRadio.checked = false;
        
        // Disable containers
        if (vendorContainer) {
            vendorContainer.classList.remove('enabled');
            vendorContainer.style.opacity = '0.5';
            vendorContainer.style.pointerEvents = 'none';
            vendorContainer.style.cursor = 'default';
        }
        if (costumeContainer) {
            costumeContainer.classList.remove('enabled');
            costumeContainer.style.opacity = '0.5';
            costumeContainer.style.pointerEvents = 'none';
            costumeContainer.style.cursor = 'default';
        }
        
        // Disable labels
        if (vendorLabel) {
            vendorLabel.style.pointerEvents = 'none';
            vendorLabel.style.cursor = 'default';
            vendorLabel.style.opacity = '0.5';
        }
        if (costumeLabel) {
            costumeLabel.style.pointerEvents = 'none';
            costumeLabel.style.cursor = 'default';
            costumeLabel.style.opacity = '0.5';
        }
    }
}

/**
 * Sets radio button state and updates related elements (DEPRECATED - use setRadioButtonState)
 * @param {HTMLElement} vendorRadio - Vendor radio button
 * @param {HTMLElement} costumeRadio - Costume radio button
 * @param {string} selectedType - 'vendor' or 'costume'
 */
function setCronRadioState(vendorRadio, costumeRadio, selectedType) {
    setRadioButtonState(vendorRadio, costumeRadio, true, selectedType);
}

/**
 * Bulk operation to set all cron checkboxes to a specific type
 * @param {string} selector - CSS selector for checkboxes (e.g., '.use-cron-level')
 * @param {string} cronType - 'vendor' or 'costume'
 * @param {boolean} checked - Whether to check the boxes
 */
function bulkSetCronCheckboxes(selector, cronType, checked) {
    const checkboxes = document.querySelectorAll(selector);
    
    checkboxes.forEach(checkbox => {
        // For clearing, do everything manually to ensure it works
        if (!checked) {
            // Skip disabled checkboxes (required crons) - don't clear them
            if (checkbox.disabled) {
                return; // Skip this checkbox entirely
            }
            
            // Manually clear the checkbox
            checkbox.checked = false;
            
            // Clear data attributes
            delete checkbox.dataset.cronType;
            
            // Reset container background
            const container = checkbox.closest('.cron-level-container');
            if (container) {
                container.style.backgroundColor = UI_STYLES.colors.neutral;
            }
            
            // Get radio elements
            const id = checkbox.id;
            const index = id.replace('use-cron-level-', '');
            const vendorRadio = document.getElementById(`vendor-cron-${index}`);
            const costumeRadio = document.getElementById(`costume-cron-${index}`);
            
            // Clear and disable radio buttons only for non-required checkboxes
            if (vendorRadio && costumeRadio) {
                setRadioButtonState(vendorRadio, costumeRadio, false);
            }
        } else {
            // For checking, use the normal function
            // Mark as bulk operation to prevent individual change handlers from interfering
            checkbox.dataset.bulkOperation = 'true';
            
            const container = checkbox.closest('.cron-level-container');
            setCronCheckboxState(checkbox, cronType, checked, container);
            
            // Update associated radio buttons
            const id = checkbox.id;
            const index = id.replace('use-cron-level-', '');
            const vendorRadio = document.getElementById(`vendor-cron-${index}`);
            const costumeRadio = document.getElementById(`costume-cron-${index}`);
            
            if (vendorRadio && costumeRadio) {
                setRadioButtonState(vendorRadio, costumeRadio, true, cronType);
            }
            
            // Clean up the bulk operation flag
            delete checkbox.dataset.bulkOperation;
        }
    });
}

/**
 * Creates a cron checkbox with radio button controls
 * @param {number} index - Index for unique IDs
 * @param {boolean} isRequired - Whether this checkbox should be required (disabled when checked)
 * @param {string} labelText - Text for the checkbox label
 * @returns {Object} - Object containing checkbox, label, and radio container elements
 */
function createCronCheckboxWithRadios(index, isRequired, labelText) {
    // Create cron checkbox
    const cronCheckbox = createElement('input', {
        type: 'checkbox',
        id: `use-cron-level-${index}`,
        className: 'use-cron-level'
    });
    
    // Set initial state
    if (isRequired) {
        cronCheckbox.checked = true;
        cronCheckbox.disabled = true;
        cronCheckbox.dataset.cronType = 'vendor';
    } else {
        cronCheckbox.checked = false;
        // Add manual change tracking for non-disabled checkboxes
        cronCheckbox.addEventListener('change', function() {
            // Skip if this is part of a bulk operation
            if (this.dataset.bulkOperation) {
                delete this.dataset.bulkOperation;
                return;
            }
            
            this.dataset.manuallyChanged = 'true';
            
            // Get the index from the checkbox ID to find the corresponding radio buttons
            const index = this.id.replace('use-cron-level-', '');
            const vendorRadio = document.getElementById(`vendor-cron-${index}`);
            const costumeRadio = document.getElementById(`costume-cron-${index}`);
            
            if (this.checked) {
                // Enable radio containers and default to vendor if none selected
                if (vendorRadio && costumeRadio) {
                    const currentSelection = vendorRadio.checked ? 'vendor' : (costumeRadio.checked ? 'costume' : 'vendor');
                    setRadioButtonState(vendorRadio, costumeRadio, true, currentSelection);
                }
            } else {
                // Disable radio containers when checkbox is unchecked
                if (vendorRadio && costumeRadio) {
                    setRadioButtonState(vendorRadio, costumeRadio, false);
                }
            }
        });
    }
    
    // Create tooltip
    const cronTooltip = createElement('span', {
        className: 'cron-tooltip',
        title: 'Cron stones prevent item downgrade on failure',
        style: 'margin-left: 5px; color: #777; cursor: help; font-size: 0.9em;'
    }, '(?)');
    
    // Create label
    const cronLabel = createElement('label', {
        for: `use-cron-level-${index}`,
        className: 'per-level-cron-label',
        style: 'margin-right: 10px; display: flex; align-items: center;'
    });
    cronLabel.appendChild(document.createTextNode(labelText));
    cronLabel.appendChild(cronTooltip);
    
    // Create radio button container
    const radioContainer = createElement('div', {
        className: 'cron-type-container',
        style: 'display: flex; align-items: center;'
    });
    
    // Create vendor radio button and container
    const vendorRadioContainer = createElement('div', { 
        className: 'cron-type-radio',
        style: 'cursor: pointer; padding: 2px 4px; border-radius: 3px; transition: background-color 0.2s;'
    });
    const vendorRadio = createElement('input', {
        type: 'radio',
        name: `cron-type-${index}`,
        id: `vendor-cron-${index}`,
        value: 'vendor'
    });
    const vendorLabel = createElement('label', {
        for: `vendor-cron-${index}`,
        style: `margin-right: 10px; color: ${UI_STYLES.colors.vendorRGB}; font-size: 0.9em; cursor: pointer; user-select: none;`
    }, 'Vendor (3M)');
    vendorRadioContainer.appendChild(vendorRadio);
    vendorRadioContainer.appendChild(vendorLabel);
    
    // Make the entire vendor container clickable
    vendorRadioContainer.addEventListener('click', function(e) {
        if (e.target !== vendorRadio && !vendorRadio.disabled) {
            vendorRadio.checked = true;
            // Trigger change event to ensure any listeners are called
            vendorRadio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    
    // Add hover effects
    vendorRadioContainer.addEventListener('mouseenter', function() {
        if (!vendorRadio.disabled) {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        }
    });
    vendorRadioContainer.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
    
    // Create costume radio button and container
    const costumeRadioContainer = createElement('div', { 
        className: 'cron-type-radio',
        style: 'cursor: pointer; padding: 2px 4px; border-radius: 3px; transition: background-color 0.2s;'
    });
    const costumeRadio = createElement('input', {
        type: 'radio',
        name: `cron-type-${index}`,
        id: `costume-cron-${index}`,
        value: 'costume'
    });
    const costumeLabel = createElement('label', {
        for: `costume-cron-${index}`,
        style: `color: ${UI_STYLES.colors.costumeRGB}; font-size: 0.9em; cursor: pointer; user-select: none;`
    }, 'Costume (2.2M)');
    costumeRadioContainer.appendChild(costumeRadio);
    costumeRadioContainer.appendChild(costumeLabel);
    
    // Make the entire costume container clickable
    costumeRadioContainer.addEventListener('click', function(e) {
        if (e.target !== costumeRadio && !costumeRadio.disabled) {
            costumeRadio.checked = true;
            // Trigger change event to ensure any listeners are called
            costumeRadio.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    
    // Add hover effects
    costumeRadioContainer.addEventListener('mouseenter', function() {
        if (!costumeRadio.disabled) {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
        }
    });
    costumeRadioContainer.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
    
    // Add radio containers to main container
    radioContainer.appendChild(vendorRadioContainer);
    radioContainer.appendChild(costumeRadioContainer);
    
    // Set initial radio state
    if (isRequired) {
        // For required checkboxes, enable radios with vendor selected
        setRadioButtonState(vendorRadio, costumeRadio, true, 'vendor');
    } else {
        // For non-required checkboxes, start with radio containers disabled
        setRadioButtonState(vendorRadio, costumeRadio, false);
    }
    
    return {
        checkbox: cronCheckbox,
        label: cronLabel,
        radioContainer: radioContainer,
        vendorRadio: vendorRadio,
        costumeRadio: costumeRadio,
        vendorContainer: vendorRadioContainer,
        costumeContainer: costumeRadioContainer
    };
}

/**
 * Creates an option element for select dropdowns
 * @param {string} value - The option value
 * @param {string} text - The option display text
 * @param {boolean} selected - Whether the option should be selected
 * @returns {HTMLElement} - The created option element
 */
function createOption(value, text, selected = false) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    if (selected) option.selected = true;
    return option;
}

/**
 * Sets active state for region buttons
 * @param {string} activeRegion - 'EU' or 'NA'
 * @param {Object} buttons - Object containing region button references
 */
function setActiveRegion(activeRegion, buttons) {
    const { regionEU, regionNA, simRegionEU, simRegionNA } = buttons;
    
    const regionPairs = [
        { eu: regionEU, na: regionNA },
        { eu: simRegionEU, na: simRegionNA }
    ];
    
    regionPairs.forEach(({ eu, na }) => {
        if (eu && na) {
            if (activeRegion === 'EU') {
                eu.classList.add('active');
                na.classList.remove('active');
            } else {
                eu.classList.remove('active');
                na.classList.add('active');
            }
        }
    });
}

/**
 * Clears results containers
 * @param {HTMLElement[]} containers - Array of result container elements
 */
function clearResults(containers) {
    containers.forEach(container => {
        if (container) {
            container.innerHTML = '';
            container.className = 'results-container';
        }
    });
}

/**
 * Adds event listeners to connect checkbox and radio button behavior
 * @param {Object} cronElements - Object returned from createCronCheckboxWithRadios
 * @param {HTMLElement} levelContainer - Container element for background styling
 */
function addCronCheckboxEventListeners(cronElements, levelContainer) {
    const { checkbox, vendorRadio, costumeRadio, vendorContainer, costumeContainer } = cronElements;
    
    // Radio button event listeners
    vendorRadio.addEventListener('change', function() {
        if (this.checked) {
            checkbox.dataset.cronType = 'vendor';
            if (!checkbox.disabled) {
                checkbox.checked = true;
            }
            if (levelContainer) {
                levelContainer.style.backgroundColor = UI_STYLES.colors.vendor;
            }
        }
    });
    
    costumeRadio.addEventListener('change', function() {
        if (this.checked) {
            checkbox.dataset.cronType = 'costume';
            if (!checkbox.disabled) {
                checkbox.checked = true;
            }
            if (levelContainer) {
                levelContainer.style.backgroundColor = UI_STYLES.colors.costume;
            }
        }
    });
    
    // Checkbox event listener (only for non-disabled checkboxes)
    if (!checkbox.disabled) {
        checkbox.addEventListener('change', function() {
            if (!this.checked) {
                // If unchecked, disable radio button containers
                vendorContainer.classList.remove('enabled');
                costumeContainer.classList.remove('enabled');
                vendorRadio.checked = false;
                costumeRadio.checked = false;
                this.dataset.cronType = '';
                if (levelContainer) {
                    levelContainer.style.backgroundColor = UI_STYLES.colors.neutral;
                }
            } else {
                // If checked, enable radios and ensure one is selected
                vendorContainer.classList.add('enabled');
                costumeContainer.classList.add('enabled');
                if (!vendorRadio.checked && !costumeRadio.checked) {
                    vendorRadio.checked = true;
                    this.dataset.cronType = 'vendor';
                    if (levelContainer) {
                        levelContainer.style.backgroundColor = UI_STYLES.colors.vendor;
                    }
                }
            }
        });
    }
}
