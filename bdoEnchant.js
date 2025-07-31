/**
 * BDO Enchantment Calculator - Simplified version with direct DOM manipulation
 * This version provides a clean, optimized interface for BDO enhancement calculations
 */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', async function() {
    console.log('BDO Enhancement Calculator initializing...');
    
    // Hide simulation tab and related elements as they need more implementation
    const simulationTab = document.querySelector('.tab[data-tab="simulation"]');
    const simulationContent = document.getElementById('simulation-tab');
    const simRegionContainer = document.querySelector('.sim-region-switch');
    
    // Hide the simulation tab
    if (simulationTab) {
        simulationTab.style.display = 'none';
        console.log('Simulation tab hidden as it needs more implementation');
    }
    
    // Hide the simulation content
    if (simulationContent) {
        simulationContent.style.display = 'none';
    }
    
    // Hide the simulation region switches if they exist
    if (simRegionContainer) {
        simRegionContainer.style.display = 'none';
    }
    
    // ============================================
    // Constants
    // ============================================
    
    // Enhancement levels for different items
    const enhancementLevels = {
        'Kharazad': ['BASE', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'],
        'Sovereign': ['BASE', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'],
        'Fallen God\'s Armor': ['BASE', 'I', 'II', 'III', 'IV', 'V']
    };
    
    // ============================================
    // DOM Elements
    // ============================================
    
    // Get calculator tab elements
    const itemSelect = document.getElementById('item-select');
    const startLevelSelect = document.getElementById('start-level');
    const targetLevelSelect = document.getElementById('target-level');
    const failstackContainer = document.getElementById('failstack-container');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const useCronCheckbox = document.getElementById('use-cron');
    
    // Get simulation tab elements
    const simItemSelect = document.getElementById('sim-item-select');
    const simTargetLevel = document.getElementById('sim-target-level');
    const simFailstack = document.getElementById('sim-failstack');
    const simAttempts = document.getElementById('sim-attempts');
    const simUseCron = document.getElementById('sim-use-cron');
    const simAddFS = document.getElementById('sim-add-fs');
    const simulateBtn = document.getElementById('simulate-btn');
    const simResultsDiv = document.getElementById('sim-results');
    
    // Get tab navigation elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Get region switch elements
    const regionEU = document.getElementById('region-eu');
    const regionNA = document.getElementById('region-na');
    const simRegionEU = document.getElementById('sim-region-eu');
    const simRegionNA = document.getElementById('sim-region-na');
    
    // Log which elements were found or not found for debugging
    console.log('DOM elements found:', {
        calculator: {
            itemSelect: !!itemSelect,
            startLevelSelect: !!startLevelSelect,
            targetLevelSelect: !!targetLevelSelect,
            failstackContainer: !!failstackContainer,
            calculateBtn: !!calculateBtn,
            resultsDiv: !!resultsDiv,
            useCronCheckbox: !!useCronCheckbox
        },
        simulator: {
            simItemSelect: !!simItemSelect,
            simTargetLevel: !!simTargetLevel,
            simFailstack: !!simFailstack,
            simAttempts: !!simAttempts,
            simUseCron: !!simUseCron,
            simAddFS: !!simAddFS,
            simulateBtn: !!simulateBtn,
            simResultsDiv: !!simResultsDiv
        },
        tabs: tabs.length,
        tabContents: tabContents.length,
        regions: {
            regionEU: !!regionEU,
            regionNA: !!regionNA,
            simRegionEU: !!simRegionEU,
            simRegionNA: !!simRegionNA
        }
    });
    
    // Set default region
    let currentRegion = 'EU';
    
    console.log('BDO Enhancement Calculator initialized');
    
    // Enhancement item requirements structure mapping items to their required enhancement materials
    // This structure maps each enhanceable item to all the data needed for enhancements
    // Format: { 
    //   itemName: { 
    //     currentLevel: { 
    //       materials: [{itemId: id, count: count}],  // Materials needed to go from currentLevel to next level
    //       cronStones: count,                        // Cron stones needed for this enhancement
    //       enhancementData: {                        // Data for calculating enhancement success chances
    //         baseChance: number,                     // Base success chance percentage at 0 failstacks
    //         softcap: { fs: number, chance: number}, // Softcap failstack threshold and chance
    //         hardcap: { fs: number, chance: number}  // Hardcap failstack threshold and max chance
    //       }
    //     } 
    //   }
    // }
    const enhancementItemRequirements = {
        'Kharazad': {
            'BASE': { 
                materials: [{ itemId: 820979, count: 1 }],    // Essence of Dawn x1 for BASE->I
                cronStones: 0,                               // No cron stones needed for BASE->I
                enhancementData: {
                    baseChance: 16.300,
                    softcap: { fs: 33, chance: 70.09 },
                    hardcap: { fs: 95, chance: 90 }
                }
            },
            'I': { 
                materials: [{ itemId: 820979, count: 2 }],    // Essence of Dawn x2 for I->II
                cronStones: 120,                              // 120 cron stones for I->II
                enhancementData: {
                    baseChance: 7.300,
                    softcap: { fs: 86, chance: 70.08 },
                    hardcap: { fs: 223, chance: 90 }
                }
            },
            'II': { 
                materials: [{ itemId: 820979, count: 3 }],    // Essence of Dawn x3 for II->III
                cronStones: 280,                              // 280 cron stones for II->III
                enhancementData: {
                    baseChance: 4.570,
                    softcap: { fs: 144, chance: 70.38 },
                    hardcap: { fs: 359, chance: 90 }
                }
            },
            'III': { 
                materials: [{ itemId: 820979, count: 4 }],    // Essence of Dawn x4 for III->IV
                cronStones: 540,                              // 540 cron stones for III->IV
                enhancementData: {
                    baseChance: 2.890,
                    softcap: { fs: 233, chance: 70.23 },
                    hardcap: { fs: 576, chance: 90 }
                }
            },
            'IV': { 
                materials: [{ itemId: 820979, count: 6 }],    // Essence of Dawn x6 for IV->V
                cronStones: 840,                             // 840 cron stones for IV->V
                enhancementData: {
                    baseChance: 1.910,
                    softcap: { fs: 357, chance: 70.10 },
                    hardcap: { fs: 878, chance: 90 }
                }
            },
            'V': { 
                materials: [{ itemId: 820979, count: 8 }],    // Essence of Dawn x8 for V->VI
                cronStones: 1090,                             // 1090 cron stones for V->VI
                enhancementData: {
                    baseChance: 1.290,
                    softcap: { fs: 533, chance: 70.05 },
                    hardcap: { fs: 1307, chance: 90 }
                }
            },
            'VI': { 
                materials: [{ itemId: 820979, count: 10 }],   // Essence of Dawn x10 for VI->VII
                cronStones: 1480,                             // 1480 cron stones for VI->VII
                enhancementData: {
                    baseChance: 0.880,
                    softcap: { fs: 786, chance: 70.05 },
                    hardcap: { fs: 1920, chance: 90 }
                }
            },
            'VII': { 
                materials: [{ itemId: 820979, count: 12 }],   // Essence of Dawn x12 for VII->VIII
                cronStones: 1880,                             // 1880 cron stones for VII->VIII
                enhancementData: {
                    baseChance: 0.570,
                    softcap: { fs: 1219, chance: 69.54 },
                    hardcap: { fs: 2969, chance: 90 }
                }
            },
            'VIII': { 
                materials: [{ itemId: 820979, count: 15 }],   // Essence of Dawn x15 for VIII->IX
                cronStones: 2850,                             // 2850 cron stones for VIII->IX
                enhancementData: {
                    baseChance: 0.320,
                    softcap: { fs: 2178, chance: 70.02 },
                    hardcap: { fs: 5300, chance: 90 }
                }
            },
            'IX': { 
                materials: [{ itemId: 820984, count: 1 }],    // DAWN x1 for IX->X
                cronStones: 3650,                             // 3650 cron stones for IX->X
                enhancementData: {
                    baseChance: 0.172,
                    softcap: { fs: 4060, chance: 70.00 },
                    hardcap: { fs: 9872, chance: 90 }
                }
            },
            // X is the max level, no more enhancements
        },
        'Sovereign': {
            'BASE': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for BASE->I
                cronStones: 0,                               // No cron stones needed for BASE->I
                enhancementData: {
                    baseChance: 15.000,
                    softcap: { fs: 30, chance: 70.00 },
                    hardcap: { fs: 90, chance: 90 }
                }
            },
            'I': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for I->II
                cronStones: 320,                              // 320 cron stones for I->II
                enhancementData: {
                    baseChance: 7.000,
                    softcap: { fs: 80, chance: 70.00 },
                    hardcap: { fs: 220, chance: 90 }
                }
            },
            'II': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for II->III
                cronStones: 560,                              // 560 cron stones for II->III
                enhancementData: {
                    baseChance: 4.500,
                    softcap: { fs: 140, chance: 70.00 },
                    hardcap: { fs: 350, chance: 90 }
                }
            },
            'III': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for III->IV
                cronStones: 780,                              // 780 cron stones for III->IV
                enhancementData: {
                    baseChance: 2.800,
                    softcap: { fs: 230, chance: 70.00 },
                    hardcap: { fs: 570, chance: 90 }
                }
            },
            'IV': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for IV->V
                cronStones: 970,                              // 970 cron stones for IV->V
                enhancementData: {
                    baseChance: 1.900,
                    softcap: { fs: 350, chance: 70.00 },
                    hardcap: { fs: 870, chance: 90 }
                }
            },
            'V': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for V->VI
                cronStones: 1350,                             // 1350 cron stones for V->VI
                enhancementData: {
                    baseChance: 1.250,
                    softcap: { fs: 530, chance: 70.00 },
                    hardcap: { fs: 1300, chance: 90 }
                }
            },
            'VI': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for VI->VII
                cronStones: 1550,                             // 1550 cron stones for VI->VII
                enhancementData: {
                    baseChance: 0.850,
                    softcap: { fs: 780, chance: 70.00 },
                    hardcap: { fs: 1900, chance: 90 }
                }
            },
            'VII': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for VII->VIII
                cronStones: 2250,                             // 2250 cron stones for VII->VIII
                enhancementData: {
                    baseChance: 0.550,
                    softcap: { fs: 1200, chance: 70.00 },
                    hardcap: { fs: 2950, chance: 90 }
                }
            },
            'VIII': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for VIII->IX
                cronStones: 2760,                             // 2760 cron stones for VIII->IX
                enhancementData: {
                    baseChance: 0.300,
                    softcap: { fs: 2150, chance: 70.00 },
                    hardcap: { fs: 5250, chance: 90 }
                }
            },
            'IX': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for IX->X
                cronStones: 3920,                             // 3920 cron stones for IX->X
                enhancementData: {
                    baseChance: 0.170,
                    softcap: { fs: 4000, chance: 70.00 },
                    hardcap: { fs: 9800, chance: 90 }
                }
            },
            // X is the max level, no more enhancements
        },
        'Fallen God\'s Armor': {
            // Fallen God's Armor will follow a similar pattern when data is available
        }
    };
    
    // Item name mapping for better display
    const itemNames = {
        820979: "Essence of Dawn",
        820984: "DAWN",
        820934: "Primordial Black Stone"
    };
    
    // Market prices with built-in defaults
    // This will be used both as a cache for fetched prices and as fallback values
    const marketPrices = {
        'EU': {
            // Essence of Dawn
            820979: 83000000, // 83 million silver based on example
            // DAWN (special item that won't be fetched from the market)
            820984: 30000000, // 30 million silver fixed price
            // Primordial Black Stone
            820934: 50000000, // 50 million silver based on provided default
        },
        'NA': {
            // Essence of Dawn with a small price variation for NA
            820979: 83000000,
            // DAWN (special item that won't be fetched from the market)
            820984: 30000000, // 30 million silver fixed price
            // Primordial Black Stone
            820934: 50000000, // 50 million silver based on provided default
        }
    };
    
    // ============================================
    // Utility Functions
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
                for (const [styleKey, styleValue] of Object.entries(value)) {
                    element.style[styleKey] = styleValue;
                }
            } else {
                element.setAttribute(key, value);
            }
        }
        
        // Add children
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                } else if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                }
            });
        }
        
        return element;
    }
    
    /**
     * Calculates success chance based on failstack using BDO formulas
     * @param {string} item - The item being enhanced
     * @param {string} level - The current level
     * @param {number} failstack - The failstack count
     * @returns {number} - The success chance percentage
     */
    function calculateSuccessChance(item, level, failstack) {
        // Get enhancement data for the item and level from the unified structure
        // If the item or level doesn't exist, use default values
        const defaultData = {
            baseChance: 2,
            softcap: { fs: 100, chance: 40 },
            hardcap: { fs: 220, chance: 90 }
        };
        
        // Get the item's data or default to an empty object
        const itemData = enhancementItemRequirements[item] || {};
        
        // Get the level's data or default to an empty object
        const levelData = (itemData[level] && itemData[level].enhancementData) || defaultData;
        
        let successChance;
        
        // Calculate success chance based on failstack using BDO formulas
        if (failstack <= levelData.softcap.fs) {
            // Before softcap: linear interpolation between base chance and softcap chance
            const fsRatio = failstack / levelData.softcap.fs;
            successChance = levelData.baseChance + fsRatio * (levelData.softcap.chance - levelData.baseChance);
        } else if (failstack >= levelData.hardcap.fs) {
            // At or beyond hardcap: use hardcap chance (maximum)
            successChance = levelData.hardcap.chance;
        } else {
            // Between softcap and hardcap: linear interpolation between softcap chance and hardcap chance
            const fsRatio = (failstack - levelData.softcap.fs) / (levelData.hardcap.fs - levelData.softcap.fs);
            successChance = levelData.softcap.chance + fsRatio * (levelData.hardcap.chance - levelData.softcap.chance);
        }
        
        return successChance;
    }
    
    /**
     * Calculates the cost of a single attempt
     * @param {string} item - The item being enhanced
     * @param {string} level - The current level
     * @param {boolean} useCron - Whether to use cron stones
     * @returns {Promise<number>} - The cost of the attempt
     */
    /**
     * Calculates the cost of a single enhancement attempt
     * @param {string} item - The item being enhanced
     * @param {string} level - The current level
     * @param {boolean} useCron - Whether to use cron stones
     * @returns {Promise<number>} - The total cost of the attempt
     */
    async function calculateAttemptCost(item, level, useCron) {
        // Check if we have requirements for this item and level
        const requirements = enhancementItemRequirements[item]?.[level];
        
        // Calculate materials cost
        let materialsCost = 0;
        if (requirements?.materials?.length > 0) {
            // Process each required item
            for (const req of requirements.materials) {
                const { itemId, count } = req;
                
                try {
                    // Get the price for this item
                    const itemPrice = await fetchItemPrice(currentRegion, itemId);
                    const itemTotalCost = itemPrice * count;
                    materialsCost += itemTotalCost;
                    
                    const itemName = itemNames[itemId] || `Item ID ${itemId}`;
                    console.log(`Required ${count}x ${itemName} at ${itemPrice.toLocaleString()} each = ${itemTotalCost.toLocaleString()}`);
                } catch (error) {
                    console.error(`Error fetching price for item ${itemId}:`, error);
                    // Continue with other items if there's an error with one
                }
            }
            
            console.log(`Total materials cost for ${item} ${level}: ${materialsCost.toLocaleString()}`);
        } else {
            console.log(`No requirements defined for ${item} ${level}, setting cost to 0`);
        }
        
        // Add cron stone cost if enabled
        let cronCost = 0;
        if (useCron && requirements) {
            const cronCount = requirements.cronStones || 0;
            const cronPrice = 3000000; // 3 million per cron stone
            cronCost = cronCount * cronPrice;
            console.log(`Adding cron cost: ${cronCount} crons at ${cronPrice.toLocaleString()} each = ${cronCost.toLocaleString()}`);
        }
        
        // Total cost for this attempt
        const totalCost = materialsCost + cronCost;
        console.log(`Total attempt cost for ${item} ${level}: ${totalCost.toLocaleString()}`);
        return totalCost;
    }
    
    /**
     * Formats enhancement level for display (BASE -> Base)
     * @param {string} level - The enhancement level
     * @returns {string} - The formatted enhancement level
     */
    function formatEnhancementLevel(level) {
        return level === 'BASE' ? 'Base' : level;
    }
    
    /**
     * Get item price from pre-fetched JSON files or fallback to default values
     * @param {string} region - The region to fetch from (EU or NA)
     * @param {number} itemId - The item ID to fetch
     * @returns {Promise<number>} - The item price
     */
    async function fetchItemPrice(region, itemId) {
        try {
            // Always try to load price from GitHub-hosted JSON file first to get the most up-to-date values
            try {
                const regionLower = region.toLowerCase();
                // Update this to your actual GitHub username and repository name
                const jsonUrl = `https://jackdaniels2507.github.io/bdo-calculator/bdo-prices-${regionLower}.json`;
                
                console.log(`Fetching latest price from ${jsonUrl} for item ${itemId}`);
                
                const response = await fetch(jsonUrl);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch prices: ${response.status} ${response.statusText}`);
                }
                
                const pricesData = await response.json();
                
                if (pricesData[itemId] && pricesData[itemId].price) {
                    const price = pricesData[itemId].price;
                    console.log(`Found latest price for item ${itemId} in ${region}: ${price}`);
                    
                    // Update the price in our cache
                    marketPrices[region][itemId] = price;
                    return price;
                } 
                throw new Error(`Price not found for item ${itemId} in GitHub data`);
            } catch (fetchError) {
                console.warn(`Could not fetch JSON prices: ${fetchError.message}`);
                
                // Fallback to cached price if available
                if (marketPrices[region]?.[itemId]) {
                    console.log(`Using cached backup price for item ${itemId} in ${region}: ${marketPrices[region][itemId]}`);
                    return marketPrices[region][itemId];
                }
            }
            
            // Last resort: use default value
            console.warn(`No price found for item ${itemId} in region ${region}, using default value`);
            const defaultFallback = 0; 
            marketPrices[region][itemId] = defaultFallback;
            return defaultFallback;
        } catch (error) {
            console.error(`Error in fetchItemPrice:`, error);
            
            // Default fallback if something goes wrong
            const defaultFallback = 0;
            marketPrices[region][itemId] = defaultFallback;
            
            return defaultFallback;
        }
    }
    
    // ============================================
    // Event Handlers
    // ============================================
    
    // Tab switching functionality
    tabs.forEach(tab => {
        console.log('Adding click listener to tab:', tab.getAttribute('data-tab'));
        tab.addEventListener('click', function(e) {
            // Use currentTarget to get the clicked tab element
            const tab = e.currentTarget;
            console.log('Tab clicked:', tab.getAttribute('data-tab'));
            
            // Remove active class from all tabs and tab contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding tab content
            const tabId = tab.getAttribute('data-tab');
            // Special case for simulation tab since ID is different from data-tab attribute
            const contentId = tabId === 'simulation' ? 'simulation-tab' : `${tabId}-tab`;
            const contentEl = document.getElementById(contentId);
            console.log('Activating content element:', contentId, contentEl);
            
            if (contentEl) {
                contentEl.classList.add('active');
            } else {
                console.error(`Tab content element not found: ${contentId}`);
            }
        });
    });
    
    // Region switching functionality
    function switchToEURegion() {
        console.log('Switching to EU region');
        // Update calculator tab buttons
        if (regionEU) regionEU.classList.add('active');
        if (regionNA) regionNA.classList.remove('active');
        
        // Update simulation tab buttons
        if (simRegionEU) simRegionEU.classList.add('active');
        if (simRegionNA) simRegionNA.classList.remove('active');
        
        // Set the current region for API calls
        currentRegion = 'EU';
        
        // Clear any calculation results when region changes
        if (resultsDiv) resultsDiv.innerHTML = '';
        if (simResultsDiv) simResultsDiv.innerHTML = '';
        
        console.log('Market API region set to EU');
    }
    
    function switchToNARegion() {
        console.log('Switching to NA region');
        // Update calculator tab buttons
        if (regionEU) regionEU.classList.remove('active');
        if (regionNA) regionNA.classList.add('active');
        
        // Update simulation tab buttons
        if (simRegionEU) simRegionEU.classList.remove('active');
        if (simRegionNA) simRegionNA.classList.add('active');
        
        // Set the current region for API calls
        currentRegion = 'NA';
        
        // Clear any calculation results when region changes
        if (resultsDiv) resultsDiv.innerHTML = '';
        if (simResultsDiv) simResultsDiv.innerHTML = '';
        
        console.log('Market API region set to NA');
    }
    
    // Add event listeners to all region buttons
    if (regionEU) regionEU.addEventListener('click', switchToEURegion);
    if (regionNA) regionNA.addEventListener('click', switchToNARegion);
    if (simRegionEU) simRegionEU.addEventListener('click', switchToEURegion);
    if (simRegionNA) simRegionNA.addEventListener('click', switchToNARegion);
    
    // ============================================
    // Calculator Functionality
    // ============================================
    
    // Event listener for item selection
    if (itemSelect) {
        itemSelect.addEventListener('change', function() {
            const selectedItem = this.value;
            console.log('Item selected:', selectedItem);
            
            // Reset dependent fields
            startLevelSelect.innerHTML = '<option value="">-- Select Level --</option>';
            targetLevelSelect.innerHTML = '<option value="">-- Select Level --</option>';
            failstackContainer.innerHTML = '';
            calculateBtn.disabled = true;
            
            if (selectedItem) {
                // Enable and populate starting level dropdown
                startLevelSelect.disabled = false;
                const levels = enhancementLevels[selectedItem];
                
                levels.forEach(level => {
                    const option = document.createElement('option');
                    option.value = level;
                    option.textContent = level;
                    startLevelSelect.appendChild(option);
                });
            } else {
                startLevelSelect.disabled = true;
                targetLevelSelect.disabled = true;
            }
        });
    }
    
    // Event listener for starting level selection
    if (startLevelSelect) {
        startLevelSelect.addEventListener('change', function() {
            const selectedItem = itemSelect.value;
            const selectedStartLevel = this.value;
            console.log('Start level selected:', selectedStartLevel);
            
            // Reset dependent fields
            targetLevelSelect.innerHTML = '<option value="">-- Select Level --</option>';
            failstackContainer.innerHTML = '';
            calculateBtn.disabled = true;
            
            if (selectedStartLevel) {
                // Enable and populate target level dropdown
                targetLevelSelect.disabled = false;
                const levels = enhancementLevels[selectedItem];
                const startIndex = levels.indexOf(selectedStartLevel);
                
                // Only show levels higher than the start level
                for (let i = startIndex + 1; i < levels.length; i++) {
                    const option = document.createElement('option');
                    option.value = levels[i];
                    option.textContent = levels[i];
                    targetLevelSelect.appendChild(option);
                }
            } else {
                targetLevelSelect.disabled = true;
            }
        });
    }
    
    // Event listener for target level selection
    if (targetLevelSelect) {
        targetLevelSelect.addEventListener('change', function() {
            const selectedStartLevel = startLevelSelect.value;
            const selectedTargetLevel = this.value;
            console.log('Target level selected:', selectedTargetLevel);
            
            failstackContainer.innerHTML = '';
            
            if (selectedTargetLevel) {
                // Calculate how many enhancement levels are needed
                const selectedItem = itemSelect.value;
                const levels = enhancementLevels[selectedItem];
                const startIndex = levels.indexOf(selectedStartLevel);
                const targetIndex = levels.indexOf(selectedTargetLevel);
                const enhancementCount = targetIndex - startIndex;
                
                // Create a global softcap container with checkbox and label using our helper function
                const globalSoftcapCheckbox = createElement('input', {
                    type: 'checkbox',
                    id: 'global-softcap',
                    className: 'softcap-checkbox'
                });
                
                const globalSoftcapLabel = createElement('label', {
                    for: 'global-softcap',
                    style: {
                        fontWeight: 'bold',
                        marginLeft: '5px',
                        display: 'inline-block'
                    }
                }, 'Use softcap values');
                
                const globalSoftcapContainer = createElement('div', { 
                    className: 'global-softcap-container' 
                }, [globalSoftcapCheckbox, globalSoftcapLabel]);
                
                // Store input references and softcap values for each field
                const inputFields = [];
                const softcapValues = [];
                
                // Add the global softcap elements to the container
                globalSoftcapContainer.appendChild(globalSoftcapCheckbox);
                globalSoftcapContainer.appendChild(globalSoftcapLabel);
                failstackContainer.appendChild(globalSoftcapContainer);
                
                // Generate failstack input fields
                for (let i = 0; i < enhancementCount; i++) {
                    const currentLevel = levels[startIndex + i];
                    const targetLevel = levels[startIndex + i + 1];
                    
                    // Get the softcap failstack value for this enhancement level if available
                    const softcapFS = enhancementItemRequirements[selectedItem]?.[currentLevel]?.enhancementData?.softcap?.fs || 0;
                    softcapValues.push(softcapFS);
                    
                    // Create input element using our helper function
                    const input = createElement('input', {
                        type: 'number',
                        min: '0',
                        id: `fs-${i}`,
                        placeholder: 'Enter failstack count'
                    });
                    inputFields.push(input);
                    
                    // Create input group
                    const inputGroup = createElement('div', { 
                        className: 'input-group' 
                    }, [input]);
                    
                    // Create label
                    const label = createElement('label', {}, 
                        `Failstack for ${currentLevel} → ${targetLevel}:`
                    );
                    
                    // Create failstack div and add all elements
                    const failstackDiv = createElement('div', { 
                        className: 'failstack-input' 
                    }, [label, inputGroup]);
                    
                    failstackContainer.appendChild(failstackDiv);
                }
                
                // Add event listener to the global softcap checkbox
                globalSoftcapCheckbox.addEventListener('change', function() {
                    const isChecked = this.checked;
                    
                    // Apply to all input fields
                    for (let i = 0; i < inputFields.length; i++) {
                        if (isChecked) {
                            // Store the original value before applying softcap
                            inputFields[i].dataset.originalValue = inputFields[i].value;
                            // Set to softcap value
                            inputFields[i].value = softcapValues[i];
                            // Show softcap in placeholder while disabled
                            inputFields[i].placeholder = `Softcap: ${softcapValues[i]}`;
                            inputFields[i].disabled = true;
                        } else {
                            // Clear the value when unchecking
                            inputFields[i].value = inputFields[i].dataset.originalValue || '';
                            // Reset placeholder
                            inputFields[i].placeholder = 'Enter failstack count';
                            inputFields[i].disabled = false;
                        }
                    }
                });
                
                calculateBtn.disabled = false;
            }
        });
    }
    
    // Calculator function
    async function calculateEnchantment(item, startLevel, targetLevel, failstacks) {
        // Arrays to store results
        const successChancesArray = [];
        const expectedAttemptsArray = [];
        const costPerLevelArray = [];
        let totalAttempts = 0;
        let totalCostValue = 0;
        
        // Check if we're using cron stones
        const useCron = useCronCheckbox && useCronCheckbox.checked;
        
        // Calculate for each enhancement step
        for (let index = 0; index < failstacks.length; index++) {
            const fs = failstacks[index];
            const levels = enhancementLevels[item];
            const startIndex = levels.indexOf(startLevel);
            const currentLevel = levels[startIndex + index];
            
            // Calculate success chance using the utility function
            const successChance = calculateSuccessChance(item, currentLevel, fs);
            const failChance = 100 - successChance; // The chance of failure
            
            // Calculate expected attempts (100/success rate for percentage to attempts conversion)
            let expectedAttempts = 100 / successChance;
            
            // Get the cost for this attempt (asynchronously)
            const attemptCost = await calculateAttemptCost(
                item, 
                currentLevel, 
                useCron
            );
            
            // Calculate total cost for this enhancement level
            let levelCost = 0;
            
            if (!useCron && currentLevel !== 'BASE') {
                // When not using cron stones and item is not at BASE level,
                // each failure causes a downgrade
                // This means additional attempts and materials will be needed
                
                // The expected number of downgrades per success
                const expectedDowngrades = failChance / successChance;
                
                // For each downgrade, we need to re-enhance from the previous level
                // This creates a cascading cost effect
                if (index > 0) {
                    // Cost to re-enhance from previous level
                    const prevLevel = levels[startIndex + index - 1];
                    const reEnhanceCost = await calculateAttemptCost(item, prevLevel, useCron);
                    
                    // Calculate success chance for the previous level
                    const prevFS = failstacks[index - 1];  // Use the failstack from the previous level
                    const prevSuccessChance = calculateSuccessChance(item, prevLevel, prevFS);
                    
                    // Expected attempts needed to re-enhance from previous level
                    const prevExpectedAttempts = 100 / prevSuccessChance;
                    
                    // Total cost to re-enhance = cost per attempt × expected attempts × expected downgrades
                    const downgradeCost = reEnhanceCost * prevExpectedAttempts * expectedDowngrades;
                    levelCost = (attemptCost * expectedAttempts) + downgradeCost;
                    
                    console.log(`Including downgrade cost for ${currentLevel}: ${downgradeCost.toLocaleString()}`);
                    console.log(`  - ${expectedDowngrades.toFixed(2)} expected downgrades`);
                    console.log(`  - ${prevExpectedAttempts.toFixed(2)} attempts to re-enhance per downgrade`);
                } else {
                    // First level enhancement can't be downgraded below start level
                    levelCost = attemptCost * expectedAttempts;
                }
            } else {
                // With cron stones, no downgrades occur
                levelCost = attemptCost * expectedAttempts;
            }
            
            expectedAttemptsArray.push(expectedAttempts.toFixed(2));
            totalAttempts += expectedAttempts;
            costPerLevelArray.push(levelCost);
            totalCostValue += levelCost;
            
            // Store success chance with 3 decimal places precision
            successChancesArray.push(successChance.toFixed(3));
        }
        
        // Return the calculated results
        return {
            item: item,
            startLevel: startLevel,
            targetLevel: targetLevel,
            totalCost: Math.round(totalCostValue),
            attemptsPrediction: parseFloat(totalAttempts.toFixed(2)),
            failstackUsage: failstacks,
            successChances: successChancesArray,
            expectedAttempts: expectedAttemptsArray,
            costPerLevel: costPerLevelArray
        };
    }
    
    // Function to display calculator results
    function displayResults(results) {
        resultsDiv.innerHTML = '';
        resultsDiv.className = 'results-container show';
        
        // Format the display of BASE level
        const formattedStartLevel = formatEnhancementLevel(results.startLevel);
        const formattedTargetLevel = formatEnhancementLevel(results.targetLevel);
        
        // Create results elements using our helper function
        const resultTitle = createElement('h2', {}, 'Enchantment Results');
        
        const itemInfo = createElement('p', {}, '');
        itemInfo.innerHTML = `<strong>Item:</strong> ${results.item} (${formattedStartLevel} → ${formattedTargetLevel})`;
        
        const costInfo = createElement('p', {}, '');
        costInfo.innerHTML = `<strong>Estimated Total Cost:</strong> ${results.totalCost.toLocaleString()} Silver`;
        
        const attemptsInfo = createElement('p', {}, '');
        attemptsInfo.innerHTML = `<strong>Estimated Attempts:</strong> ${results.attemptsPrediction}`;
        
        const detailsTitle = createElement('h3', {}, 'Enhancement Details:');
        
        const detailsList = createElement('ul');
        
        // Add elements to results div
        resultsDiv.appendChild(resultTitle);
        resultsDiv.appendChild(itemInfo);
        resultsDiv.appendChild(costInfo);
        resultsDiv.appendChild(attemptsInfo);
        resultsDiv.appendChild(detailsTitle);
        
        const levels = enhancementLevels[results.item];
        const startIndex = levels.indexOf(results.startLevel);
        const targetIndex = levels.indexOf(results.targetLevel);
        
        for (let i = 0; i < targetIndex - startIndex; i++) {
            const currentLevel = levels[startIndex + i];
            const nextLevel = levels[startIndex + i + 1];
            
            // Format the display of BASE level in details
            const formattedCurrentLevel = formatEnhancementLevel(currentLevel);
            const formattedNextLevel = formatEnhancementLevel(nextLevel);
            
            // Create detail item with formatted content
            let detailContent = `<strong>${formattedCurrentLevel} → ${formattedNextLevel}:</strong> ` +
                                `Failstack: ${results.failstackUsage[i]}, ` +
                                `Success Chance: ${parseFloat(results.successChances[i]).toFixed(3)}%, ` +
                                `Expected Attempts: ${results.expectedAttempts[i]}, ` +
                                `Cost: ${Math.round(results.costPerLevel[i]).toLocaleString()} Silver`;
                                
            // Add note about downgrades if not using cron and not enhancing from BASE level
            if (!(useCronCheckbox && useCronCheckbox.checked) && currentLevel !== 'BASE') {
                detailContent += ` <span class="downgrade-info">(includes costs for potential downgrades and re-enhancements)</span>`;
            }
            
            const detailItem = createElement('li', {}, '');
            detailItem.innerHTML = detailContent;
            detailsList.appendChild(detailItem);
        }
        
        resultsDiv.appendChild(detailsList);
        
        // Add a note about calculations
        const note = document.createElement('p');
        note.className = 'note';
        
        // Different note based on whether cron stones are used
        if (useCronCheckbox && useCronCheckbox.checked) {
            note.textContent = 'Note: These calculations are based on known BDO enhancement mechanics with base chance, softcap, and hardcap thresholds.';
        } else {
            note.textContent = 'Note: These calculations include the cost of potential downgrades on failed attempts without Cron stones. Each failure can drop the item one level (except from BASE), requiring additional materials AND attempts to re-enhance from the downgraded level. Both factors are included in the cost calculation.';
        }
        
        resultsDiv.appendChild(note);
    }
    
    // Event listener for calculate button
    if (calculateBtn) {
        calculateBtn.addEventListener('click', async function() {
            // Show loading indicator
            resultsDiv.innerHTML = '<p>Calculating and fetching market data, please wait...</p>';
            resultsDiv.className = 'results-container show';
            
            // Get the selected values
            const selectedItem = itemSelect.value;
            const selectedStartLevel = startLevelSelect.value;
            const selectedTargetLevel = targetLevelSelect.value;
            
            // Get all failstack inputs
            const failstackInputs = failstackContainer.querySelectorAll('input[type="number"]');
            
            // Validate inputs
            let isValid = true;
            failstackInputs.forEach(input => {
                // Skip validation for disabled inputs (they are using softcap value)
                if (input.disabled) {
                    return;
                }
                
                if (!input.value || isNaN(parseInt(input.value))) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (!isValid) {
                alert('Please enter a valid number for all failstack fields.');
                resultsDiv.innerHTML = '';
                return;
            }
            
            // Collect failstack values
            const failstacks = Array.from(failstackInputs).map(input => parseInt(input.value));
            
            try {
                // Perform calculation (asynchronously)
                const results = await calculateEnchantment(selectedItem, selectedStartLevel, selectedTargetLevel, failstacks);
                
                // Display results
                displayResults(results);
            } catch (error) {
                console.error('Error in calculation:', error);
                resultsDiv.innerHTML = `<div class="error">Error calculating enhancement: ${error.message}. Please try again.</div>`;
            }
        });
    }
    
    // ============================================
    // Simulator Functionality
    // ============================================
    // NOTE: The simulation tab is currently hidden and will be implemented in a future update
    // The code below is preserved for when the simulation functionality is fully implemented
    
    // Event listener for simulation item selection
    if (simItemSelect) {
        simItemSelect.addEventListener('change', function() {
            const selectedItem = this.value;
            console.log('Simulation item selected:', selectedItem);
            
            // Reset dependent fields
            simTargetLevel.innerHTML = '<option value="">-- Select Level --</option>';
            simTargetLevel.disabled = true;
            simulateBtn.disabled = true;
            
            if (selectedItem) {
                // Enable and populate target level dropdown
                simTargetLevel.disabled = false;
                const levels = enhancementLevels[selectedItem];
                
                // Skip BASE level as it can't be a target
                for (let i = 1; i < levels.length; i++) {
                    const option = document.createElement('option');
                    option.value = levels[i];
                    option.textContent = levels[i];
                    simTargetLevel.appendChild(option);
                }
            }
        });
    }
    
    // Add softcap checkbox functionality to simulation tab
    if (simTargetLevel && simFailstack) {
        simTargetLevel.addEventListener('change', function() {
            const selectedItem = simItemSelect.value;
            const selectedLevel = this.value;
            
            // Remove any existing softcap container
            const existingContainer = document.getElementById('sim-softcap-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            
            // Create new softcap checkbox if applicable
            const softcapContainer = createSimSoftcapCheckbox(selectedItem, selectedLevel, simFailstack);
            
            if (softcapContainer) {
                // Insert after the failstack input
                simFailstack.parentNode.insertBefore(softcapContainer, simFailstack.nextSibling);
            }
            
            // Check inputs to enable/disable simulate button
            checkSimulationInputs();
        });
    }
    
    /**
     * Creates softcap checkbox for the simulation tab
     * @param {string} item - The selected item
     * @param {string} level - The selected level
     * @param {HTMLElement} fsInput - The failstack input element
     * @returns {HTMLElement|null} - The created container or null if no softcap
     */
    function createSimSoftcapCheckbox(item, level, fsInput) {
        // Get the current level (one before the target)
        const levels = enhancementLevels[item];
        const targetIndex = levels.indexOf(level);
        
        if (targetIndex <= 0) return null;
        
        const currentLevel = levels[targetIndex - 1];
        const softcapFS = enhancementItemRequirements[item]?.[currentLevel]?.enhancementData?.softcap?.fs || 0;
        
        if (softcapFS <= 0) return null;
        
        // Create container
        const container = createElement('div', { 
            id: 'sim-softcap-container',
            className: 'softcap-container' 
        });
        
        // Create checkbox
        const checkbox = createElement('input', {
            type: 'checkbox',
            id: 'sim-softcap-checkbox',
            className: 'softcap-checkbox',
            title: `Use softcap value: ${softcapFS}`
        });
        
        // Create label
        const label = createElement('label', {
            for: 'sim-softcap-checkbox'
        }, 'Use Softcap');
        
        // Create info text
        const info = createElement('small', {
            className: 'softcap-info'
        }, `(${softcapFS})`);
        
        // Add event listener
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                fsInput.value = softcapFS;
                fsInput.disabled = true;
            } else {
                fsInput.disabled = false;
            }
            // Trigger input event to update simulation button state
            const event = new Event('input', { bubbles: true });
            fsInput.dispatchEvent(event);
        });
        
        // Append elements
        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(info);
        
        return container;
    }

    /**
     * Enable simulate button when all required fields are filled
     */
    function checkSimulationInputs() {
        const itemSelected = simItemSelect.value !== '';
        const targetSelected = simTargetLevel.value !== '';
        const failstackEntered = simFailstack.value !== '' && !isNaN(parseInt(simFailstack.value));
        const attemptsEntered = simAttempts.value !== '' && 
                               !isNaN(parseInt(simAttempts.value)) && 
                               parseInt(simAttempts.value) > 0;
        
        const isEnabled = itemSelected && targetSelected && failstackEntered && attemptsEntered;
        simulateBtn.disabled = !isEnabled;
    }
    
    // Add event listeners to check simulation inputs
    if (simItemSelect) simItemSelect.addEventListener('change', checkSimulationInputs);
    if (simTargetLevel) simTargetLevel.addEventListener('change', checkSimulationInputs);
    if (simFailstack) simFailstack.addEventListener('input', checkSimulationInputs);
    if (simAttempts) simAttempts.addEventListener('input', checkSimulationInputs);
    
    // Simulation function
    async function runSimulation(item, startLevel, targetLevel, startingFS, attempts, useCron, addFSAfterFail) {
        // Results to track
        const results = {
            item: item,
            startLevel: startLevel,
            targetLevel: targetLevel,
            attempts: attempts,
            successes: 0,
            failures: 0,
            totalCost: 0,
            attemptLog: []
        };
        
        // Run the simulation for the specified number of attempts
        let currentFS = startingFS;
        
        // Get the item cost once to use for all attempts (to avoid too many API calls)
        const baseAttemptCost = await calculateAttemptCost(item, startLevel, useCron);
        
        for (let i = 0; i < attempts; i++) {
            // Calculate success chance using the utility function
            const successChance = calculateSuccessChance(item, startLevel, currentFS);
            
            // Use the pre-calculated cost
            const totalAttemptCost = baseAttemptCost;
            results.totalCost += totalAttemptCost;
            
            // Simulate the enhancement attempt (random roll)
            const roll = Math.random() * 100;
            const success = roll < successChance;
            
            // Record the result
            if (success) {
                results.successes++;
                results.attemptLog.push({
                    attempt: i + 1,
                    failstack: currentFS,
                    successChance: successChance.toFixed(3),
                    result: 'SUCCESS',
                    cost: totalAttemptCost
                });
                
                // Reset failstack after successful attempt to simulate starting a new enhancement
                currentFS = startingFS;
            } else {
                results.failures++;
                results.attemptLog.push({
                    attempt: i + 1,
                    failstack: currentFS,
                    successChance: successChance.toFixed(3),
                    result: 'FAIL',
                    cost: totalAttemptCost
                });
                
                // Increase failstack if option is enabled
                if (addFSAfterFail) {
                    currentFS += 1;
                }
            }
        }
        
        return results;
    }
    
    /**
     * Displays simulation results in the simulation results div
     * @param {Object} results - The simulation results object
     */
    function displaySimulationResults(results) {
        console.log('Displaying simulation results:', results);
        simResultsDiv.innerHTML = '';
        simResultsDiv.className = 'results-container show';
        
        // Format enhancement levels
        const formattedStartLevel = formatEnhancementLevel(results.startLevel);
        const formattedTargetLevel = formatEnhancementLevel(results.targetLevel);
        const successRate = (results.successes / results.attempts * 100).toFixed(2);
        
        // Create and append elements
        const elements = [
            createElement('h2', {}, 'Simulation Results'),
            
            createElement('p', {}, ''),
            
            createElement('p', {}, ''),
            
            createElement('p', {}, '')
        ];
        
        // Set HTML content for elements that need it
        elements[1].innerHTML = `<strong>Item:</strong> ${results.item} (${formattedStartLevel} → ${formattedTargetLevel})`;
        elements[2].innerHTML = `<strong>Success Rate:</strong> ${successRate}% (${results.successes} successes out of ${results.attempts} attempts)`;
        elements[3].innerHTML = `<strong>Total Cost:</strong> ${results.totalCost.toLocaleString()} Silver`;
        
        // Add all elements to the results div
        elements.forEach(element => simResultsDiv.appendChild(element));
        
        // Create attempt log table
        const logTitle = document.createElement('h3');
        logTitle.textContent = 'Attempt Log';
        simResultsDiv.appendChild(logTitle);
        
        const logContainer = document.createElement('div');
        logContainer.className = 'simulation-results';
        
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Attempt', 'Failstack', 'Success Chance', 'Result', 'Cost'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            th.style.borderBottom = '1px solid #444';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create body rows
        const tbody = document.createElement('tbody');
        results.attemptLog.forEach(log => {
            const row = document.createElement('tr');
            
            const attemptCell = document.createElement('td');
            attemptCell.textContent = log.attempt;
            attemptCell.style.padding = '8px';
            attemptCell.style.borderBottom = '1px solid #333';
            
            const fsCell = document.createElement('td');
            fsCell.textContent = log.failstack;
            fsCell.style.padding = '8px';
            fsCell.style.borderBottom = '1px solid #333';
            
            const chanceCell = document.createElement('td');
            chanceCell.textContent = `${log.successChance}%`;
            chanceCell.style.padding = '8px';
            chanceCell.style.borderBottom = '1px solid #333';
            
            const resultCell = document.createElement('td');
            resultCell.textContent = log.result;
            resultCell.style.padding = '8px';
            resultCell.style.borderBottom = '1px solid #333';
            resultCell.style.color = log.result === 'SUCCESS' ? '#4CAF50' : '#F44336';
            resultCell.style.fontWeight = 'bold';
            
            const costCell = document.createElement('td');
            costCell.textContent = log.cost.toLocaleString() + ' Silver';
            costCell.style.padding = '8px';
            costCell.style.borderBottom = '1px solid #333';
            
            row.appendChild(attemptCell);
            row.appendChild(fsCell);
            row.appendChild(chanceCell);
            row.appendChild(resultCell);
            row.appendChild(costCell);
            
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        logContainer.appendChild(table);
        simResultsDiv.appendChild(logContainer);
    }
    
    // Event listener for simulate button
    if (simulateBtn) {
        simulateBtn.addEventListener('click', async function() {
            console.log('Simulate button clicked');
            
            // Show loading indicator
            simResultsDiv.innerHTML = '<p>Running simulation and fetching market data, please wait...</p>';
            simResultsDiv.className = 'results-container show';
            
            const item = simItemSelect.value;
            const targetLevel = simTargetLevel.value;
            const startingFS = parseInt(simFailstack.value);
            const attempts = parseInt(simAttempts.value);
            const useCron = simUseCron.checked;
            const addFSAfterFail = simAddFS.checked;
            
            console.log('Simulation params:', {
                item, targetLevel, startingFS, attempts, useCron, addFSAfterFail
            });
            
            // Get the previous level based on the target level
            const levels = enhancementLevels[item];
            const targetIndex = levels.indexOf(targetLevel);
            const startLevel = levels[targetIndex - 1];
            console.log('Start level:', startLevel);
            
            // Run the simulation and display results
            try {
                console.log('Running simulation with params:', {
                    item, startLevel, targetLevel, startingFS, attempts, useCron, addFSAfterFail
                });
                const simulationResults = await runSimulation(item, startLevel, targetLevel, startingFS, attempts, useCron, addFSAfterFail);
                console.log('Simulation completed:', simulationResults);
                displaySimulationResults(simulationResults);
            } catch (error) {
                console.error('Error in simulation:', error);
                // Display error to user
                simResultsDiv.innerHTML = `<div class="error">Error running simulation: ${error.message}</div>`;
                simResultsDiv.className = 'results-container show';
            }
        });
    }
    
    // Note: Simulation tab is currently hidden and will be implemented in a future update
    // When ready to re-enable, remove the display:none style from:
    // 1. The tab element (.tab[data-tab="simulation"])
    // 2. The content element (#simulation-tab)
    // 3. The region switch container (.sim-region-switch)
});
