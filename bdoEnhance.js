/**
 * BDO Enhancement Calculator - Simplified version with direct DOM manipulation
 * This version provides a clean, optimized interface for BDO enhancement calculations
 */

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', async function() {
    console.log('BDO Enhancement Calculator initializing...');
    
    // Fetch all prices when the application starts
    fetchAllPricesOnStartup();
    
    // Create the failstack info element that will explain the automatic failstack increment with cron stones
    const simFailstackContainer = document.getElementById('sim-failstack-container');
    if (simFailstackContainer) {
        const fsInfoElement = document.createElement('small');
        fsInfoElement.id = 'sim-fs-info';
        fsInfoElement.style.display = 'none';
        fsInfoElement.style.marginTop = '5px';
        fsInfoElement.style.fontStyle = 'italic';
        simFailstackContainer.appendChild(fsInfoElement);
        
        // The "Add FS After Failed Attempt" checkbox has been removed as this functionality
        // is now automatically handled when using cron stones
    }
    
    // Get simulation tab and related elements
    const simulationTab = document.querySelector('.tab[data-tab="simulation"]');
    const simulationContent = document.getElementById('simulation-tab');
    const simRegionContainer = document.querySelector('.sim-region');
    
    // Make sure simulation tab is visible
    if (simulationTab) {
        console.log('Simulation tab is now available');
    }
    
    // Make sure simulation region switcher is visible (if it exists)
    if (simRegionContainer) {
        simRegionContainer.style.display = 'flex';
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
    const useCostumeCronCheckbox = document.getElementById('use-costume-cron');
    const useMemFragsCheckbox = document.getElementById('use-mem-frags');
    
    // Get simulation tab elements
    const simItemSelect = document.getElementById('sim-item-select');
    const simTargetLevel = document.getElementById('sim-target-level');
    const simFailstack = document.getElementById('sim-failstack');
    const simAttempts = document.getElementById('sim-attempts');
    const simUseCron = document.getElementById('sim-use-cron');
    const simUseCostumeCron = document.getElementById('sim-use-costume-cron');
    const simulateBtn = document.getElementById('simulate-btn');
    const simResultsDiv = document.getElementById('sim-results');
    const simUseRecommendedFS = document.getElementById('sim-use-recommended-fs');
    const simUseMemFrags = document.getElementById('sim-use-mem-frags');
    
    // Get tab navigation elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Get region switch elements
    const regionEU = document.getElementById('region-eu');
    const regionNA = document.getElementById('region-na');
    const simRegionEU = document.getElementById('sim-region-eu');
    const simRegionNA = document.getElementById('sim-region-na');
    
    // Add event listeners to make cron checkboxes mutually exclusive
    if (useCronCheckbox) {
        useCronCheckbox.addEventListener('change', function() {
            if (this.checked && useCostumeCronCheckbox) {
                useCostumeCronCheckbox.checked = false;
            }
        });
    }
    
    if (useCostumeCronCheckbox) {
        useCostumeCronCheckbox.addEventListener('change', function() {
            if (this.checked && useCronCheckbox) {
                useCronCheckbox.checked = false;
            }
        });
    }
    
    // Same for simulation tab
    // Helper function to update the Failstack info message
    function updateFailstackInfo() {
        const fsInfoElement = document.getElementById('sim-fs-info');
        if (!fsInfoElement) return;
        
        const useCron = (simUseCron && simUseCron.checked) || (simUseCostumeCron && simUseCostumeCron.checked);
        
        if (useCron) {
            fsInfoElement.textContent = "Failstack will automatically increase by +1 after each failed attempt when using Cron Stones";
            fsInfoElement.style.color = "#2ecc71"; // Green color
            fsInfoElement.style.display = "block";
        } else {
            fsInfoElement.style.display = "none";
        }
    }
    
    if (simUseCron) {
        simUseCron.addEventListener('change', function() {
            if (this.checked && simUseCostumeCron) {
                simUseCostumeCron.checked = false;
            }
            updateFailstackInfo();
        });
    }
    
    if (simUseCostumeCron) {
        simUseCostumeCron.addEventListener('change', function() {
            if (this.checked && simUseCron) {
                simUseCron.checked = false;
            }
            updateFailstackInfo();
        });
    }
    
    // Call updateFailstackInfo after a short delay to ensure all DOM elements are properly initialized
    setTimeout(updateFailstackInfo, 100);
    
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
    
    // Initialize Cron Stone checkbox based on default region (easter egg)
    if (currentRegion === 'EU' && useCronCheckbox && useCostumeCronCheckbox) {
        useCronCheckbox.checked = true;
        useCostumeCronCheckbox.checked = false;
    } else if (currentRegion === 'NA' && useCronCheckbox && useCostumeCronCheckbox) {
        useCronCheckbox.checked = false;
        useCostumeCronCheckbox.checked = true;
    }
    
    console.log('BDO Enhancement Calculator initialized');
    
    // Enhancement item requirements structure mapping items to their required enhancement materials
    // This structure maps each enhanceable item to all the data needed for enhancements
    // Format: { 
    //   itemName: { 
    //     durabilityLoss: number,                   // Durability loss on failure for this item (moved to item level)
    //     memFragPerDurability: number,              // How many durability points each memory fragment restores (e.g., 1 for most items, 2 for boss gear)
    //     currentLevel: { 
    //       materials: [{itemId: id, count: count}],  // Materials needed to go from currentLevel to next level
    //       cronStones: count,                        // Cron stones needed for this enhancement
    //       enhancementData: {                        // Data for calculating enhancement success chances
    //         baseChance: number,                     // Base success chance percentage at 0 failstacks
    //       }
    //     } 
    //   }
    // }
    const enhancementItemRequirements = {
        'Kharazad': {
            durabilityLoss: 20,                          // Durability loss on failure for all Kharazad enhancements
            memFragPerDurability: 1,                     // Each memory fragment restores 1 durability point
            'BASE': { 
                materials: [{ itemId: 820979, count: 1 }],    // Essence of Dawn x1 for BASE->I
                cronStones: 0,                               // No cron stones needed for BASE->I
                enhancementData: {
                    baseChance: 16.300,
                    recommendedFS: 38
                }
            },
            'I': { 
                materials: [{ itemId: 820979, count: 2 }],    // Essence of Dawn x2 for I->II
                cronStones: 120,                              // 120 cron stones for I->II
                enhancementData: {
                    baseChance: 7.300,
                    recommendedFS: 66
                }
            },
            'II': { 
                materials: [{ itemId: 820979, count: 3 }],    // Essence of Dawn x3 for II->III
                cronStones: 280,                              // 280 cron stones for II->III
                enhancementData: {
                    baseChance: 4.570,
                    recommendedFS: 96
                }
            },
            'III': { 
                materials: [{ itemId: 820979, count: 4 }],    // Essence of Dawn x4 for III->IV
                cronStones: 540,                              // 540 cron stones for III->IV
                enhancementData: {
                    baseChance: 2.890,
                    recommendedFS: 142
                }
            },
            'IV': { 
                materials: [{ itemId: 820979, count: 6 }],    // Essence of Dawn x6 for IV->V
                cronStones: 840,                             // 840 cron stones for IV->V
                enhancementData: {
                    baseChance: 1.910,
                    recommendedFS: 161
                }
            },
            'V': { 
                materials: [{ itemId: 820979, count: 8 }],    // Essence of Dawn x8 for V->VI
                cronStones: 1090,                             // 1090 cron stones for V->VI
                enhancementData: {
                    baseChance: 1.290,
                    recommendedFS: 191
                }
            },
            'VI': { 
                materials: [{ itemId: 820979, count: 10 }],   // Essence of Dawn x10 for VI->VII
                cronStones: 1480,                             // 1480 cron stones for VI->VII
                enhancementData: {
                    baseChance: 0.880,
                    recommendedFS: 225
                }
            },
            'VII': { 
                materials: [{ itemId: 820979, count: 12 }],   // Essence of Dawn x12 for VII->VIII
                cronStones: 1880,                             // 1880 cron stones for VII->VIII
                enhancementData: {
                    baseChance: 0.570,
                    recommendedFS: 272
                }
            },
            'VIII': { 
                materials: [{ itemId: 820979, count: 15 }],   // Essence of Dawn x15 for VIII->IX
                cronStones: 2850,                             // 2850 cron stones for VIII->IX
                enhancementData: {
                    baseChance: 0.320,
                    recommendedFS: 314
                }
            },
            'IX': { 
                materials: [{ itemId: 820984, count: 1 }],    // DAWN x1 for IX->X
                cronStones: 3650,                             // 3650 cron stones for IX->X
                enhancementData: {
                    baseChance: 0.172,
                    recommendedFS: 316
                }
            },
            // X is the max level, no more enhancements
        },
        'Sovereign': {
            durabilityLoss: 20,                          // Durability loss on failure for all Sovereign enhancements
            memFragPerDurability: 1,                     // Each memory fragment restores 1 durability point
            'BASE': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for BASE->I
                cronStones: 0,                               // No cron stones needed for BASE->I
                enhancementData: {
                    baseChance: 8.550,
                    recommendedFS: 48
                }
            },
            'I': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for I->II
                cronStones: 320,                               // 320 cron stones for I->II
                enhancementData: {
                    baseChance: 4.120,
                    recommendedFS: 66
                }
            },
            'II': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for II->III
                cronStones: 560,                              // 560 cron stones for II->III
                enhancementData: {
                    baseChance: 2.000,
                    recommendedFS: 106
                }
            },
            'III': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for III->IV
                cronStones: 780,                              // 780 cron stones for III->IV
                enhancementData: {
                    baseChance: 0.910,
                    recommendedFS: 191
                }
            },
            'IV': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for IV->V
                cronStones: 970,                              // 970 cron stones for IV->V
                enhancementData: {
                    baseChance: 0.469,
                    recommendedFS: 234
                }
            },
            'V': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for V->VI
                cronStones: 1350,                             // 1350 cron stones for V->VI
                enhancementData: {
                    baseChance: 0.273,
                    recommendedFS: 290
                }
            },
            'VI': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for VI->VII
                cronStones: 1550,                             // 1550 cron stones for VI->VII
                enhancementData: {
                    baseChance: 0.160,
                    recommendedFS: 314
                }
            },
            'VII': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for VII->VIII
                cronStones: 2250,                             // 2250 cron stones for VII->VIII
                enhancementData: {
                    baseChance: 0.107,
                    recommendedFS: 316
                }
            },
            'VIII': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for VIII->IX
                cronStones: 2760,                             // 2760 cron stones for VIII->IX
                enhancementData: {
                    baseChance: 0.049,
                    recommendedFS: 346
                }
            },
            'IX': { 
                materials: [{ itemId: 820934, count: 1 }],    // Primordial Black Stone x1 for IX->X
                cronStones: 3920,                             // 3920 cron stones for IX->X
                enhancementData: {
                    baseChance: 0.024,
                    recommendedFS: 346
                }
            },
            // X is the max level, no more enhancements
        },
        'Fallen God\'s Armor': {
            durabilityLoss: 30,                          // Durability loss on failure for all Fallen God's Armor enhancements
            memFragPerDurability: 1,                     // Each memory fragment restores 1 durability point
            'BASE': { 
                materials: [
                    { itemId: 721003, count: 10 },        // Caphras Stone x10
                    { itemId: 4998, count: 1 },           // Sharp Black Crystal Shard x1
                    { itemId: 752023, count: 1 }          // Mass of Pure Magic x1
                ],  
                cronStones: 0,                               // No cron stones needed for BASE->I
                enhancementData: {
                    baseChance: 2.000,
                    recommendedFS: 76
                }
            },
            'I': { 
                materials: [
                    { itemId: 721003, count: 10 },        // Caphras Stone x10
                    { itemId: 4998, count: 1 },           // Sharp Black Crystal Shard x1
                    { itemId: 752023, count: 1 }          // Mass of Pure Magic x1
                ],    
                cronStones: 1500,                             // 1500 cron stones for I->II
                enhancementData: {
                    baseChance: 1.000,
                    recommendedFS: 142
                }
            },
            'II': { 
                materials: [
                    { itemId: 721003, count: 10 },        // Caphras Stone x10
                    { itemId: 4998, count: 1 },           // Sharp Black Crystal Shard x1
                    { itemId: 752023, count: 1 }          // Mass of Pure Magic x1
                ],    
                cronStones: 2100,                             // 1800 cron stones for II->III
                enhancementData: {
                    baseChance: 0.500,
                    recommendedFS: 272
                }
            },
            'III': { 
                materials: [
                    { itemId: 721003, count: 10 },        // Caphras Stone x10
                    { itemId: 4998, count: 1 },           // Sharp Black Crystal Shard x1
                    { itemId: 752023, count: 1 }          // Mass of Pure Magic x1
                ],   
                cronStones: 2700,                             // 2500 cron stones for III->IV
                enhancementData: {
                    baseChance: 0.200,
                    recommendedFS: 314
                }
            },
            'IV': { 
                materials: [
                    { itemId: 721003, count: 10 },        // Caphras Stone x10
                    { itemId: 4998, count: 1 },           // Sharp Black Crystal Shard x1
                    { itemId: 752023, count: 1 }          // Mass of Pure Magic x1
                ],    
                cronStones: 4000,                             // 3200 cron stones for IV->V
                enhancementData: {
                    baseChance: 0.0025,
                    recommendedFS: 346
                }
            }
            // V is the max level, no more enhancements
        }
    };
    
    // Item name mapping for better display
    const itemNames = {
        820979: "Essence of Dawn",
        820984: "DAWN",
        820934: "Primordial Black Stone",
        721003: "Caphras Stone",
        44195: "Memory Fragment",
        4998: "Sharp Black Crystal Shard",
        752023: "Mass of Pure Magic"
    };
    
    // Cache control to reduce network requests
    const priceCache = {
        lastFetch: 0, // Timestamp of last fetch
        cacheDuration: 30 * 60 * 1000, // 30 minutes in milliseconds
    };
    
    // Market prices with built-in defaults
    // This will be used both as a cache for fetched prices and as fallback values
    const marketPrices = {
        'EU': {
            // Essence of Dawn
            820979: 100000000, // 83 million silver based on example
            // DAWN (special item that won't be fetched from the market)
            820984: 30000000, // 30 million silver fixed price
            // Primordial Black Stone
            820934: 50000000, // 50 million silver based on provided default
            // Caphras Stone
            721003: 3000000, // 3 million silver based on estimated value
            // Memory Fragment
            44195: 5000000, // 5 million silver based on provided default
            // Sharp Black Crystal Shard
            4998: 5000000, // 5 million silver based on estimated value
            // Mass of Pure Magic
            752023: 500000 // 500 thousand silver based on estimated value
        },
        'NA': {
            // Essence of Dawn with a small price variation for NA
            820979: 100000000,
            // DAWN (special item that won't be fetched from the market)
            820984: 30000000, // 30 million silver fixed price
            // Primordial Black Stone
            820934: 50000000, // 50 million silver based on provided default
            // Caphras Stone
            721003: 3000000, // 3 million silver based on estimated value
            // Memory Fragment
            44195: 5000000, // 5 million silver based on provided default
            // Sharp Black Crystal Shard
            4998: 5000000, // 5 million silver based on estimated value
            // Mass of Pure Magic
            752023: 500000 // 500 thousand silver based on estimated value
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
        const defaultData = {
            baseChance: 2,
            recommendedFS: 50
        };
        const itemData = enhancementItemRequirements[item] || {};
        const levelData = (itemData[level] && itemData[level].enhancementData) || defaultData;
        const baseRate = levelData.baseChance;
        const successChance = Math.min(baseRate + (failstack * baseRate / 10), 90);
        
        return successChance;
    }
    
    /**
     * Calculates the exact average number of attempts needed with dynamic failstack increments
     * @param {number} baseRate - The base success rate percentage
     * @param {number} initialFailstack - The starting failstack value
     * @returns {number} - The exact average number of attempts needed
     */
    function calculateExactAverageAttempts(baseRate, initialFailstack) {
        if (baseRate === 0) return 0;

        const MAX_ATTEMPTS = 100000;
        let limit = MAX_ATTEMPTS;

        // E[a]: expected attempts if we've already tried "a" times (so, current attempt = a+1)
        // failstack increases by a
        const E = new Array(limit + 2).fill(0);

        // If we reach pity cap, succeed on next attempt
        E[limit] = 1;

        for (let a = limit - 1; a >= 0; a--) {
            // failstack increases with every attempt
            const fs = initialFailstack + a;
            const P = Math.min(baseRate + (fs * baseRate / 10), 100) / 100;
            if (P >= 1) {
                E[a] = 1;
            } else {
                E[a] = 1 + (1 - P) * E[a + 1];
            }
        }

        return E[0];
    }
    
    /**
     * Calculates the cost of a single attempt
     * @param {string} item - The item being enhanced
     * @param {string} level - The current level
     * @param {boolean} useCron - Whether to use cron stones
     * @param {boolean} useMemFrags - Whether to include memory fragment costs
     * @returns {Promise<number>} - The cost of the attempt
     */
    /**
     * Calculates the cost of a single enhancement attempt
     * @param {string} item - The item being enhanced
     * @param {string} level - The current level
     * @param {boolean} useCron - Whether to use cron stones
     * @param {boolean} useMemFrags - Whether to include memory fragment costs
     * @returns {Promise<Object>} - The total cost and details of the attempt
     */
    async function calculateAttemptCost(item, level, useCron, useMemFrags, isUsingCostumeCron = null) {
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
            let cronPrice;
            
            // If isUsingCostumeCron is explicitly provided (from runSimulation), use that value
            if (isUsingCostumeCron !== null) {
                cronPrice = isUsingCostumeCron ? 2185297 : 3000000; // Use specified cron stone type
            } else {
                // Otherwise determine based on UI state
                // Check which mode is active (main calculator or simulation)
                const isSimulation = document.querySelector('.tab-content:not(.hidden)').id === 'simulation-tab';
                
                if ((isSimulation && simUseCostumeCron && simUseCostumeCron.checked) || 
                    (!isSimulation && useCostumeCronCheckbox && useCostumeCronCheckbox.checked)) {
                    cronPrice = 2185297; // Costume Cron Stone price
                } else {
                    cronPrice = 3000000; // Vendor Cron Stone price
                }
            }
            
            cronCost = cronCount * cronPrice;
            console.log(`Adding cron cost: ${cronCount} crons at ${cronPrice.toLocaleString()} each = ${cronCost.toLocaleString()}`);
        }
        
        // Calculate memory fragments cost for durability repair on failure
        let memFragsCost = 0;
        let memFragsCount = 0;
        if (useMemFrags && requirements) {
           
            const durabilityLoss = enhancementItemRequirements[item]?.durabilityLoss || 0;
            const memFragPerDurability = enhancementItemRequirements[item]?.memFragPerDurability || 1;
            memFragsCount = Math.ceil(durabilityLoss / memFragPerDurability);
            
            try {
                const memFragPrice = await fetchItemPrice(currentRegion, 44195); // Memory Fragment ID
                memFragsCost = memFragPrice * memFragsCount;
                console.log(`Adding memory fragment cost: ${memFragsCount} frags at ${memFragPrice.toLocaleString()} each = ${memFragsCost.toLocaleString()}`);
            } catch (error) {
                console.error(`Error fetching price for memory fragments:`, error);
                const defaultPrice = marketPrices[currentRegion][44195] || 0;
                memFragsCost = defaultPrice * memFragsCount;
            }
        }
        
        // Total cost for this attempt 
        const totalCost = materialsCost + cronCost + memFragsCost;
        console.log(`Total attempt cost for ${item} ${level}: ${totalCost.toLocaleString()} (materials: ${materialsCost.toLocaleString()}, cron: ${cronCost.toLocaleString()}, memory frags: ${memFragsCost.toLocaleString()})`);
        
        // Return cost details
        return {
            totalCost,
            materialsCost,
            cronCost,
            memFragsCost,
            memFragsCount,
            durabilityLoss: enhancementItemRequirements[item]?.durabilityLoss || 0,
            memFragPerDurability: enhancementItemRequirements[item]?.memFragPerDurability || 1
        };
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
            // First check if we already have this price in our cache
            if (marketPrices[region]?.[itemId]) {
                // If cache is still fresh (less than cacheDuration), use cached value
                const currentTime = Date.now();
                if (currentTime - priceCache.lastFetch < priceCache.cacheDuration) {
                    console.log(`Using cached price for item ${itemId} in ${region}: ${marketPrices[region][itemId]}`);
                    return marketPrices[region][itemId];
                }
            }
            
            // Cache expired or price not found, try to fetch fresh data
            try {
                const regionLower = region.toLowerCase();
                const jsonUrl = `https://jackdaniels2507.github.io/bdo-calculator/bdo-prices-${regionLower}.json`;
                
                console.log(`Fetching latest price from ${jsonUrl} for item ${itemId}`);
                
                const response = await fetch(jsonUrl);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch prices: ${response.status} ${response.statusText}`);
                }
                
                const pricesData = await response.json();
                
                // Update cache timestamp when we successfully fetch data
                priceCache.lastFetch = Date.now();
                
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
        
        // Easter egg: Auto-select Vendor Cron Stone for EU
        if (useCronCheckbox && useCostumeCronCheckbox) {
            useCronCheckbox.checked = true;
            useCostumeCronCheckbox.checked = false;
        }
        
        // Same for simulation tab
        if (simUseCron && simUseCostumeCron) {
            simUseCron.checked = true;
            simUseCostumeCron.checked = false;
        }
        
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
        
        // Easter egg: Auto-select Costume Cron Stone for NA
        if (useCronCheckbox && useCostumeCronCheckbox) {
            useCronCheckbox.checked = false;
            useCostumeCronCheckbox.checked = true;
        }
        
        // Same for simulation tab
        if (simUseCron && simUseCostumeCron) {
            simUseCron.checked = false;
            simUseCostumeCron.checked = true;
        }
        
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
                }, 'Use recommended FS by BairogHaan');
                
                const globalSoftcapContainer = createElement('div', { 
                    className: 'global-softcap-container' 
                }, [globalSoftcapCheckbox, globalSoftcapLabel]);
                
                // Store input references and recommended FS values for each field
                const inputFields = [];
                const recommendedFSValues = [];
                
                // Add the global softcap elements to the container
                globalSoftcapContainer.appendChild(globalSoftcapCheckbox);
                globalSoftcapContainer.appendChild(globalSoftcapLabel);
                failstackContainer.appendChild(globalSoftcapContainer);
                
                // Generate failstack input fields
                for (let i = 0; i < enhancementCount; i++) {
                    const currentLevel = levels[startIndex + i];
                    const targetLevel = levels[startIndex + i + 1];
                    
                    // Get the recommended failstack value for this enhancement level if available
                    const recommendedFS = enhancementItemRequirements[selectedItem]?.[currentLevel]?.enhancementData?.recommendedFS || 0;
                    recommendedFSValues.push(recommendedFS);
                    
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
                
                // Add event listener to the recommended FS checkbox
                globalSoftcapCheckbox.addEventListener('change', function() {
                    const isChecked = this.checked;
                    
                    // Apply to all input fields
                    for (let i = 0; i < inputFields.length; i++) {
                        if (isChecked) {
                            // Store the original value before applying recommended FS
                            inputFields[i].dataset.originalValue = inputFields[i].value;
                            // Set to recommended FS value
                            inputFields[i].value = recommendedFSValues[i];
                            // Show recommended FS in placeholder
                            inputFields[i].placeholder = `Recommended FS: ${recommendedFSValues[i]}`;
                            // Keep the field enabled for modification
                        } else {
                            // Clear the value when unchecking
                            inputFields[i].value = inputFields[i].dataset.originalValue || '';
                            // Reset placeholder
                            inputFields[i].placeholder = 'Enter failstack count';
                        }
                    }
                });
                
                calculateBtn.disabled = false;
            }
        });
    }
    
    // Calculator function
    async function calculateEnhancement(item, startLevel, targetLevel, failstacks) {
        // Store original failstack values before any modifications
        const originalFailstacks = [...failstacks];
        
        // Arrays to store results
        const successChancesArray = [];
        const expectedAttemptsArray = [];
        const costPerLevelArray = [];
        const materialsCostArray = [];
        const memFragsCostArray = [];
        const memFragsCountArray = [];
        const cronCostArray = [];
        const cronStoneCountArray = [];
        let totalAttempts = 0;
        let totalCostValue = 0;
        let totalMemFragsCost = 0;
        let totalMemFragsCount = 0;
        let totalCronCost = 0;
        let totalCronCount = 0;
        
        // Check if we're using cron stones and memory fragments
        const useCron = (useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked);
        const useMemFrags = useMemFragsCheckbox && useMemFragsCheckbox.checked;
        
        // Arrays to track which levels use cron stones
        const useCronPerLevelArray = [];
        
        // Calculate for each enhancement step
        for (let index = 0; index < failstacks.length; index++) {
            const fs = failstacks[index];
            const levels = enhancementLevels[item];
            const startIndex = levels.indexOf(startLevel);
            const currentLevel = levels[startIndex + index];
            
            // Determine if we should use cron stones for this specific level
            // If not using cron globally, still use cron for the first level to prevent downgrade below starting level
            const useCronForThisLevel = useCron || (index === 0 && currentLevel !== 'BASE');
            useCronPerLevelArray.push(useCronForThisLevel);
            
            // Calculate success chance using the utility function
            const successChance = calculateSuccessChance(item, currentLevel, fs);
            const failChance = 100 - successChance; // The chance of failure
            
            // Get the base chance for this item level to calculate exact attempts when using cron stones
            const baseChance = enhancementItemRequirements[item]?.[currentLevel]?.enhancementData?.baseChance || 0;
            
            // Calculate expected attempts
            let expectedAttempts = 0;
            let rawAttempts = 100 / successChance; // Standard attempt calculation
            
            // Use exact calculation when cron stones are selected
            if (useCronForThisLevel) {
                // Calculate exact average attempts with dynamic failstack increments
                expectedAttempts = calculateExactAverageAttempts(baseChance, fs);
                console.log(`Level ${currentLevel}: Using exact calculation with base rate ${baseChance} and initial FS ${fs}, result: ${expectedAttempts.toFixed(2)} attempts`);
            } else {
                // Use standard calculation when not using cron stones
                expectedAttempts = rawAttempts;
            }
            
            // Get the cost for this attempt (asynchronously) - use cron based on per-level decision
            const costDetails = await calculateAttemptCost(
                item, 
                currentLevel, 
                useCronForThisLevel,
                useMemFrags
            );
            
            // Calculate total cost for this enhancement level
            let levelCost = 0;
            let levelMemFragsCost = 0;
            let levelMemFragsCount = 0;
            
            if (!useCronForThisLevel && currentLevel !== 'BASE') {
                // When not using cron stones and item is not at BASE level,
                // each failure causes a downgrade
                // This means additional attempts and materials will be needed
                
                // The expected number of downgrades per success
                const expectedDowngrades = failChance / successChance;
                
                // We need to calculate the full cost of bringing an item back up after downgrade
                if (index > 0) {
                    // Cost of the current level attempts
                    const currentLevelAttemptCost = costDetails.totalCost * expectedAttempts;
                    
                    // Calculate the complete cost to recover from a downgrade
                    // This includes all the costs of re-enhancing from all previous levels
                    let downgradeCost = 0;
                    let downgradedMemFragsCost = 0;
                    let downgradedMemFragsCount = 0;
                    
                    // If we fail and downgrade to the previous level, we need to calculate
                    // the cost of getting back to the current level
                    let recoveryCostMultiplier = expectedDowngrades; // How many times we expect to recover
                    
                    // Build an array of all previous levels that need re-enhancement
                    const previousLevels = [];
                    for (let prevIdx = 0; prevIdx < index; prevIdx++) {
                        const lvl = levels[startIndex + prevIdx];
                        const fs = failstacks[prevIdx];
                        previousLevels.push({ level: lvl, failstack: fs });
                    }
                    
                    // Calculate costs for each level we need to recover through
                    for (let prevIdx = previousLevels.length - 1; prevIdx >= 0; prevIdx--) {
                        const prevLevel = previousLevels[prevIdx].level;
                        const prevFS = previousLevels[prevIdx].failstack;
                        
                        // Determine if we should use cron for this recovery level
                        // If it's the very first level (to prevent downgrade below starting level), use cron
                        const useCronForRecovery = useCron || (prevIdx === 0 && prevLevel !== 'BASE');
                        
                        // Get cost of one attempt at this level - using the same cron stone logic
                        const levelCostDetails = await calculateAttemptCost(item, prevLevel, useCronForRecovery, useMemFrags);
                        
                        // Calculate success rate for this level
                        const levelSuccessChance = calculateSuccessChance(item, prevLevel, prevFS);
                        const levelExpectedAttempts = 100 / levelSuccessChance;
                        
                        // Total cost at this level considering how many times we need to go through it
                        const levelTotalCost = levelCostDetails.totalCost * levelExpectedAttempts * recoveryCostMultiplier;
                        downgradeCost += levelTotalCost;
                        
                        // If we're calculating memory fragment costs
                        if (useMemFrags) {
                            const levelMemCost = levelCostDetails.memFragsCost * levelExpectedAttempts * recoveryCostMultiplier;
                            const levelMemCount = levelCostDetails.memFragsCount * levelExpectedAttempts * recoveryCostMultiplier;
                            downgradedMemFragsCost += levelMemCost;
                            downgradedMemFragsCount += levelMemCount;
                        }
                        
                        // Track cron stone usage in recovery attempts
                        if (useCronForRecovery) {
                            const cronStoneCount = enhancementItemRequirements[item]?.[prevLevel]?.cronStones || 0;
                            const levelCronCount = cronStoneCount * levelExpectedAttempts * recoveryCostMultiplier;
                            
                            // Check which type of cron stones we're using
                            let cronPrice;
                            if (useCostumeCronCheckbox && useCostumeCronCheckbox.checked) {
                                cronPrice = 2185297; // Costume cron price
                            } else {
                                cronPrice = 3000000; // Vendor cron price (3 million per cron stone)
                            }
                            
                            const levelCronCost = cronPrice * levelCronCount;
                            
                            // Add to our total cron tracking (these will be added to the totals later)
                            totalCronCount += levelCronCount;
                            totalCronCost += levelCronCost;
                            
                            // Log the cron costs for recovery attempts
                            console.log(`Adding recovery cron costs for ${prevLevel}: ${Math.round(levelCronCount).toLocaleString()} stones (${Math.round(levelCronCost).toLocaleString()} Silver)`);
                        }
                        
                        // For the next lower level, we need to account for additional failures
                        // at this level that cause further downgrades
                        const levelFailRate = (100 - levelSuccessChance) / 100;
                        recoveryCostMultiplier *= levelFailRate * levelExpectedAttempts;
                    }
                    
                    // Total cost is current level attempts + downgrade recovery
                    levelCost = currentLevelAttemptCost + downgradeCost;
                    
                    // Calculate memory fragment costs for failures
                    if (useMemFrags) {
                        // Memory fragments needed for current level failures
                        const currentLevelMemFragsCost = costDetails.memFragsCost * (expectedAttempts - 1); // -1 because we succeed once
                        const currentLevelMemFragsCount = costDetails.memFragsCount * (expectedAttempts - 1);
                        
                        levelMemFragsCost = currentLevelMemFragsCost + downgradedMemFragsCost;
                        levelMemFragsCount = currentLevelMemFragsCount + downgradedMemFragsCount;
                    }
                    
                    console.log(`Including complete downgrade recovery cost for ${currentLevel}: ${downgradeCost.toLocaleString()}`);
                    console.log(`  - ${expectedDowngrades.toFixed(2)} expected initial downgrades`);
                } else {
                    // First level enhancement can't be downgraded below start level
                    levelCost = costDetails.totalCost * expectedAttempts;
                    // Store materials cost separately
                    const materialsCost = costDetails.materialsCost * expectedAttempts;
                    
                    // Calculate memory fragment costs for failures at this level
                    if (useMemFrags) {
                        levelMemFragsCost = costDetails.memFragsCost * (expectedAttempts - 1); // -1 because we succeed once
                        levelMemFragsCount = costDetails.memFragsCount * (expectedAttempts - 1);
                    }
                }
            } else {
                // With cron stones, no downgrades occur but durability is still lost
                levelCost = costDetails.totalCost * expectedAttempts;
                // Store materials cost separately
                const materialsCost = costDetails.materialsCost * expectedAttempts;
                
                // Store cron stone details
                const cronCost = costDetails.cronCost * expectedAttempts;
                const cronStoneCount = enhancementItemRequirements[item]?.[currentLevel]?.cronStones || 0;
                
                // Memory fragment costs still apply as durability is lost with each attempt
                if (useMemFrags) {
                    levelMemFragsCost = costDetails.memFragsCost * expectedAttempts;
                    levelMemFragsCount = costDetails.memFragsCount * expectedAttempts;
                } else {
                    levelMemFragsCost = 0;
                    levelMemFragsCount = 0;
                }
            }
            
            // Store the direct attempts for this level with more precision
            // This is the number of attempts needed just for this level, without considering any downgrades
            expectedAttemptsArray.push(expectedAttempts.toFixed(2));
            
            // Store raw attempts calculation for display purposes
            if (!window.rawAttemptsArray) {
                window.rawAttemptsArray = [];
            }
            // Ensure we have an entry for this index
            while (window.rawAttemptsArray.length <= index) {
                window.rawAttemptsArray.push(0);
            }
            window.rawAttemptsArray[index] = rawAttempts.toFixed(2);
            
            // For total attempts calculation, we need to consider all attempts including recovery attempts
            let totalAttemptsForThisLevel = expectedAttempts;
            
            // If not using cron stones and we're not at base level, add recovery attempts
            if (!useCron && currentLevel !== 'BASE' && index > 0) {
                // Calculate recovery attempts from all previous levels
                const expectedDowngrades = failChance / successChance;
                let recoveryAttempts = 0;
                
                // For each downgrade, we need to calculate all the attempts needed to get back to this level
                for (let prevIdx = 0; prevIdx < index; prevIdx++) {
                    const prevLevel = levels[startIndex + prevIdx];
                    const prevFS = failstacks[prevIdx];
                    const prevSuccessChance = calculateSuccessChance(item, prevLevel, prevFS);
                    const prevExpectedAttempts = 100 / prevSuccessChance;
                    
                    // If this is the immediate previous level
                    if (prevIdx === index - 1) {
                        recoveryAttempts += prevExpectedAttempts * expectedDowngrades;
                    } else {
                        // For earlier levels, we need to account for cascading downgrades
                        // This is an approximation based on the probability of needing to recover through this level
                        // The real calculation would be more complex with probability trees
                        const cascadeFactor = Math.pow(0.85, index - prevIdx - 1); // Approximate falloff for deeper levels
                        recoveryAttempts += prevExpectedAttempts * expectedDowngrades * cascadeFactor;
                    }
                }
                
                totalAttemptsForThisLevel += recoveryAttempts;
                console.log(`For ${currentLevel}: Direct attempts: ${expectedAttempts.toFixed(2)}, Recovery attempts: ${recoveryAttempts.toFixed(2)}`);
                
                // Store the recovery attempts in a separate array for display
                if (!window.recoveryAttemptsArray) {
                    window.recoveryAttemptsArray = [];
                }
                
                // Ensure we have an entry for this index
                while (window.recoveryAttemptsArray.length <= index) {
                    window.recoveryAttemptsArray.push(0);
                }
                
                window.recoveryAttemptsArray[index] = recoveryAttempts;
            }
            
            totalAttempts += totalAttemptsForThisLevel;
            costPerLevelArray.push(levelCost);
            totalCostValue += levelCost;
            
            // Calculate and store material costs (base materials only, not cron or memory fragments)
            const materialsCost = costDetails.materialsCost * (useCronForThisLevel ? expectedAttempts : (expectedAttempts - 1 + 1)); // All attempts need materials
            materialsCostArray.push(materialsCost);
            
            memFragsCostArray.push(levelMemFragsCost);
            memFragsCountArray.push(levelMemFragsCount);
            totalMemFragsCost += levelMemFragsCost;
            totalMemFragsCount += levelMemFragsCount;
            
            // Track cron stone usage - now using per-level decision and the cost details from calculateAttemptCost
            if (useCronForThisLevel) {
                // The costDetails already includes the cronCost for one attempt
                const cronStoneCount = enhancementItemRequirements[item]?.[currentLevel]?.cronStones || 0;
                const totalCronStonesForLevel = cronStoneCount * expectedAttempts;
                const cronCost = costDetails.cronCost * expectedAttempts; // Use the cronCost from the details
                
                cronCostArray.push(cronCost);
                cronStoneCountArray.push(totalCronStonesForLevel);
                totalCronCost += cronCost;
                totalCronCount += totalCronStonesForLevel;
                
                console.log(`For level ${currentLevel}: Using ${Math.round(totalCronStonesForLevel).toLocaleString()} cron stones (${Math.round(cronCost).toLocaleString()} Silver)`);
            } else {
                cronCostArray.push(0);
                cronStoneCountArray.push(0);
            }
            
            // Store success chance with 3 decimal places precision
            successChancesArray.push(successChance.toFixed(3));
        }
        
        // The final total cost is just totalCostValue since memory fragment costs 
        // are already included in the levelCost calculations
        let finalTotalCost = totalCostValue;
        
        // Calculate total material cost
        let totalMaterialCost = 0;
        for (let i = 0; i < materialsCostArray.length; i++) {
            totalMaterialCost += materialsCostArray[i];
        }
        
        // Return the calculated results
        return {
            item: item,
            startLevel: startLevel,
            targetLevel: targetLevel,
            totalCost: Math.round(finalTotalCost), // Already includes memory fragment costs from each level's calculation
            totalMaterialCost: Math.round(totalMaterialCost), // Total cost of materials only
            attemptsPrediction: parseFloat(totalAttempts.toFixed(2)),
            failstackUsage: failstacks,
            originalFailstacks: originalFailstacks, // Store the original failstack values before any increments
            successChances: successChancesArray,
            expectedAttempts: expectedAttemptsArray,
            rawAttempts: window.rawAttemptsArray || [],
            recoveryAttempts: window.recoveryAttemptsArray || [],
            costPerLevel: costPerLevelArray,
            materialsCost: materialsCostArray,
            memFragsCost: memFragsCostArray,
            totalMemFragsCost: Math.round(totalMemFragsCost),
            memFragsCount: memFragsCountArray,
            totalMemFragsCount: Math.round(totalMemFragsCount),
            cronCost: cronCostArray,
            cronStoneCount: cronStoneCountArray,
            totalCronCost: Math.round(totalCronCost),
            totalCronCount: Math.round(totalCronCount),
            includeMemFrags: useMemFrags,
            useCronStones: useCron,
            useCronPerLevel: useCronPerLevelArray // Track which levels used cron stones
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
        const resultTitle = createElement('h2', {}, 'Enhancement Results');
        
        const itemInfo = createElement('p', {}, '');
        itemInfo.innerHTML = `<strong>Item:</strong> ${results.item} (${formattedStartLevel} → ${formattedTargetLevel})`;
        
        const costInfo = createElement('p', {}, '');
        // Always show the total cost without specifying components in this line
        costInfo.innerHTML = `<strong>Estimated Total Cost:</strong> ${results.totalCost.toLocaleString()} Silver`
        
        // Always add cost breakdown section
        const costBreakdown = createElement('div', { className: 'cost-breakdown' });
        costBreakdown.style.marginLeft = '20px';
        costBreakdown.style.fontSize = '0.9em';
        costBreakdown.style.marginTop = '5px';
        
        // Check if any cron stones were used (either globally or for first level only)
        if (results.totalCronCount > 0) {
            // Global cron stones enabled (either regular or costume)
            if ((useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked)) {
                costBreakdown.innerHTML = 
                    `• <strong>Material Cost:</strong> ${Math.round(results.totalMaterialCost).toLocaleString()} Silver<br>` +
                    `• <strong>Cron Stones:</strong> ${Math.round(results.totalCronCount).toLocaleString()} stones (${Math.round(results.totalCronCost).toLocaleString()} Silver)`;
            } 
            // Only first level cron stones (protection from downgrade below starting level)
            else {
                // Calculate cron stones from direct enhancement and from recovery attempts
                const directEnhancementCronCount = results.cronStoneCount[0] > 0 ? Math.round(results.cronStoneCount[0]) : 0;
                const directEnhancementCronCost = results.cronCost[0] > 0 ? Math.round(results.cronCost[0]) : 0;
                
                // Calculate total cron cost from recovery attempts (difference between total and direct)
                const recoveryCronCount = Math.max(0, Math.round(results.totalCronCount - directEnhancementCronCount));
                const recoveryCronCost = Math.max(0, Math.round(results.totalCronCost - directEnhancementCronCost));
                
                if (directEnhancementCronCount > 0 || recoveryCronCount > 0) {
                    costBreakdown.innerHTML = 
                        `• <strong>Material Cost:</strong> ${Math.round(results.totalMaterialCost).toLocaleString()} Silver<br>` +
                        `• <strong>Total Cron Stone Usage:</strong> ${Math.round(results.totalCronCount).toLocaleString()} stones (${Math.round(results.totalCronCost).toLocaleString()} Silver)`;
                    
                    // Add breakdown of direct vs recovery cron usage
                    costBreakdown.innerHTML +=
                        `<br><span style="margin-left: 15px; color: #2ecc71;">↳ Direct enhancement: ${directEnhancementCronCount.toLocaleString()} stones (${directEnhancementCronCost.toLocaleString()} Silver)</span>`;
                    
                    if (recoveryCronCount > 0) {
                        costBreakdown.innerHTML +=
                            `<br><span style="margin-left: 15px; color: #e74c3c;">↳ Recovery attempts: ${recoveryCronCount.toLocaleString()} stones (${recoveryCronCost.toLocaleString()} Silver)</span>`;
                    }
                    
                    costBreakdown.innerHTML +=
                        `<br><span style="color: #2ecc71; font-size: 0.9em;">Protection against downgrade below ${formatEnhancementLevel(results.startLevel)}</span>`;
                }
            }
            
            if (results.includeMemFrags) {
                costBreakdown.innerHTML += `<br>• <strong>Memory Fragments:</strong> ${Math.round(results.totalMemFragsCount).toLocaleString()} fragments (${Math.round(results.totalMemFragsCost).toLocaleString()} Silver)`;
            }
            
            costInfo.appendChild(costBreakdown);
        } 
        // No cron stones used at all
        else if (results.includeMemFrags) {
            costBreakdown.innerHTML = 
                `• <strong>Material Cost:</strong> ${Math.round(results.totalMaterialCost).toLocaleString()} Silver<br>` +
                `• <strong>Memory Fragments:</strong> ${Math.round(results.totalMemFragsCount).toLocaleString()} fragments (${Math.round(results.totalMemFragsCost).toLocaleString()} Silver)`;
            costInfo.appendChild(costBreakdown);
        }
        
        const attemptsInfo = createElement('p', {}, '');
        
        // Always show the total attempts
        attemptsInfo.innerHTML = `<strong>Estimated Total Attempts:</strong> ${results.attemptsPrediction}`;
        
        // Show additional breakdown for recovery attempts if any
        if ((!useCronCheckbox || !useCronCheckbox.checked) && (!useCostumeCronCheckbox || !useCostumeCronCheckbox.checked)) {
            // Calculate total direct and recovery attempts
            let totalDirectAttempts = 0;
            let totalRecoveryAttempts = 0;
            
            for (let i = 0; i < results.expectedAttempts.length; i++) {
                totalDirectAttempts += parseFloat(results.expectedAttempts[i]);
                // Only count recovery attempts for levels that don't use cron stones
                if (!results.useCronPerLevel || !results.useCronPerLevel[i]) {
                    totalRecoveryAttempts += results.recoveryAttempts && results.recoveryAttempts[i] 
                        ? parseFloat(results.recoveryAttempts[i]) 
                        : 0;
                }
            }
            
            if (totalRecoveryAttempts > 0) {
                attemptsInfo.innerHTML += ` <span style="font-size: 0.9em; color: #e74c3c; font-weight: bold;">(Includes all direct + recovery attempts)</span>`;
                
                // Add detailed breakdown of attempts
                const attemptsBreakdown = createElement('div', {}, '');
                attemptsBreakdown.style.marginLeft = '20px';
                attemptsBreakdown.style.fontSize = '0.9em';
                attemptsBreakdown.style.marginTop = '5px';
                
                attemptsBreakdown.innerHTML = 
                    `• <strong>Direct Attempts:</strong> ${totalDirectAttempts.toFixed(2)} <span style="color: #555;">(Initial enhancement attempts)</span><br>` +
                    `• <strong>Recovery Attempts:</strong> ${totalRecoveryAttempts.toFixed(2)} <span style="color: #e74c3c;">(Additional attempts after downgrades)</span>`;
                
                attemptsInfo.appendChild(attemptsBreakdown);
            }
        }
        
        const detailsTitle = createElement('h3', {}, 'Enhancement Details:');
        
        const detailsList = createElement('ul');
        
        // Add some CSS styling for better readability
        detailsList.style.borderTop = '1px solid #ddd';
        detailsList.style.marginTop = '10px';
        detailsList.style.paddingTop = '10px';
        
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
            let detailContent = `<strong>${formattedCurrentLevel} → ${formattedNextLevel}:</strong> `;
            
            // Check if the original failstack was different than the current one
            // This happens when automatic failstack increment is applied with cron stones
            if ((useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked)) {
                const origFS = results.originalFailstacks[i];
                if (origFS !== results.failstackUsage[i]) {
                    detailContent += `Failstack: <span style="text-decoration: line-through;">${origFS}</span> → <span style="color: green; font-weight: bold;">${results.failstackUsage[i]}</span>, `;
                } else {
                    detailContent += `Failstack: ${results.failstackUsage[i]}, `;
                }
            } else {
                detailContent += `Failstack: ${results.failstackUsage[i]}, `;
            }
            
            detailContent += `Success Chance: ${parseFloat(results.successChances[i]).toFixed(3)}%, `;
                                
            // Add direct attempts info with raw calculation
            const rawAttempts = results.rawAttempts[i] || (100/parseFloat(results.successChances[i])).toFixed(2);
            
            // Check if cron stones are used
            const usingCron = (useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked);
            
            // Display direct attempts
            if (usingCron) {
                // When using cron stones, show exact calculation with failstack increments
                detailContent += `<span style="font-weight: bold;">Direct Attempts: ${results.expectedAttempts[i]}</span> <span style="color: #3498db;">(with +FS increments)</span> <span style="color: #777;">(${rawAttempts} raw)</span>`;
            } else {
                // When not using cron stones, just show standard calculation
                detailContent += `<span style="font-weight: bold;">Direct Attempts: ${results.expectedAttempts[i]}</span>`;
            }
            
            // Add recovery attempts if not using cron and recovery attempts exist
            if (!((useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked)) && results.recoveryAttempts && results.recoveryAttempts[i] > 0) {
                detailContent += `, <span style="color: #e74c3c;">Recovery Attempts: ${results.recoveryAttempts[i].toFixed(2)}</span>`;
                
                // Calculate total attempts for this level
                const totalForLevel = parseFloat(results.expectedAttempts[i]) + parseFloat(results.recoveryAttempts[i]);
                detailContent += `, <span style="font-weight: bold;">Total: ${totalForLevel.toFixed(2)}</span>`;
            }
            
            detailContent += `, Total Cost: ${Math.round(results.costPerLevel[i]).toLocaleString()} Silver`;
            
            // Show the material cost
            detailContent += `<br><span style="margin-left: 15px; color: #2980b9;">• Material Cost: ${Math.round(results.materialsCost[i]).toLocaleString()} Silver</span>`;
            
            // Add cron stone cost details if cron stones are used for this level
            if (results.useCronPerLevel && results.useCronPerLevel[i] && results.cronCost && results.cronCost[i] > 0) {
                // Special message for first level cron when global cron is disabled
                if (i === 0 && !((useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked))) {
                    detailContent += `<br><span style="margin-left: 15px; color: #2ecc71;">• Base Protection Cron Stones: ${Math.round(results.cronStoneCount[i]).toLocaleString()} (${Math.round(results.cronCost[i]).toLocaleString()} Silver)</span>`;
                    
                    // Calculate how many cron stones are used for recovery attempts for this level
                    const directCronCount = Math.round(results.cronStoneCount[i]);
                    const totalCronCount = Math.round(results.totalCronCount);
                    const recoveryCronCount = totalCronCount - directCronCount;
                    
                    if (recoveryCronCount > 0) {
                        detailContent += `<br><span style="margin-left: 15px; color: #e74c3c;">• Recovery Cron Stones: ~${recoveryCronCount.toLocaleString()} for recovery attempts</span>`;
                    }
                    
                    detailContent += `<br><span style="margin-left: 15px; font-size: 0.85em; color: #7f8c8d;">Protection against downgrade below ${formatEnhancementLevel(results.startLevel)}</span>`;
                } else {
                    detailContent += `<br><span style="margin-left: 15px; color: #3498db;">• Cron Stones: ${Math.round(results.cronStoneCount[i]).toLocaleString()} (${Math.round(results.cronCost[i]).toLocaleString()} Silver)</span>`;
                }
            }
                                
            // Add memory fragment info if included
            if (results.includeMemFrags) {
                detailContent += `<br><span style="margin-left: 15px; color: #9b59b6;">• Memory Fragments: ${Math.round(results.memFragsCount[i]).toLocaleString()} (${Math.round(results.memFragsCost[i]).toLocaleString()} Silver)</span>`;
            }
                                
            // Add note about downgrades if not using cron and not enhancing from BASE level
            if (!((useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked)) && currentLevel !== 'BASE') {
                // We've already added recovery attempts details inline in the earlier content
            }
            
            const detailItem = createElement('li', {}, '');
            detailItem.innerHTML = detailContent;
            
            // Add styling to make each enhancement level visually distinct
            detailItem.style.padding = '8px 4px';
            detailItem.style.marginBottom = '8px';
            detailItem.style.borderBottom = '1px dotted #eee';
            
            detailsList.appendChild(detailItem);
        }
        
        resultsDiv.appendChild(detailsList);
        
        // Add a note about calculations
        const note = document.createElement('p');
        note.className = 'note';
        
        // Different note based on whether cron stones are used
        if ((useCronCheckbox && useCronCheckbox.checked) || (useCostumeCronCheckbox && useCostumeCronCheckbox.checked)) {
            let cronType = useCronCheckbox && useCronCheckbox.checked ? "Vendor Cron Stones (3M silver per cron)" : "Costume Cron Stones (2,185,297 silver per cron)";
            note.innerHTML = `<strong>Note:</strong> These calculations include ${cronType} costs. Cron Stones prevent item downgrades but durability is still lost.<br>` +
                           '<strong>Failstack Increments:</strong> When using cron stones, the calculator simulates automatic failstack increments that would naturally occur from failed attempts.<br>' +
                           '<span style="color: #ff0000; font-weight: bold; font-size: 1.1em;">Important: The cost of building failstacks is not included in these calculations.</span>';
        } else {
            note.innerHTML = '<strong>Note:</strong> These calculations include the cost of potential downgrades on failed attempts without Cron stones.<br>' +
                           '<strong>• Direct Attempts:</strong> The expected number of attempts needed at each level (100/success chance).<br>' +
                           '<strong>• Recovery Attempts:</strong> Additional attempts needed to recover from downgrades after failures.<br>' +
                           '<strong>• Total Per Level:</strong> Combined direct and recovery attempts for that specific level.<br>' +
                           '<strong>• Overall Total Attempts:</strong> Includes all direct enhancement attempts PLUS all recovery attempts across all levels.<br>' +
                           'This is why the total attempts is significantly higher than the sum of direct attempts shown in the details.<br>' +
                           '<span style="color: #ff0000; font-weight: bold; font-size: 1.1em;">Important: The cost of building failstacks is not included in these calculations.</span>';
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
            
            // Prefetch prices if not in streaming mode
            if (!document.getElementById('streaming-mode')?.checked) {
                await prefetchCommonPrices();
            }
            
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
                const results = await calculateEnhancement(selectedItem, selectedStartLevel, selectedTargetLevel, failstacks);
                
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
    
    // Event listener for simulation item selection
    if (simItemSelect) {
        simItemSelect.addEventListener('change', function() {
            const selectedItem = this.value;
            
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
            
            // Show recommended FS container if a target level is selected
            const recommendedFSContainer = document.getElementById('sim-recommended-fs-container');
            if (recommendedFSContainer) {
                if (selectedLevel) {
                    recommendedFSContainer.style.display = 'block';
                } else {
                    recommendedFSContainer.style.display = 'none';
                }
            }
            
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
            
            // If recommended FS is checked, apply it
            if (simUseRecommendedFS && simUseRecommendedFS.checked) {
                applyRecommendedFSToSimulation();
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
        
        // If all required fields are selected, prefetch prices in the background
        if (isEnabled) {
            prefetchCommonPrices();
        }
    }
    
    /**
     * Fetch all prices at application startup for both regions
     */
    async function fetchAllPricesOnStartup() {
        console.log('Fetching all prices at startup...');
        
        try {
            // Fetch prices for both regions
            await Promise.all([
                fetchRegionPrices('EU'),
                fetchRegionPrices('NA')
            ]);
            
            console.log('Successfully fetched all prices at startup');
        } catch (error) {
            console.warn('Failed to fetch all prices at startup:', error);
            console.log('Using default values instead');
        }
    }
    
    /**
     * Fetch prices for a specific region
     * @param {string} region - The region to fetch prices for ('EU' or 'NA')
     */
    async function fetchRegionPrices(region) {
        try {
            const regionLower = region.toLowerCase();
            const jsonUrl = `https://jackdaniels2507.github.io/bdo-calculator/bdo-prices-${regionLower}.json`;
            
            console.log(`Fetching ${region} prices from ${jsonUrl}`);
            
            const response = await fetch(jsonUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ${region} prices: ${response.status} ${response.statusText}`);
            }
            
            const pricesData = await response.json();
            
            // Update cache timestamp
            priceCache.lastFetch = Date.now();
            
            // Update all prices in our cache
            Object.keys(pricesData).forEach(itemId => {
                if (pricesData[itemId] && pricesData[itemId].price) {
                    marketPrices[region][itemId] = pricesData[itemId].price;
                    console.log(`Updated price for item ${itemId} in ${region}: ${pricesData[itemId].price}`);
                }
            });
            
            return true;
        } catch (error) {
            console.warn(`Failed to fetch ${region} prices:`, error);
            return false;
        }
    }
    
    /**
     * Prefetch commonly used prices in bulk to minimize individual network requests
     * This can help reduce the number of separate network calls during calculations
     */
    async function prefetchCommonPrices() {
        // Skip if we've recently fetched prices (within cacheDuration)
        const currentTime = Date.now();
        if (currentTime - priceCache.lastFetch < priceCache.cacheDuration) {
            console.log('Using recently cached prices, skipping prefetch');
            return;
        }
        
        try {
            console.log('Prefetching common prices in bulk...');
            
            // List of common item IDs used in calculations
            const commonItemIds = [
                44195, // Memory Fragment
                4998,  // Sharp Black Crystal Shard
                721003, // Caphras Stone
                820979, // Essence of Dawn
                820934  // Primordial Black Stone
            ];
            
            const regionLower = currentRegion.toLowerCase();
            const jsonUrl = `https://jackdaniels2507.github.io/bdo-calculator/bdo-prices-${regionLower}.json`;
            
            // Fetch all prices at once
            const response = await fetch(jsonUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch prices: ${response.status} ${response.statusText}`);
            }
            
            const pricesData = await response.json();
            
            // Update cache timestamp
            priceCache.lastFetch = currentTime;
            
            // Store all fetched prices in our cache
            for (const itemId of commonItemIds) {
                if (pricesData[itemId] && pricesData[itemId].price) {
                    marketPrices[currentRegion][itemId] = pricesData[itemId].price;
                    console.log(`Prefetched price for item ${itemId}: ${pricesData[itemId].price}`);
                }
            }
            
            console.log('Price prefetching complete');
        } catch (error) {
            console.warn('Failed to prefetch prices:', error);
            // Silently fail - we'll use cached/default values
        }
    }
    
    // Add event listeners to check simulation inputs
    if (simItemSelect) simItemSelect.addEventListener('change', checkSimulationInputs);
    if (simTargetLevel) simTargetLevel.addEventListener('change', checkSimulationInputs);
    if (simFailstack) simFailstack.addEventListener('input', checkSimulationInputs);
    if (simAttempts) simAttempts.addEventListener('input', checkSimulationInputs);
    
    // Simulation function
    async function runSimulation(item, startLevel, targetLevel, startingFS, attempts, useCron, useMemFrags, praygeOption, isUsingCostumeCron = false) {
        // Results to track
        const results = {
            item: item,
            startLevel: startLevel,
            targetLevel: targetLevel,
            attempts: attempts,
            successes: 0,
            failures: 0,
            totalCost: 0,
            materialsCost: 0,
            cronCost: 0,
            memFragsCost: 0,
            attemptLog: [],
            praygeOption: praygeOption, // Track which streamer the user prayed to
            isUsingCostumeCron: isUsingCostumeCron // Track if using costume cron stones
        };
        
        // Run the simulation for the specified number of attempts
        let currentFS = startingFS;
        
        // Get the item cost once to use for all attempts (to avoid too many API calls)
        // Pass isUsingCostumeCron to calculateAttemptCost so it can use the correct cron stone price
        const baseAttemptCost = await calculateAttemptCost(item, startLevel, useCron, useMemFrags, isUsingCostumeCron);
        
        for (let i = 0; i < attempts; i++) {
            // Calculate base success chance using the utility function
            let successChance = calculateSuccessChance(item, startLevel, currentFS);
            
            // Apply the streamer luck modifier if selected (Easter egg)
            let originalChance = successChance;
            let streamEffect = '';
            
            if (praygeOption === 'rapolas') {
                // MrRapolas gives +70% luck - multiply the success rate by 1.7, cap at 90%
                successChance = Math.min(successChance * 1.7, 90);
                streamEffect = '+MrRapolas';
            } else if (praygeOption === 'biceptimus') {
                // BiceptimusPrime gives -70% luck - multiply the success rate by 0.3
                successChance = Math.max(successChance * 0.3, 0.1); // Minimum 0.1% chance
                streamEffect = '-BiceptimusPrime';
            }
            
            // Use the pre-calculated cost
            const totalAttemptCost = baseAttemptCost.totalCost;
            results.totalCost += totalAttemptCost;
            results.materialsCost += baseAttemptCost.materialsCost;
            results.cronCost += baseAttemptCost.cronCost;
            results.memFragsCost += baseAttemptCost.memFragsCost;
            
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
                    originalChance: originalChance.toFixed(3),
                    streamEffect: streamEffect,
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
                    originalChance: originalChance.toFixed(3),
                    streamEffect: streamEffect,
                    result: 'FAIL',
                    cost: totalAttemptCost
                });
                
                // Increase failstack automatically when cron stones are used
                if (useCron) {
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
        // Clear the results div before adding new content
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
            
            createElement('p', {}, '')
        ];
        
        // Create streamer luck banner if applicable - as a separate element
        if (results.praygeOption && results.praygeOption !== 'none') {
            // Add animation keyframes to the document if they don't exist
            if (!document.getElementById('pulse-animation')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'pulse-animation';
                styleElement.textContent = `
                    @keyframes pulse {
                        0% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.8; transform: scale(1.02); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                `;
                document.head.appendChild(styleElement);
            }
            
            // Create the banner with class for identification
            const banner = document.createElement('div');
            banner.className = 'streamer-banner';
            banner.style.padding = '15px';
            banner.style.margin = '0 0 20px 0';
            banner.style.borderRadius = '4px';
            banner.style.fontWeight = 'bold';
            banner.style.textAlign = 'center';
            banner.style.fontSize = '20px';
            banner.style.animation = 'pulse 2s infinite';
            banner.style.display = 'block';
            banner.style.width = '100%';
            banner.style.boxSizing = 'border-box';
            
            if (results.praygeOption === "rapolas") {
                banner.style.backgroundColor = "#2ecc71";
                banner.style.color = "#fff";
                banner.style.boxShadow = "0 0 10px #2ecc71";
                banner.innerHTML = "🙏 Blessed by MrRapolas! 🍀";
            } else if (results.praygeOption === "biceptimus") {
                banner.style.backgroundColor = "#e74c3c";
                banner.style.color = "#fff";
                banner.style.boxShadow = "0 0 10px #e74c3c";
                banner.innerHTML = "💀 Cursed by BiceptimusPrime! 💔";
            }
            
            // Clear any existing banner
            const existingBanner = simResultsDiv.querySelector('.streamer-banner');
            if (existingBanner) {
                existingBanner.remove();
            }
            
            // Insert banner at the beginning of the results
            simResultsDiv.insertBefore(banner, simResultsDiv.firstChild);
        }
        
        elements.push(createElement('p', {}, ''));
        elements.push(createElement('div', { className: 'cost-breakdown' }, ''));
        
        // Set HTML content for elements that need it
        elements[1].innerHTML = `<strong>Item:</strong> ${results.item} (${formattedStartLevel} → ${formattedTargetLevel})`;
        elements[2].innerHTML = `<strong>Success Rate:</strong> ${successRate}% (${results.successes} successes out of ${results.attempts} attempts)`;
        elements[3].innerHTML = `<strong>Total Cost:</strong> ${results.totalCost.toLocaleString()} Silver`;
        
        // Add cost breakdown
        const cronTypeText = results.isUsingCostumeCron ? 
            "Costume Cron Stones (2,185,297 silver each)" : 
            "Vendor Cron Stones (3,000,000 silver each)";
        
        elements[4].innerHTML = `
            <div><strong>Materials:</strong> ${results.materialsCost.toLocaleString()} Silver</div>
            <div><strong>Cron Stones:</strong> ${results.cronCost.toLocaleString()} Silver ${results.cronCost > 0 ? `<span style="color: #888; font-style: italic; font-size: 0.9em;">(${cronTypeText})</span>` : ''}</div>
            <div><strong>Memory Fragments:</strong> ${results.memFragsCost.toLocaleString()} Silver</div>
            <div><em>Average Cost Per Attempt:</em> ${Math.round(results.totalCost / results.attempts).toLocaleString()} Silver</div>
        `;
        
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
        
        let headers = ['Attempt', 'Failstack', 'Chance'];
        
        // Add streamer effect column if a streamer was selected
        if (results.praygeOption && results.praygeOption !== 'none') {
            headers.push('Streamer Effect');
        }
        
        // Add remaining standard headers
        headers = headers.concat(['Result', 'Cost']);
        
        headers.forEach(header => {
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
            const cells = [];
            
            // 1. Attempt cell
            const attemptCell = document.createElement('td');
            attemptCell.textContent = log.attempt;
            attemptCell.style.padding = '8px';
            attemptCell.style.borderBottom = '1px solid #333';
            cells.push(attemptCell);
            
            // 2. Failstack cell
            const fsCell = document.createElement('td');
            fsCell.textContent = log.failstack;
            fsCell.style.padding = '8px';
            fsCell.style.borderBottom = '1px solid #333';
            cells.push(fsCell);
            
            // 3. Always add Chance cell (renamed from Original Chance)
            const chanceCell = document.createElement('td');
            chanceCell.textContent = `${log.originalChance}%`;
            chanceCell.style.padding = '8px';
            chanceCell.style.borderBottom = '1px solid #333';
            // Use normal color since this is now a standard column
            cells.push(chanceCell);
            
            // 4. If prayge option is selected, add Streamer Effect cell
            if (results.praygeOption && results.praygeOption !== 'none') {
                // Streamer effect cell
                const effectCell = document.createElement('td');
                if (log.streamEffect) {
                    const isPositive = log.streamEffect.includes('+');
                    effectCell.style.color = isPositive ? '#2ecc71' : '#e74c3c';
                    effectCell.style.fontWeight = 'bold';
                    
                    // Just show the streamer name without any extra text
                    effectCell.textContent = isPositive ? 'MrRapolas' : 'BiceptimusPrime';
                } else {
                    effectCell.textContent = '-';
                }
                effectCell.style.padding = '8px';
                effectCell.style.borderBottom = '1px solid #333';
                cells.push(effectCell);
            }
            
            // 5. Result cell
            const resultCell = document.createElement('td');
            resultCell.textContent = log.result;
            resultCell.style.padding = '8px';
            resultCell.style.borderBottom = '1px solid #333';
            resultCell.style.color = log.result === 'SUCCESS' ? '#4CAF50' : '#F44336';
            resultCell.style.fontWeight = 'bold';
            cells.push(resultCell);
            
            // 6. Cost cell
            const costCell = document.createElement('td');
            costCell.textContent = log.cost.toLocaleString() + ' Silver';
            costCell.style.padding = '8px';
            costCell.style.borderBottom = '1px solid #333';
            cells.push(costCell);
            
            // Add all cells to the row in the correct order
            cells.forEach(cell => row.appendChild(cell));
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        logContainer.appendChild(table);
        simResultsDiv.appendChild(logContainer);
    }
    
    // Event listener for simulate button
    if (simulateBtn) {
        simulateBtn.addEventListener('click', async function() {
            // Clear any previous results
            simResultsDiv.innerHTML = '';
            simResultsDiv.className = 'results-container';
            
            const item = simItemSelect.value;
            const targetLevel = simTargetLevel.value;
            const startingFS = parseInt(simFailstack.value);
            const attempts = parseInt(simAttempts.value);
            const useCron = simUseCron.checked || simUseCostumeCron.checked;
            const useMemFrags = simUseMemFrags.checked;
            // Track which cron stone option is being used
            const isUsingCostumeCron = simUseCostumeCron && simUseCostumeCron.checked;
            // Removed addFSAfterFail checkbox - failstacks will automatically increment when using cron stones
            
            // Get the previous level based on the target level
            const levels = enhancementLevels[item];
            const targetIndex = levels.indexOf(targetLevel);
            const startLevel = levels[targetIndex - 1];
            
            // Run the simulation and display results
            try {
                // Show a loading message
                simResultsDiv.innerHTML = '<p>Running simulation, please wait...</p>';
                simResultsDiv.className = 'results-container show';
                
                // Get the prayge option selected
                const praygeOptions = document.getElementsByName('prayge');
                let praygeOption = 'none';
                
                for (let i = 0; i < praygeOptions.length; i++) {
                    if (praygeOptions[i].checked) {
                        praygeOption = praygeOptions[i].value;
                        break;
                    }
                }
                
                // Use the isUsingCostumeCron variable we defined earlier
                const simulationResults = await runSimulation(item, startLevel, targetLevel, startingFS, attempts, useCron, useMemFrags, praygeOption, isUsingCostumeCron);
                displaySimulationResults(simulationResults);
            } catch (error) {
                console.error('Error in simulation:', error);
                // Display error to user
                simResultsDiv.innerHTML = `<div class="error">Error running simulation: ${error.message}</div>`;
                simResultsDiv.className = 'results-container show';
            }
        });
    }
    
    // Apply recommended FS to the simulation tab
    if (simUseRecommendedFS) {
        simUseRecommendedFS.addEventListener('change', function() {
            applyRecommendedFSToSimulation();
        });
    }
    
    /**
     * Applies the recommended failstack value to the simulation tab's failstack input
     */
    function applyRecommendedFSToSimulation() {
        if (!simUseRecommendedFS || !simItemSelect || !simTargetLevel || !simFailstack) return;
        
        const isChecked = simUseRecommendedFS.checked;
        const selectedItem = simItemSelect.value;
        const selectedLevel = simTargetLevel.value;
        
        if (!selectedItem || !selectedLevel) return;
        
        // Get the current level (one before the target)
        const levels = enhancementLevels[selectedItem];
        const targetIndex = levels.indexOf(selectedLevel);
        
        if (targetIndex <= 0) return;
        
        const currentLevel = levels[targetIndex - 1];
        const recommendedFS = enhancementItemRequirements[selectedItem]?.[currentLevel]?.enhancementData?.recommendedFS || 0;
        
        if (isChecked && recommendedFS > 0) {
            // Store the original value before applying recommended FS
            simFailstack.dataset.originalValue = simFailstack.value;
            // Set to recommended FS value
            simFailstack.value = recommendedFS;
            // Show recommended FS in placeholder
            simFailstack.placeholder = `Recommended FS: ${recommendedFS}`;
        } else if (!isChecked) {
            // Restore original value
            simFailstack.value = simFailstack.dataset.originalValue || '';
            // Reset placeholder
            simFailstack.placeholder = 'Enter failstack value';
        }
    }
    
    // ============================================
    // Map Easter Egg Functionality
    // ============================================
    
    // Get map related elements
    const selectLocationBtn = document.getElementById('select-location-btn');
    const mapModal = document.getElementById('map-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const confirmLocationBtn = document.getElementById('confirm-location-btn');
    const bdoMap = document.getElementById('bdo-map');
    const locationMarker = document.getElementById('selected-location-marker');
    
    // Variables to track location
    let selectedLocation = null;
    
    // Event listener for the "Select Location" button
    if (selectLocationBtn) {
        selectLocationBtn.addEventListener('click', function() {
            // Show the map modal
            mapModal.style.display = 'block';
        });
    }
    
    // Event listener for the close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            mapModal.style.display = 'none';
        });
    }
    
    // Event listener for clicking on the map
    if (bdoMap) {
        bdoMap.addEventListener('click', function(event) {
            // Calculate position relative to the map
            const rect = bdoMap.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Store selected coordinates
            selectedLocation = {
                x: (x / rect.width) * 100, // Store as percentage
                y: (y / rect.height) * 100
            };
            
            // Update marker position
            locationMarker.style.left = `${selectedLocation.x}%`;
            locationMarker.style.top = `${selectedLocation.y}%`;
            locationMarker.style.display = 'block';
            
            // Enable confirm button
            confirmLocationBtn.disabled = false;
            
            console.log(`Location selected: ${selectedLocation.x.toFixed(2)}%, ${selectedLocation.y.toFixed(2)}%`);
        });
    }
    
    // Event listener for the confirm button
    if (confirmLocationBtn) {
        confirmLocationBtn.addEventListener('click', function() {
            // Close the modal
            mapModal.style.display = 'none';
            // No toast notification - just close the modal
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === mapModal) {
            mapModal.style.display = 'none';
        }
    });
    
    // Streaming mode removed
    
    // ============================================
    // Zodiac Easter Egg Functionality
    // ============================================
    
    // Get zodiac select element and related elements
    const zodiacSelect = document.getElementById('zodiac-select');
    const zodiacIcon = document.getElementById('zodiac-icon');
    const zodiacDesc = document.getElementById('zodiac-desc');
    
    // Define BDO zodiac signs data with icon URLs and emoji fallbacks
    const zodiacData = [
        {
            name: "SHIELD",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/a/a2/Customize_zodiac_m_shield.png/revision/latest?cb=20230621162818",
            emoji: "🛡️",
            description: "Rational, disciplined, methodical.",
            color: "#3498db" // Blue
        },
        {
            name: "GIANT",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/b/b9/Customize_zodiac_m_giant.png/revision/latest?cb=20230621162814",
            emoji: "🏔️",
            description: "Dreamer, ambitious, swift, an observer.",
            color: "#6d4c41" // Dark brown
        },
        {
            name: "CAMEL",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/c/cd/Customize_zodiac_m_camel.png/revision/latest?cb=20230621162821",
            emoji: "🐪",
            description: "Perseverance and patience, gentle, talented.",
            color: "#d2b48c" // Tan
        },
        {
            name: "BLACK DRAGON",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/e/ed/Customize_zodiac_m_dragon.png/revision/latest?cb=20230621162810",
            emoji: "🐉",
            description: "Wealth and fame, noble, delicate, sensitive, sociable.",
            color: "#2c3e50" // Dark blue/black
        },
        {
            name: "TREANT OWL",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/6/61/Customize_zodiac_m_entowl.png/revision/latest?cb=20230621162813",
            emoji: "🦉",
            description: "Simple, genuine, knowledgable, a genius or an idiot.",
            color: "#9b59b6" // Purple
        },
        {
            name: "ELEPHANT",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/4/47/Customize_zodiac_m_elephant.png/revision/latest?cb=20230621162812",
            emoji: "🐘",
            description: "Honorable, faithful, obtuse, dedicated, trusted.",
            color: "#7f8c8d" // Gray
        },
        {
            name: "WAGON",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/5/50/Customize_zodiac_m_carriage.png/revision/latest?cb=20230621162809",
            emoji: "🛒",
            description: "Takes action, born to wealth, precious, selfish.",
            color: "#8b4513" // Brown
        },
        {
            name: "SEALING STONE",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/4/47/Customize_zodiac_m_blackstone.png/revision/latest?cb=20230621162820",
            emoji: "💎",
            description: "Careful, eccentric, secretive, short-lived.",
            color: "#34495e" // Dark slate
        },
        {
            name: "GOBLIN",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/f/f5/Customize_zodiac_m_goblin.png/revision/latest?cb=20230621162815",
            emoji: "👺",
            description: "Linguist, strong beliefs, intellectual, materialistic, wise.",
            color: "#27ae60" // Green
        },
        {
            name: "KEY",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/c/c8/Customize_zodiac_m_key.png/revision/latest?cb=20230621162817",
            emoji: "🔑",
            description: "Focused, thirst for knowledge, relaxed, determined.",
            color: "#f1c40f" // Gold
        },
        {
            name: "HAMMER",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/e/e9/Customize_zodiac_m_hammer.png/revision/latest?cb=20230621162816",
            emoji: "🔨",
            description: "Brave, conservative, righteous, collaborative, hot-blooded.",
            color: "#e74c3c" // Red
        },
        {
            name: "BOAT",
            iconUrl: "https://static.wikia.nocookie.net/blackdesert/images/b/b1/Customize_zodiac_m_ship.png/revision/latest?cb=20230621162819",
            emoji: "⛵",
            description: "Enjoys art, optimistic, free, a wanderer.",
            color: "#00bcd4" // Cyan
        }
    ];
    
    // Create a display for the zodiac icons in the console for reference
    function showZodiacIconsInfo() {
        console.log('%c BDO Zodiac Signs ', 'background: #2c3e50; color: white; padding: 2px 5px; border-radius: 3px;');
        console.log('To see the original BDO zodiac icons, visit: https://blackdesertonline.fandom.com/wiki/Horoscopes');
        
        // Show all zodiac data in a formatted way in the console
        zodiacData.forEach((zodiac, index) => {
            console.log(
                `%c ${zodiac.emoji} ${zodiac.name} `, 
                `background: ${zodiac.color}; color: white; padding: 2px 5px; border-radius: 3px;`,
                zodiac.description
            );
        });
    }
    
    // Log zodiac info to console once when the page loads
    showZodiacIconsInfo();
    
    // Add event listener for zodiac selection
    if (zodiacSelect) {
        zodiacSelect.addEventListener('change', function() {
            const selectedZodiac = this.value;
            
            // Reset icon and description if no selection
            if (!selectedZodiac) {
                zodiacIcon.style.display = 'none';
                zodiacDesc.style.display = 'none';
                document.documentElement.style.setProperty('--accent-color', '#4CAF50'); // Default color
                return;
            }
            
            // Get data for the selected zodiac
            const index = parseInt(selectedZodiac);
            const zodiac = zodiacData[index];
            
            // Update UI with zodiac information
            document.documentElement.style.setProperty('--accent-color', zodiac.color);
            
            // Update the existing icon span directly instead of replacing it
            if (zodiacIcon) {
                zodiacIcon.textContent = zodiac.emoji + " ";
                zodiacIcon.style.fontSize = '24px';
                zodiacIcon.title = zodiac.name;
                zodiacIcon.style.display = 'inline';
            }
            
            // Display description
            zodiacDesc.textContent = zodiac.description;
            zodiacDesc.style.display = 'block';
            
            // Log to console
            console.log(`${zodiac.emoji} Zodiac selected: ${zodiac.name} - ${zodiac.description}`);
        });
    }
    
    // Tooltip functionality removed as requested
    
    // Function to show a toast notification with location info
    // Toast function removed as requested
});
