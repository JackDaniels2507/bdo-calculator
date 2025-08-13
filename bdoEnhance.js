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
        'Fallen God\'s Armor': ['BASE', 'I', 'II', 'III', 'IV', 'V'],
        'Preonne': ['BASE', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
    };

    // Failstack building costs - defines what items and quantities are needed for specific failstack levels
    const failstackCosts = {
        5:{
            itemId: 16001,
            quantity: 5
        },
        10:{
            itemId: 16001,
            quantity: 10
        },
        15:{
            itemId: 16001,
            quantity: 21
        },
        20:{
            itemId: 16001,
            quantity: 33
        },
        25:{
            itemId: 16001,
            quantity: 53
        },
        30:{
            itemId: 16001,
            quantity: 84
        },
        35:{
            itemId: 16001,
            quantity: 136
        },
        40:{
            itemId: 16001,
            quantity: 230
        },
        45:{
            itemId: 16001,
            quantity: 406
        },
        50: {
            itemId: 8411, 
            quantity: 4
        },
        60: {
            itemId: 8411, 
            quantity: 8
        },
        70: {
            itemId: 8411, 
            quantity: 15
        },
        80: {
            itemId: 8411, 
            quantity: 25
        },
        90: {
            itemId: 8411,
            quantity: 35
        },
        100: {
            itemId: 8411,
            quantity: 50
        }
    };

    // Origin of Dark Hunger failstack increase table
    // Item ID 5998: Origin of Dark Hunger - Special item that increases failstack based on current FS level
    const originOfDarkHungerIncrease = {
        100: 26, 101: 26,
        102: 25, 103: 25, 104: 25, 105: 25,
        106: 24, 107: 24, 108: 24,
        109: 23, 110: 23, 111: 23,
        112: 22, 113: 22, 114: 22, 115: 22,
        116: 21, 117: 21, 118: 21, 119: 21,
        120: 20, 121: 20, 122: 20, 123: 20, 124: 20,
        125: 19, 126: 19, 127: 19, 128: 19, 129: 19,
        130: 18, 131: 18, 132: 18, 133: 18, 134: 18, 135: 18,
        136: 17, 137: 17, 138: 17, 139: 17, 140: 17, 141: 17,
        142: 16, 143: 16, 144: 16, 145: 16, 146: 16, 147: 16, 148: 16,
        149: 15, 150: 15, 151: 15, 152: 15, 153: 15, 154: 15, 155: 15, 156: 15,
        157: 14, 158: 14, 159: 14, 160: 14, 161: 14, 162: 14, 163: 14, 164: 14, 165: 14,
        166: 13, 167: 13, 168: 13, 169: 13, 170: 13, 171: 13, 172: 13, 173: 13, 174: 13, 175: 13,
        176: 12, 177: 12, 178: 12, 179: 12, 180: 12, 181: 12, 182: 12, 183: 12, 184: 12, 185: 12, 186: 12, 187: 12,
        188: 11, 189: 11, 190: 11, 191: 11, 192: 11, 193: 11, 194: 11, 195: 11, 196: 11,
        197: 10, 198: 10, 199: 10, 200: 10, 201: 10, 202: 10, 203: 10, 204: 10, 205: 10, 206: 10,
        207: 9, 208: 9, 209: 9, 210: 9, 211: 9, 212: 9, 213: 9, 214: 9, 215: 9, 216: 9, 217: 9,
        218: 8, 219: 8, 220: 8, 221: 8, 222: 8, 223: 8, 224: 8, 225: 8, 226: 8, 227: 8, 228: 8, 229: 8, 230: 8, 231: 8, 232: 8, 233: 8, 234: 8, 235: 8,
        236: 7, 237: 7, 238: 7, 239: 7, 240: 7, 241: 7, 242: 7, 243: 7, 244: 7, 245: 7, 246: 7, 247: 7, 248: 7, 249: 7, 250: 7, 251: 7, 252: 7, 253: 7, 254: 7,
        255: 6, 256: 6, 257: 6, 258: 6, 259: 6, 260: 6, 261: 6, 262: 6, 263: 6, 264: 6, 265: 6, 266: 6, 267: 6, 268: 6, 269: 6,
        270: 5, 271: 5, 272: 5, 273: 5, 274: 5, 275: 5, 276: 5, 277: 5, 278: 5, 279: 5, 280: 5, 281: 5, 282: 5, 283: 5, 284: 5, 285: 5, 286: 5, 287: 5, 288: 5, 289: 5, 290: 5, 291: 5,
        292: 4, 293: 4, 294: 4, 295: 4, 296: 4,
        297: 3,
        298: 2,
        299: 1
    };

    // Permanent failstack constants
    const permanentFailstacks = {
        freeFailstacks: 3, // First 3 permanent failstacks are free
        maxPaidFailstacks: 13, // Maximum number of paid permanent failstacks (like Valks' Cry)
        paidFailstackCost: 6555891 // Cost per paid permanent failstack in silver
    };

    /**
     * Calculates the optimal cost to build a specific failstack level
     * @param {number} targetFS - The target failstack level to build
     * @returns {Promise<Object>} - Object containing cost breakdown and details
     */
    async function calculateFailstackBuildCost(targetFS) {
        let totalCost = 0;
        let breakdown = {
            freeFailstacks: 0,
            paidFailstacks: 0,
            paidFailstackCost: 0,
            blackStoneCost: 0,
            blackStoneCount: 0,
            crystallizedDespairCost: 0,
            crystallizedDespairCount: 0,
            originOfDarkHungerCost: 0,
            originOfDarkHungerCount: 0,
            remainingFS: targetFS
        };

        // Step 1: Use free permanent failstacks (first 3 are free)
        if (breakdown.remainingFS > 0) {
            breakdown.freeFailstacks = Math.min(breakdown.remainingFS, permanentFailstacks.freeFailstacks);
            breakdown.remainingFS -= breakdown.freeFailstacks;
        }

        // Step 2: Use paid permanent failstacks (up to 13 at 6,555,891 each)
        if (breakdown.remainingFS > 0) {
            breakdown.paidFailstacks = Math.min(breakdown.remainingFS, permanentFailstacks.maxPaidFailstacks);
            breakdown.paidFailstackCost = breakdown.paidFailstacks * permanentFailstacks.paidFailstackCost;
            totalCost += breakdown.paidFailstackCost;
            breakdown.remainingFS -= breakdown.paidFailstacks;
        }

        // Step 3: Build remaining failstacks using items from failstackCosts
        if (breakdown.remainingFS > 0) {
            if (breakdown.remainingFS <= 100) {
                // Calculate cost for building remaining failstacks using appropriate items
                const costData = await calculateFailstackItemCost(breakdown.remainingFS);
                breakdown.crystallizedDespairCost = costData.crystallizedDespairCost;
                breakdown.crystallizedDespairCount = costData.crystallizedDespairCount;
                breakdown.blackStoneCost = costData.blackStoneCost || 0;
                breakdown.blackStoneCount = costData.blackStoneCount || 0;
                totalCost += costData.totalCost;
                breakdown.remainingFS = 0;
            } else {
                // First build to 100 using appropriate items
                const itemCostData = await calculateFailstackItemCost(100);
                breakdown.crystallizedDespairCost = itemCostData.crystallizedDespairCost;
                breakdown.crystallizedDespairCount = itemCostData.crystallizedDespairCount;
                breakdown.blackStoneCost = itemCostData.blackStoneCost || 0;
                breakdown.blackStoneCount = itemCostData.blackStoneCount || 0;
                totalCost += itemCostData.totalCost;
                
                // Then use Origin of Dark Hunger for remaining FS above 100
                const remainingAbove100 = breakdown.remainingFS - 100;
                const hungerCostData = await calculateOriginOfDarkHungerCost(100, remainingAbove100);
                breakdown.originOfDarkHungerCost = hungerCostData.totalCost;
                breakdown.originOfDarkHungerCount = hungerCostData.count;
                totalCost += breakdown.originOfDarkHungerCost;
                breakdown.remainingFS = 0;
            }
        }

        return {
            targetFS,
            totalCost,
            breakdown
        };
    }

    /**
     * Calculates cost for building failstacks with Crystallized Despair up to specified level
     * @param {number} targetFS - Target failstack level (max 100)
     * @returns {Promise<Object>} - Cost and count data
     */
    async function calculateCrystallizedDespairCost(targetFS) {
        const despairPrice = await fetchItemPrice(currentRegion, 8411); // Crystallized Despair
        let totalCost = 0;
        let totalCount = 0;

        // Get all defined levels and find the ones that use Crystallized Despair (itemId: 8411)
        const definedLevels = Object.keys(failstackCosts).map(Number).sort((a, b) => a - b);
        const crystallizedDespairLevels = definedLevels.filter(level => failstackCosts[level].itemId === 8411);
        const minCrystallizedLevel = crystallizedDespairLevels[0] || 50; // Default to 50 if no Crystallized Despair levels defined
        
        // If targetFS is below the minimum Crystallized Despair level, return 0 cost
        // (these levels should be handled by other items in failstackCosts)
        if (targetFS < minCrystallizedLevel) {
            return {
                totalCost: 0,
                totalCount: 0
            };
        }
        
        let currentFS = 0;
        
        // Find the exact match or the highest Crystallized Despair level <= targetFS
        let exactLevel = null;
        for (const level of crystallizedDespairLevels) {
            if (level <= targetFS) {
                exactLevel = level;
            } else {
                break;
            }
        }
        
        if (exactLevel !== null) {
            // If we have an exact match or a level to start from
            const cost = failstackCosts[exactLevel];
            totalCost += cost.quantity * despairPrice;
            totalCount += cost.quantity;
            currentFS = exactLevel;
        }

        // If we need more FS beyond the exact level, calculate cost per FS
        if (currentFS < targetFS && currentFS < 100) {
            const remainingFS = targetFS - currentFS;
            
            // Find the next Crystallized Despair level to calculate cost per FS
            const nextLevel = crystallizedDespairLevels.find(level => level > currentFS);
            if (nextLevel) {
                const currentLevelCost = failstackCosts[currentFS];
                const nextLevelCost = failstackCosts[nextLevel];
                const fsGap = nextLevel - currentFS;
                const costGap = nextLevelCost.quantity - currentLevelCost.quantity;
                const costPerFS = (costGap * despairPrice) / fsGap;
                
                const additionalCost = remainingFS * costPerFS;
                const additionalCount = Math.ceil(remainingFS * costGap / fsGap);
                
                totalCost += additionalCost;
                totalCount += additionalCount;
            }
        }

        return {
            totalCost,
            totalCount
        };
    }

    /**
     * Calculates cost for building failstacks using the appropriate items from failstackCosts
     * @param {number} targetFS - Target failstack level (max 100)
     * @returns {Promise<Object>} - Cost and count data for all items used
     */
    async function calculateFailstackItemCost(targetFS) {
        let totalCost = 0;
        let crystallizedDespairCost = 0;
        let crystallizedDespairCount = 0;
        let blackStoneCost = 0;
        let blackStoneCount = 0;

        // Get all defined levels and separate by item type
        const definedLevels = Object.keys(failstackCosts).map(Number).sort((a, b) => a - b);
        const blackStoneLevels = definedLevels.filter(level => failstackCosts[level].itemId === 16001);
        const crystallizedDespairLevels = definedLevels.filter(level => failstackCosts[level].itemId === 8411);
        
        // Get prices for both items
        const blackStonePrice = await fetchItemPrice(currentRegion, 16001); // Black Stone
        const despairPrice = await fetchItemPrice(currentRegion, 8411); // Crystallized Despair

        // Determine the most efficient method based on target failstack level
        const maxBlackStoneLevel = Math.max(...blackStoneLevels);
        const minCrystallizedLevel = Math.min(...crystallizedDespairLevels);

        // For failstacks that can be built with Crystallized Despair, compare costs and use the more efficient method
        if (targetFS >= minCrystallizedLevel) {
            // Calculate cost using only Crystallized Despair (more efficient for higher FS)
            let lowerLevel = null;
            let upperLevel = null;
            
            // Find the appropriate range for interpolation in Crystallized Despair levels
            for (const level of crystallizedDespairLevels) {
                if (level <= targetFS) {
                    lowerLevel = level;
                } else {
                    upperLevel = level;
                    break;
                }
            }
            
            if (lowerLevel === targetFS) {
                // Exact match
                const crystallizedData = failstackCosts[lowerLevel];
                crystallizedDespairCount = crystallizedData.quantity;
                crystallizedDespairCost = crystallizedDespairCount * despairPrice;
            } else if (lowerLevel !== null && upperLevel !== null && lowerLevel < targetFS && targetFS < upperLevel) {
                // Interpolate between lowerLevel and upperLevel
                const lowerData = failstackCosts[lowerLevel];
                const upperData = failstackCosts[upperLevel];
                const fsGap = upperLevel - lowerLevel;
                const costGap = upperData.quantity - lowerData.quantity;
                const costPerFS = costGap / fsGap;
                const additionalFS = targetFS - lowerLevel;
                
                crystallizedDespairCount = Math.ceil(lowerData.quantity + (additionalFS * costPerFS));
                crystallizedDespairCost = crystallizedDespairCount * despairPrice;
            } else if (lowerLevel !== null && upperLevel === null) {
                // targetFS is above the highest defined level, use the highest level cost
                const crystallizedData = failstackCosts[lowerLevel];
                crystallizedDespairCount = crystallizedData.quantity;
                crystallizedDespairCost = crystallizedDespairCount * despairPrice;
            }
            
            totalCost = crystallizedDespairCost;
        } else if (targetFS > 0 && targetFS <= maxBlackStoneLevel) {
            // Use Black Stone for lower failstack levels (more efficient for lower FS)
            let lowerLevel = null;
            let upperLevel = null;
            
            // Find the appropriate range for interpolation in Black Stone levels
            for (const level of blackStoneLevels) {
                if (level <= targetFS) {
                    lowerLevel = level;
                } else {
                    upperLevel = level;
                    break;
                }
            }
            
            if (lowerLevel === targetFS) {
                // Exact match
                const blackStoneData = failstackCosts[lowerLevel];
                blackStoneCount = blackStoneData.quantity;
                blackStoneCost = blackStoneCount * blackStonePrice;
            } else if (lowerLevel !== null && upperLevel !== null && lowerLevel < targetFS && targetFS < upperLevel) {
                // Interpolate between lowerLevel and upperLevel
                const lowerData = failstackCosts[lowerLevel];
                const upperData = failstackCosts[upperLevel];
                const fsGap = upperLevel - lowerLevel;
                const costGap = upperData.quantity - lowerData.quantity;
                const costPerFS = costGap / fsGap;
                const additionalFS = targetFS - lowerLevel;
                
                blackStoneCount = Math.ceil(lowerData.quantity + (additionalFS * costPerFS));
                blackStoneCost = blackStoneCount * blackStonePrice;
            } else if (lowerLevel === null && upperLevel !== null) {
                // targetFS is below our minimum defined level, interpolate from 0 to first level
                const firstLevel = blackStoneLevels[0];
                const firstData = failstackCosts[firstLevel];
                const costPerFS = firstData.quantity / firstLevel;
                
                blackStoneCount = Math.ceil(targetFS * costPerFS);
                blackStoneCost = blackStoneCount * blackStonePrice;
            }
            
            totalCost = blackStoneCost;
        } else {
            // For failstack levels between Black Stone max and Crystallized Despair min (46-49)
            // Use a stepped approach: base Black Stone cost + incremental Crystallized Despair
            if (blackStoneLevels.length > 0 && crystallizedDespairLevels.length > 0) {
                const lastBlackStoneLevel = maxBlackStoneLevel; // 45
                const lastBlackStoneData = failstackCosts[lastBlackStoneLevel];
                
                // Always use the full Black Stone cost as base (406 Black Stones for 45 FS)
                blackStoneCount = lastBlackStoneData.quantity;
                blackStoneCost = blackStoneCount * blackStonePrice;
                
                // Add incremental Crystallized Despair based on how far above 45 FS we are
                const additionalFS = targetFS - lastBlackStoneLevel;
                
                if (additionalFS >= 1 && additionalFS <= 2) {
                    // FS 46-47: 406 Black Stones + 1 Crystallized Despair
                    crystallizedDespairCount = 1;
                } else if (additionalFS >= 3 && additionalFS <= 4) {
                    // FS 48-49: 406 Black Stones + 2 Crystallized Despair
                    crystallizedDespairCount = 2;
                }
                
                crystallizedDespairCost = crystallizedDespairCount * despairPrice;
                totalCost = blackStoneCost + crystallizedDespairCost;
            } else {
                // Fallback: use Crystallized Despair method if available
                if (crystallizedDespairLevels.length > 0) {
                    const firstCrystallizedLevel = minCrystallizedLevel;
                    const firstCrystallizedData = failstackCosts[firstCrystallizedLevel];
                    const costPerFS = (firstCrystallizedData.quantity * despairPrice) / firstCrystallizedLevel;
                    
                    crystallizedDespairCount = Math.ceil(targetFS * costPerFS / despairPrice);
                    crystallizedDespairCost = crystallizedDespairCount * despairPrice;
                    totalCost = crystallizedDespairCost;
                }
            }
        }

        return {
            totalCost,
            crystallizedDespairCost,
            crystallizedDespairCount,
            blackStoneCost,
            blackStoneCount
        };
    }

    /**
     * Calculates how many Origin of Dark Hunger items needed to build from startFS to targetFS
     * @param {number} startFS - Starting failstack level
     * @param {number} fsToGain - How many failstacks to gain
     * @returns {Promise<Object>} - Cost and count data
     */
    async function calculateOriginOfDarkHungerCost(startFS, fsToGain) {
        const hungerPrice = await fetchItemPrice(currentRegion, 5998); // Origin of Dark Hunger
        let currentFS = startFS;
        let count = 0;
        let fsGained = 0;

        while (fsGained < fsToGain && currentFS < 299) {
            const fsIncrease = originOfDarkHungerIncrease[currentFS] || 1;
            count++;
            fsGained += fsIncrease;
            currentFS += fsIncrease;
        }

        return {
            count,
            totalCost: count * hungerPrice,
            actualFSGained: fsGained
        };
    }

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
    // Global cron checkboxes removed from calculator tab
    const useCronCheckbox = null;
    const useCostumeCronCheckbox = null;
    const useMemFragsCheckbox = document.getElementById('use-mem-frags');
    const useArtisanMemoryCheckbox = document.getElementById('use-artisan-memory');
    const includeFailstackCostCheckbox = document.getElementById('include-failstack-cost');
    
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
    const simUseArtisanMemory = document.getElementById('sim-use-artisan-memory');
    const simIncludeFailstackCost = document.getElementById('sim-include-failstack-cost');
    
    // Get tab navigation elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Get region switch elements
    const regionEU = document.getElementById('region-eu');
    const regionNA = document.getElementById('region-na');
    const simRegionEU = document.getElementById('sim-region-eu');
    const simRegionNA = document.getElementById('sim-region-na');
    
    // Global cron checkboxes event listeners removed since they no longer exist in calculator tab
    // We now only use per-level cron settings for the calculator
    
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
    
    // Add event listeners for memory fragments and artisan memory checkboxes
    if (useMemFragsCheckbox) {
        useMemFragsCheckbox.addEventListener('change', function() {
            if (useArtisanMemoryCheckbox) {
                // Only enable Artisan's Memory checkbox if memory fragments are enabled
                useArtisanMemoryCheckbox.disabled = !this.checked;
                if (!this.checked) {
                    useArtisanMemoryCheckbox.checked = false;
                }
            }
        });
        // Initial state
        if (useArtisanMemoryCheckbox) {
            useArtisanMemoryCheckbox.disabled = !useMemFragsCheckbox.checked;
        }
    }
    
    if (simUseMemFrags) {
        simUseMemFrags.addEventListener('change', function() {
            if (simUseArtisanMemory) {
                // Only enable Artisan's Memory checkbox if memory fragments are enabled
                simUseArtisanMemory.disabled = !this.checked;
                if (!this.checked) {
                    simUseArtisanMemory.checked = false;
                }
            }
        });
        // Initial state
        if (simUseArtisanMemory) {
            simUseArtisanMemory.disabled = !simUseMemFrags.checked;
        }
    }
    
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
    
    // Initialize Simulation Cron Stone checkboxes based on default region (easter egg)
    // No longer setting calculator cron checkboxes as they've been removed
    if (currentRegion === 'EU' && simUseCron && simUseCostumeCron) {
        simUseCron.checked = true;
        simUseCostumeCron.checked = false;
    } else if (currentRegion === 'NA' && simUseCron && simUseCostumeCron) {
        simUseCron.checked = false;
        simUseCostumeCron.checked = true;
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
        'Preonne': {
            durabilityLoss: 20,                          // Durability loss on failure for all Preonne enhancements
            memFragPerDurability: 1,                     // Each memory fragment restores 1 durability point
            'BASE': { 
                materials: [{ itemId: 4987, count: 15 }],    // Essence of Dawn x1 for BASE->I
                cronStones: 0,                               // No cron stones needed for BASE->I
                enhancementData: {
                    baseChance: 25.000
                }
            },
            'I': { 
                materials: [{ itemId: 4987, count: 16 }],    // Essence of Dawn x2 for I->II
                cronStones: 360,                              // 120 cron stones for I->II
                enhancementData: {
                    baseChance: 20.000,
                }
            },
            'II': { 
                materials: [{ itemId: 4987, count: 17 }],    // Essence of Dawn x3 for II->III
                cronStones: 670,                              // 280 cron stones for II->III
                enhancementData: {
                    baseChance: 15.000,
                }
            },
            'III': { 
                materials: [{ itemId: 4987, count: 18 }],    // Essence of Dawn x4 for III->IV
                cronStones: 990,                              // 540 cron stones for III->IV
                enhancementData: {
                    baseChance: 13.000,
                }
            },
            'IV': { 
                materials: [{ itemId: 4987, count: 19 }],    // Essence of Dawn x6 for IV->V
                cronStones: 1430,                             // 840 cron stones for IV->V
                enhancementData: {
                    baseChance: 11.000,
                }
            },
            'V': { 
                materials: [{ itemId: 4987, count: 20 }],    // Essence of Dawn x8 for V->VI
                cronStones: 1890,                             // 1090 cron stones for V->VI
                enhancementData: {
                    baseChance: 10.000,
                }
            },
            'VI': { 
                materials: [{ itemId: 4987, count: 21 }],    // Essence of Dawn x10 for VI->VII
                cronStones: 2390,                             // 1480 cron stones for VI->VII
                enhancementData: {
                    baseChance: 9.000,
                }
            },
            'VII': { 
                materials: [{ itemId: 4987, count: 22 }],    // Essence of Dawn x12 for VII->VIII
                cronStones: 2690,                             // 1880 cron stones for VII->VIII
                enhancementData: {
                    baseChance: 8.500,
                }
            },
            'VIII': { 
                materials: [{ itemId: 4987, count: 23 }],    // Essence of Dawn x15 for VIII->IX
                cronStones: 2750,                             // 2850 cron stones for VIII->IX
                enhancementData: {
                    baseChance: 8.000,
                }
            },
            'IX': { 
                materials: [{ itemId: 4987, count: 25 }],    // Essence of Dawn x18 for IX->X
                cronStones: 2810,                             // 3650 cron stones for IX->X
                enhancementData: {
                    baseChance: 7.500,
                }
            },
        },
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
        4987: "Concentrated Magical Black Gem",
        752023: "Mass of Pure Magic",
        8411: "Crystallized Despair",
        5998: "Origin of Dark Hunger",
        16001: "Black Stone"
    };
    
    // Cache control to reduce network requests
    const priceCache = {
        lastFetch: 0, // Timestamp of last fetch
        cacheDuration: 390 * 60 * 1000, // 390 minutes (6.5 hours) in milliseconds
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
            // Concentrated Magical Black Gem
            4987: 15000000, // 15 million silver based on estimated value
            // Mass of Pure Magic
            752023: 500000, // 500 thousand silver based on estimated value
            // Crystallized Despair
            8411: 36000000,  // 36 million silver based on estimated value
            // Origin of Dark Hunger
            5998: 1000000000,  // 1000 million silver based on estimated value (special failstack item)
            // Black Stone
            16001: 120000 
        
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
            // Concentrated Magical Black Gem
            4987: 15000000, // 15 million silver based on estimated value
            // Mass of Pure Magic
            752023: 500000, // 500 thousand silver based on estimated value
            // Crystallized Despair
            8411: 36000000,  // 36 million silver based on estimated value
            // Origin of Dark Hunger
            5998: 1000000000,  // 1000 million silver based on estimated value (special failstack item)
            // Black Stone
            16001: 120000 
        }
    };
    
    // ============================================
    // Utility Functions
    // ============================================
    
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
        
        // Preonne has fixed chance regardless of failstack
        if (item === 'Preonne') {
            return baseRate;
        }
        
        const successChance = Math.min(baseRate + (failstack * baseRate / 10), 90);
        
        return successChance;
    }
    
    /**
     * Calculates the exact average number of attempts needed with dynamic failstack increments
     * @param {number} baseRate - The base success rate percentage
     * @param {number} initialFailstack - The starting failstack value
     * @param {boolean} isPreonne - Whether this calculation is for Preonne (fixed success rate)
     * @returns {number} - The exact average number of attempts needed
     */
    function calculateExactAverageAttempts(baseRate, initialFailstack, isPreonne = false) {
        if (baseRate === 0) return 0;

        // For Preonne, which has fixed success rate regardless of failstacks
        if (isPreonne) {
            // Simple geometric distribution formula: 1/p
            return 100 / baseRate;
        }

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
     * @param {boolean} isUsingCostumeCron - Whether to use costume cron stones (null means auto-detect)
     * @param {boolean} useArtisanMemory - Whether to use Artisan's Memory (null means auto-detect)
     * @returns {Promise<Object>} - The total cost and details of the attempt
     */
    async function calculateAttemptCost(item, level, useCron, useMemFrags, isUsingCostumeCron = null, useArtisanMemory = null) {
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
            
            // If isUsingCostumeCron is explicitly provided, use that value
            if (isUsingCostumeCron !== null) {
                // Use the specified cron stone type (from per-level setting or simulation)
                cronPrice = isUsingCostumeCron ? 2185297 : 3000000;
            } else {
                // Fallback to simulation settings if we're in simulation mode
                const isSimulation = document.querySelector('.tab-content:not(.hidden)').id === 'simulation-tab';
                if (isSimulation && simUseCostumeCron && simUseCostumeCron.checked) {
                    cronPrice = 2185297; // Costume cron price
                } else {
                    cronPrice = 3000000; // Default to vendor cron price
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
            
            // Check if Artisan's Memory is being used (5x efficiency)
            // If useArtisanMemory is explicitly provided, use that value
            let useArtisan;
            if (useArtisanMemory !== null) {
                useArtisan = useArtisanMemory;
            } else {
                // Otherwise determine based on UI state
                const isSimulation = document.querySelector('.tab-content:not(.hidden)').id === 'simulation-tab';
                useArtisan = (isSimulation && simUseArtisanMemory && simUseArtisanMemory.checked) || 
                             (!isSimulation && useArtisanMemoryCheckbox && useArtisanMemoryCheckbox.checked);
            }
            
            // ALWAYS calculate the original fragment count first (without Artisan's)
            const originalFragCount = Math.ceil(durabilityLoss / memFragPerDurability);
            
            // Then calculate with Artisan's if needed using integer division + remainder handling
            if (useArtisan) {
                // Integer division (whole part)
                const wholePart = Math.floor(originalFragCount / 5);
                // Remainder calculation
                const remainder = originalFragCount % 5;
                // Add the whole part plus the remainder (which is already handled by integer division)
                memFragsCount = remainder > 0 ? wholePart + remainder : wholePart;
            } else {
                memFragsCount = originalFragCount;
            }
            
            try {
                const memFragPrice = await fetchItemPrice(currentRegion, 44195); // Memory Fragment ID
                
                if (useArtisan) {
                    // When using Artisan's Memory, we've already calculated the reduced fragment count
                    memFragsCost = memFragPrice * memFragsCount;
                    
                    // We already calculated the original fragment count
                    const originalCost = memFragPrice * originalFragCount;
                    
                    console.log(`Adding memory fragment cost with Artisan's Memory: ${memFragsCount} frags at ${memFragPrice.toLocaleString()} each = ${memFragsCost.toLocaleString()} (saved ${originalCost - memFragsCost} silver compared to ${originalFragCount} frags without Artisan's)`);
                } else {
                    // Regular memory fragments without Artisan's Memory
                    memFragsCost = memFragPrice * memFragsCount;
                    console.log(`Adding memory fragment cost: ${memFragsCount} frags at ${memFragPrice.toLocaleString()} each = ${memFragsCost.toLocaleString()}`);
                }
            } catch (error) {
                console.error(`Error fetching price for memory fragments:`, error);
                const defaultPrice = marketPrices[currentRegion][44195] || 0;
                memFragsCost = defaultPrice * memFragsCount;
                // Note: We're already accounting for Artisan's Memory by reducing memFragsCount
                // in the calculation above, so no special handling needed here
            }
        }
        
        // Total cost for this attempt (excluding memory fragments as they're calculated separately in enhancement logic)
        const totalCost = materialsCost + cronCost;
        console.log(`Total attempt cost for ${item} ${level}: ${totalCost.toLocaleString()} (materials: ${materialsCost.toLocaleString()}, cron: ${cronCost.toLocaleString()}, memory frags calculated separately: ${memFragsCost.toLocaleString()})`);
        
        // Get the durability loss and memory fragment per durability values
        const durabilityLossVal = enhancementItemRequirements[item]?.durabilityLoss || 0;
        const memFragPerDurabilityVal = enhancementItemRequirements[item]?.memFragPerDurability || 1;
        
        // Calculate the original fragment count regardless of Artisan's Memory
        const originalFragCount = Math.ceil(durabilityLossVal / memFragPerDurabilityVal);
        
        // Return cost details
        return {
            totalCost,
            materialsCost,
            cronCost,
            memFragsCost,
            memFragsCount,
            // Store the original fragment count for comparison purposes
            originalFragCount: originalFragCount,
            durabilityLoss: durabilityLossVal,
            memFragPerDurability: memFragPerDurabilityVal
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
        
        // Update region button states
        setActiveRegion('EU', { regionEU, regionNA, simRegionEU, simRegionNA });
        
        // Set the current region for API calls
        currentRegion = 'EU';
        
        // Easter egg: Auto-select Vendor Cron Stone for EU (simulation tab only)
        if (simUseCron && simUseCostumeCron) {
            simUseCron.checked = true;
            simUseCostumeCron.checked = false;
        }
        
        // Clear any calculation results when region changes
        clearResults([resultsDiv, simResultsDiv]);
        
        console.log('Market API region set to EU');
    }
    
    function switchToNARegion() {
        console.log('Switching to NA region');
        
        // Update region button states
        setActiveRegion('NA', { regionEU, regionNA, simRegionEU, simRegionNA });
        
        // Set the current region for API calls
        currentRegion = 'NA';
        
        // Easter egg: Auto-select Costume Cron Stone for NA (simulation tab only)
        if (simUseCron && simUseCostumeCron) {
            simUseCron.checked = false;
            simUseCostumeCron.checked = true;
        }
        
        // Clear any calculation results when region changes
        clearResults([resultsDiv, simResultsDiv]);
        
        console.log('Market API region set to NA');
    }
    
    // Add event listeners to all region buttons
    const regionButtons = [
        { element: regionEU, handler: switchToEURegion },
        { element: regionNA, handler: switchToNARegion },
        { element: simRegionEU, handler: switchToEURegion },
        { element: simRegionNA, handler: switchToNARegion }
    ];
    
    regionButtons.forEach(({ element, handler }) => {
        if (element) element.addEventListener('click', handler);
    });
    
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
                    startLevelSelect.appendChild(createOption(level, level));
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
                    targetLevelSelect.appendChild(createOption(levels[i], levels[i]));
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
                
                // For Preonne, we don't show failstack fields as it has fixed enhancement chance
                if (selectedItem === 'Preonne') {
                    // Display a message explaining that Preonne has fixed success rates
                    const infoMessage = createElement('div', {
                        className: 'preonne-info',
                        style: {
                            padding: '10px',
                            margin: '10px 0',
                            backgroundColor: '#222',  // Match app's background
                            borderRadius: '5px',
                            fontSize: '14px',
                            color: '#ff5555',  // Red text for emphasis
                            border: '1px solid #444',  // Add subtle border
                            fontWeight: 'bold'  // Make it bold for visibility
                        }
                    }, 'Preonne has fixed enhancement chances regardless of failstacks.');
                    
                    failstackContainer.appendChild(infoMessage);
                    
                    // Create a container for Preonne cron stone options
                    const preonneCronContainer = createElement('div', {
                        className: 'preonne-cron-container',
                        style: {
                            padding: '15px',
                            marginTop: '15px',
                            backgroundColor: '#252525',
                            borderRadius: '5px',
                            border: '1px solid #444'
                        }
                    });
                    
                    // Title for cron stone options
                    const cronTitle = createElement('div', {
                        style: {
                            marginBottom: '10px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#e0e0e0'
                        }
                    }, 'Cron Stone Options for Preonne');
                    
                    // Create buttons for selecting all cron types
                    const cronSelectorContainer = createCronSelectorButtons('cron-selector-container', {
                        vendorHandler: function() {
                            bulkSetCronCheckboxes('.use-cron-level', 'vendor', true);
                        },
                        costumeHandler: function() {
                            bulkSetCronCheckboxes('.use-cron-level', 'costume', true);
                        },
                        clearHandler: function() {
                            bulkSetCronCheckboxes('.use-cron-level', '', false);
                        }
                    });
                    cronSelectorContainer.style.gap = '10px';
                    cronSelectorContainer.style.marginBottom = '15px';
                    
                    // Add the selector container after the title
                    preonneCronContainer.appendChild(cronSelectorContainer);
                    
                    // Create cron buttons for each enhancement level
                    for (let i = 0; i < enhancementCount; i++) {
                        const currentLevel = levels[startIndex + i];
                        const targetLevel = levels[startIndex + i + 1];
                        
                        // Create level container
                        const levelContainer = createElement('div', {
                            className: 'cron-level-container',
                            style: 'display: flex; align-items: center; flex-wrap: wrap; margin-top: 10px;'
                        });
                        
                        // Level label
                        const levelLabel = createElement('div', {
                            style: {
                                minWidth: '120px', 
                                fontWeight: 'bold',
                                color: '#e0e0e0'
                            }
                        }, `${formatEnhancementLevel(currentLevel)} → ${formatEnhancementLevel(targetLevel)}:`);
                        
                        // Only show cron option if not enhancing from BASE level
                        const isBaseLevel = (currentLevel === 'BASE');
                        
                        // Declare cronCheckbox, cronTooltip, and cronLabel outside the if-block so they're accessible to all scopes
                        let cronCheckbox, cronTooltip, cronLabel;
                        
                        if (!isBaseLevel) {
                            // Create cron checkbox
                            cronCheckbox = createElement('input', {
                                type: 'checkbox',
                                id: `use-cron-level-${i}`,
                                className: 'use-cron-level'
                            });
                            
                            // Initialize cron checkbox - auto-check if it's the first level and not BASE
                            if (i === 0 && !isBaseLevel) {
                                cronCheckbox.checked = true;
                                cronCheckbox.disabled = true; // Make it non-deselectable for required levels
                                cronCheckbox.dataset.cronType = 'vendor'; // Default to vendor cron
                            } else {
                                cronCheckbox.checked = false;
                            }
                            
                            // Add event listener to mark when checkbox is manually changed (only for non-disabled checkboxes)
                            if (!cronCheckbox.disabled) {
                                cronCheckbox.addEventListener('change', function() {
                                    this.dataset.manuallyChanged = 'true';
                                });
                            }
                            
                            // Create tooltip with information about cron stones
                            cronTooltip = createElement('span', {
                                className: 'cron-tooltip',
                                title: 'Cron stones prevent item downgrade on failure',
                                style: 'margin-left: 5px; color: #777; cursor: help; font-size: 0.9em;'
                            }, '(?)');
                            
                            // Label for checkbox
                            const cronLabelText = (i === 0 && !isBaseLevel) ? '⚡ Cron (Required)' : '⚡ Cron';
                            cronLabel = createElement('label', {
                                for: `use-cron-level-${i}`,
                                className: 'per-level-cron-label',
                                style: 'margin-right: 10px; display: flex; align-items: center;'
                            });
                            
                            // Add text and tooltip to label
                            cronLabel.appendChild(document.createTextNode(cronLabelText));
                            cronLabel.appendChild(cronTooltip);
                            
                            // Add level label to container first
                            levelContainer.appendChild(levelLabel);
                        } else {
                            // If BASE level, just add label and a message that cron is not needed
                            levelContainer.appendChild(levelLabel);
                            const noCronMsg = createElement('span', {
                                style: 'color: #777; font-style: italic;'
                            }, 'No cron needed');
                            levelContainer.appendChild(noCronMsg);
                        }
                        
                        // Only create radio buttons if not BASE level
                        let radioContainer, vendorRadio, costumeRadio, vendorRadioContainer, costumeRadioContainer;
                        
                        if (!isBaseLevel) {
                            // Create container for cron controls (checkbox + radio buttons)
                            const cronControlsContainer = createElement('div', {
                                style: 'display: flex; align-items: center; gap: 10px;'
                            });
                            
                            // Add checkbox and label to the controls container
                            cronControlsContainer.appendChild(cronCheckbox);
                            cronControlsContainer.appendChild(cronLabel);
                            
                            // Create container for radio buttons
                            radioContainer = createElement('div', {
                                className: 'cron-type-container',
                                style: 'display: flex; align-items: center;'
                            });
                            
                            // Create vendor radio button container
                            vendorRadioContainer = createElement('div', {
                                className: 'cron-type-radio'
                            });
                            
                            // Create costume radio button container
                            costumeRadioContainer = createElement('div', {
                                className: 'cron-type-radio'
                            });
                            
                            // Create vendor radio button
                            vendorRadio = createElement('input', {
                                type: 'radio',
                                name: `cron-type-${i}`,
                                id: `vendor-cron-${i}`,
                                value: 'vendor',
                            });
                            
                            // Create label for vendor
                            const vendorLabel = createElement('label', {
                                for: `vendor-cron-${i}`,
                                style: 'margin-right: 10px; color: #3498db; font-size: 0.9em;'
                            }, 'Vendor (3M)');
                            
                            // Create costume radio button
                            costumeRadio = createElement('input', {
                                type: 'radio',
                                name: `cron-type-${i}`,
                                id: `costume-cron-${i}`,
                                value: 'costume',
                            });
                            
                            // Create label for costume
                            const costumeLabel = createElement('label', {
                                for: `costume-cron-${i}`,
                                style: 'color: #9b59b6; font-size: 0.9em;'
                            }, 'Costume (2.2M)');
                            
                            // Only add event listeners if not at BASE level (and cronCheckbox exists)
                            if (!isBaseLevel && cronCheckbox) {
                                // Add event listeners for radio buttons
                                vendorRadio.addEventListener('change', function() {
                                    if (this.checked && cronCheckbox) {
                                        cronCheckbox.dataset.cronType = 'vendor';
                                        if (!cronCheckbox.disabled) {
                                            cronCheckbox.checked = true;
                                        }
                                        
                                        // Update background color to vendor blue
                                        levelContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                                    }
                                });
                                
                                costumeRadio.addEventListener('change', function() {
                                    if (this.checked && cronCheckbox) {
                                        cronCheckbox.dataset.cronType = 'costume';
                                        if (!cronCheckbox.disabled) {
                                            cronCheckbox.checked = true;
                                        }
                                        
                                        // Update background color to costume purple
                                        levelContainer.style.backgroundColor = 'rgba(155, 89, 182, 0.2)';
                                    }
                                });
                                
                                // Add event listener to checkbox (only for non-disabled checkboxes)
                                if (!cronCheckbox.disabled) {
                                    cronCheckbox.addEventListener('change', function() {
                                        const index = this.id.replace('use-cron-level-', '');
                                        const vendorRadio = document.getElementById(`vendor-cron-${index}`);
                                        const costumeRadio = document.getElementById(`costume-cron-${index}`);
                                        
                                        if (!this.checked) {
                                            // Use unified system to disable radios
                                            setRadioButtonState(vendorRadio, costumeRadio, false);
                                            // Remove cron type data
                                            this.dataset.cronType = '';
                                            // Reset background color
                                            levelContainer.style.backgroundColor = 'rgba(155, 89, 182, 0.1)';
                                        } else {
                                            // Use unified system to enable radios with vendor default
                                            const currentSelection = vendorRadio.checked ? 'vendor' : (costumeRadio.checked ? 'costume' : 'vendor');
                                            setRadioButtonState(vendorRadio, costumeRadio, true, currentSelection);
                                            this.dataset.cronType = currentSelection;
                                            // Set background color based on selection
                                            const color = currentSelection === 'vendor' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(155, 89, 182, 0.2)';
                                            levelContainer.style.backgroundColor = color;
                                        }
                                    });
                                }
                            }
                            
                            // Auto-select vendor radio for first level if not BASE
                            if (i === 0 && !isBaseLevel && cronCheckbox && cronCheckbox.checked) {
                                setRadioButtonState(vendorRadio, costumeRadio, true, 'vendor');
                            }
                            
                            // Add radio buttons to their containers
                            vendorRadioContainer.appendChild(vendorRadio);
                            vendorRadioContainer.appendChild(vendorLabel);
                            costumeRadioContainer.appendChild(costumeRadio);
                            costumeRadioContainer.appendChild(costumeLabel);
                            
                            // Add radio containers to main container
                            radioContainer.appendChild(vendorRadioContainer);
                            radioContainer.appendChild(costumeRadioContainer);
                            
                            // Add radio container to the cron controls container
                            cronControlsContainer.appendChild(radioContainer);
                            
                            // Add the complete cron controls container to the level container
                            levelContainer.appendChild(cronControlsContainer);
                        }
                        
                        // Add level container to the Preonne cron container
                        preonneCronContainer.appendChild(levelContainer);
                    }
                    
                    // Add the title and cron container to the failstack container
                    preonneCronContainer.insertBefore(cronTitle, preonneCronContainer.firstChild);
                    failstackContainer.appendChild(preonneCronContainer);
                    
                    // Enable calculate button
                    calculateBtn.disabled = false;
                    return;
                }
                
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
                
                // Create a container for cron selector buttons
                const cronSelectorContainer = createCronSelectorButtons('cron-selector-container', {
                    vendorHandler: function() {
                        bulkSetCronCheckboxes('.use-cron-level', 'vendor', true);
                    },
                    costumeHandler: function() {
                        bulkSetCronCheckboxes('.use-cron-level', 'costume', true);
                    },
                    clearHandler: function() {
                        bulkSetCronCheckboxes('.use-cron-level', '', false);
                    }
                });
                cronSelectorContainer.style.justifyContent = 'space-between';
                cronSelectorContainer.style.flexWrap = 'wrap';
                
                // Store input references and recommended FS values for each field
                const inputFields = [];
                const recommendedFSValues = [];
                
                // Add the global softcap elements to the container
                globalSoftcapContainer.appendChild(globalSoftcapCheckbox);
                globalSoftcapContainer.appendChild(globalSoftcapLabel);
                failstackContainer.appendChild(globalSoftcapContainer);
                failstackContainer.appendChild(cronSelectorContainer);
                
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
                        className: 'input-group',
                        style: 'display: flex; align-items: center;'
                    }, [input]);
                    
                    // Only show cron checkbox for non-BASE levels (since BASE level can't downgrade)
                    // The currentLevel is the level before enhancement, targetLevel is after
                    const isFirstLevel = (i === 0);
                    const isBaseLevel = (currentLevel === 'BASE');
                    
                    if (!isBaseLevel) {
                        // Create container for cron checkbox and type selection
                        const cronLevelContainer = createElement('div', {
                            className: 'cron-level-container',
                            style: 'display: flex; align-items: center; margin-left: 10px; padding: 2px 5px; border-radius: 4px; background-color: rgba(155, 89, 182, 0.1);'
                        });
                        
                        // Create cron checkbox (smaller with lightning bolt icon)
                        const cronCheckbox = createElement('input', {
                            type: 'checkbox',
                            id: `use-cron-level-${i}`,
                            className: 'use-cron-level'
                        });
                        
                        // Initialize cron checkbox - auto-check if it's the first level and not BASE
                        if (isFirstLevel && !isBaseLevel) {
                            cronCheckbox.checked = true;
                            cronCheckbox.disabled = true; // Make it non-deselectable for required levels
                            cronCheckbox.dataset.cronType = 'vendor'; // Default to vendor cron
                            // Add visual indicator that this is mandatory
                            cronLevelContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                            cronLevelContainer.style.border = '1px solid #3498db';
                        } else {
                            cronCheckbox.checked = false;
                        }
                        
                        // Add event listener to mark when checkbox is manually changed (only for non-disabled checkboxes)
                        if (!cronCheckbox.disabled) {
                            cronCheckbox.addEventListener('change', function() {
                                this.dataset.manuallyChanged = 'true';
                            });
                        }
                        
                        // Create label for cron checkbox
                        const cronLabelText = (isFirstLevel && !isBaseLevel) ? '⚡ Cron (Required)' : '⚡ Cron';
                        const cronLabel = createElement('label', {
                            for: `use-cron-level-${i}`,
                            className: 'per-level-cron-label',
                            style: 'margin-right: 10px;'
                        }, cronLabelText);
                        
                        // Create container for radio buttons
                        const radioContainer = createElement('div', {
                            className: 'cron-type-container',
                            style: 'display: flex; align-items: center;'
                        });
                        
                        // Create vendor cron radio button
                        const vendorRadio = createElement('input', {
                            type: 'radio',
                            name: `cron-type-${i}`,
                            id: `vendor-cron-${i}`,
                            value: 'vendor',
                            className: 'cron-type-radio vendor'
                        });
                        
                        // Create label for vendor radio button
                        const vendorLabel = createElement('label', {
                            for: `vendor-cron-${i}`,
                            style: 'margin-right: 10px; color: #3498db; font-size: 0.9em;'
                        }, 'Vendor (3M)');
                        
                        // Create costume cron radio button
                        const costumeRadio = createElement('input', {
                            type: 'radio',
                            name: `cron-type-${i}`,
                            id: `costume-cron-${i}`,
                            value: 'costume',
                            className: 'cron-type-radio costume'
                        });
                        
                        // Create label for costume radio button
                        const costumeLabel = createElement('label', {
                            for: `costume-cron-${i}`,
                            style: 'color: #9b59b6; font-size: 0.9em;'
                        }, 'Costume (2.2M)');
                        
                        // Initialize radio buttons - auto-select vendor for first level if not BASE
                        if (isFirstLevel && !isBaseLevel) {
                            // Use unified system to enable with vendor selection
                            setRadioButtonState(vendorRadio, costumeRadio, true, 'vendor');
                        } else {
                            // Use unified system to enable with no selection
                            setRadioButtonState(vendorRadio, costumeRadio, true, null);
                        }
                        
                        // Create vendor and costume radio button containers with proper CSS classes
                        const vendorRadioContainer = createElement('div', {
                            className: 'cron-type-radio'
                        });
                        
                        const costumeRadioContainer = createElement('div', {
                            className: 'cron-type-radio'
                        });
                        
                        // Add event listeners to radios to update the checkbox data attribute
                        vendorRadio.addEventListener('change', function() {
                            if (this.checked) {
                                cronCheckbox.dataset.cronType = 'vendor';
                                cronCheckbox.checked = true;
                                
                                // Update background color to vendor blue
                                cronLevelContainer.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
                            }
                        });
                        
                        costumeRadio.addEventListener('change', function() {
                            if (this.checked) {
                                cronCheckbox.dataset.cronType = 'costume';
                                cronCheckbox.checked = true;
                                
                                // Update background color to costume purple
                                cronLevelContainer.style.backgroundColor = 'rgba(155, 89, 182, 0.2)';
                            }
                        });
                        
                        // Add event listener to checkbox to ensure radios match checkbox state (only for non-disabled checkboxes)
                        if (!cronCheckbox.disabled) {
                            cronCheckbox.addEventListener('change', function() {
                                if (!this.checked) {
                                    // Use unified system to disable radios
                                    setRadioButtonState(vendorRadio, costumeRadio, false);
                                    // Remove cron type data
                                    this.dataset.cronType = '';
                                    // Reset background color
                                    cronLevelContainer.style.backgroundColor = 'rgba(155, 89, 182, 0.1)';
                                } else {
                                    // Use unified system to enable radios with vendor default
                                    const currentSelection = vendorRadio.checked ? 'vendor' : (costumeRadio.checked ? 'costume' : 'vendor');
                                    setRadioButtonState(vendorRadio, costumeRadio, true, currentSelection);
                                    this.dataset.cronType = currentSelection;
                                    // Set background color based on selection
                                    const color = currentSelection === 'vendor' ? 'rgba(52, 152, 219, 0.2)' : 'rgba(155, 89, 182, 0.2)';
                                    cronLevelContainer.style.backgroundColor = color;
                                }
                            });
                        }
                        
                        // Add radio buttons to their containers
                        vendorRadioContainer.appendChild(vendorRadio);
                        vendorRadioContainer.appendChild(vendorLabel);
                        costumeRadioContainer.appendChild(costumeRadio);
                        costumeRadioContainer.appendChild(costumeLabel);
                        
                        // Add radio containers to main container
                        radioContainer.appendChild(vendorRadioContainer);
                        radioContainer.appendChild(costumeRadioContainer);
                        
                        // Enable radio containers if first level is auto-checked
                        if (isFirstLevel && !isBaseLevel && cronCheckbox.checked) {
                            vendorRadioContainer.classList.add('enabled');
                            costumeRadioContainer.classList.add('enabled');
                        }
                        
                        // Add elements to cron container
                        cronLevelContainer.appendChild(cronCheckbox);
                        cronLevelContainer.appendChild(cronLabel);
                        cronLevelContainer.appendChild(radioContainer);
                        
                        // Add cron level container to input group
                        inputGroup.appendChild(cronLevelContainer);
                    }
                    
                    // Create label for failstack
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
        const originalMemFragsCountArray = []; // New array for original fragment counts
        const recoveryCostArray = []; // New array for recovery costs
        const recoveryFailstackCostArray = []; // New array for recovery failstack costs
        const cronCostArray = [];
        const cronStoneCountArray = [];
        let totalAttempts = 0;
        let totalCostValue = 0;
        let totalMemFragsCost = 0;
        let totalMemFragsCount = 0;
        let totalOriginalMemFragsCount = 0; // New total for original fragment counts
        let totalRecoveryCost = 0; // New total for recovery costs
        let totalRecoveryFailstackCost = 0; // New total for recovery failstack costs
        let totalCronCost = 0;
        let totalCronCount = 0;
        
        // Check if we're using memory fragments and artisan's memory
        const useMemFrags = useMemFragsCheckbox && useMemFragsCheckbox.checked;
        const useArtisan = useArtisanMemoryCheckbox && useArtisanMemoryCheckbox.checked;
        
        // Check if we're including failstack costs
        const includeFailstackCosts = includeFailstackCostCheckbox && includeFailstackCostCheckbox.checked;
        
        // Arrays to track which levels use cron stones
        const useCronPerLevelArray = [];
        
        // Calculate for each enhancement step
        for (let index = 0; index < failstacks.length; index++) {
            const fs = failstacks[index];
            const levels = enhancementLevels[item];
            const startIndex = levels.indexOf(startLevel);
            const currentLevel = levels[startIndex + index];
            
            // Check if the per-level cron checkbox is checked
            const perLevelCronCheckbox = document.getElementById(`use-cron-level-${index}`);
            const perLevelCronEnabled = perLevelCronCheckbox ? perLevelCronCheckbox.checked : false;
            
            // First level (index 0) behaves differently since it can't downgrade
            const isFirstLevel = (index === 0);
            // BASE level cannot downgrade, so no need for cron
            const isBaseLevel = (currentLevel === 'BASE');
            
            // Determine if we should use cron stones for this specific level
            let useCronForThisLevel = false;
            
            if (!isBaseLevel) {
                // Check per-level cron checkbox first if it exists
                if (perLevelCronCheckbox) {
                    // Use the per-level checkbox value
                    useCronForThisLevel = perLevelCronEnabled;
                }
            }
            useCronPerLevelArray.push(useCronForThisLevel);
            
            // Calculate success chance using the utility function
            const successChance = calculateSuccessChance(item, currentLevel, fs);
            const failChance = 100 - successChance; // The chance of failure
            
            // Get the base chance for this item level to calculate exact attempts when using cron stones
            const baseChance = enhancementItemRequirements[item]?.[currentLevel]?.enhancementData?.baseChance || 0;
            
            // Calculate expected attempts
            let expectedAttempts = 0;
            let rawAttempts = 100 / successChance; // Standard attempt calculation
            
            // Special handling for Preonne which has fixed success rates
            if (item === 'Preonne') {
                if (useCronForThisLevel) {
                    // For Preonne with cron stones, use simple formula
                    expectedAttempts = 100 / baseChance;
                } else {
                    // For Preonne without cron stones, use standard calculation
                    expectedAttempts = rawAttempts;
                }
                console.log(`Preonne Level ${currentLevel}: Using fixed rate of ${baseChance}%, result: ${expectedAttempts.toFixed(2)} attempts`);
            }
            // Normal items with variable success rates based on failstacks
            else if (useCronForThisLevel) {
                // Calculate exact average attempts with dynamic failstack increments
                expectedAttempts = calculateExactAverageAttempts(baseChance, fs);
                console.log(`Level ${currentLevel}: Using exact calculation with base rate ${baseChance} and initial FS ${fs}, result: ${expectedAttempts.toFixed(2)} attempts`);
            } else {
                // Use standard calculation when not using cron stones
                expectedAttempts = rawAttempts;
            }
            
            // Get the cost for this attempt (asynchronously) - use cron based on per-level decision
            // For Artisan's Memory, use the checkbox from the calculator tab
            const useArtisanForCalculator = useArtisanMemoryCheckbox && useArtisanMemoryCheckbox.checked;
            
            // Determine cron type for this level based on the checkbox data attribute
            let isUsingCostumeCronForThisLevel = null;
            if (useCronForThisLevel && perLevelCronCheckbox && perLevelCronCheckbox.dataset.cronType) {
                isUsingCostumeCronForThisLevel = perLevelCronCheckbox.dataset.cronType === 'costume';
            }
            
            const costDetails = await calculateAttemptCost(
                item, 
                currentLevel, 
                useCronForThisLevel,
                useMemFrags,
                isUsingCostumeCronForThisLevel, // Pass the specific cron type for this level
                useArtisanForCalculator // Explicitly pass Artisan's Memory setting
            );
            
            // Calculate total cost for this enhancement level
            let levelCost = 0;
            let levelMemFragsCost = 0;
            let levelMemFragsCount = 0;
            let levelRecoveryCost = 0; // Track recovery cost separately for display
            let levelRecoveryFailstackCost = 0; // Track recovery failstack cost separately
            
            if (!useCronForThisLevel && currentLevel !== 'BASE') {
                // When not using cron stones and item is not at BASE level,
                // each failure causes a downgrade
                // This means additional attempts and materials will be needed
                
                // The expected number of downgrades per success
                const expectedDowngrades = failChance / successChance;
                
                // We need to calculate the full cost of bringing an item back up after downgrade
                if (index > 0) {
                    // Cost of the current level attempts (materials only, no memory fragments yet)
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
                        // Use the same logic as the main enhancement level - check per-level checkbox
                        const recoveryLevelCronCheckbox = document.getElementById(`use-cron-level-${prevIdx}`);
                        const recoveryLevelCronEnabled = recoveryLevelCronCheckbox ? recoveryLevelCronCheckbox.checked : false;
                        const useCronForRecovery = recoveryLevelCronEnabled;
                        
                        // Determine cron type for this recovery level
                        let isUsingCostumeCronForRecovery = null;
                        if (useCronForRecovery && recoveryLevelCronCheckbox && recoveryLevelCronCheckbox.dataset.cronType) {
                            isUsingCostumeCronForRecovery = recoveryLevelCronCheckbox.dataset.cronType === 'costume';
                        }
                        
                        // Get cost of one attempt at this level - using the per-level cron logic
                        // Use the same Artisan's Memory setting as the main calculation
                        const levelCostDetails = await calculateAttemptCost(
                            item, 
                            prevLevel, 
                            useCronForRecovery, 
                            useMemFrags, 
                            isUsingCostumeCronForRecovery, // Pass the specific cron type
                            useArtisanForCalculator // Use same Artisan setting
                        );
                        
                        // Calculate success rate for this level
                        const levelSuccessChance = calculateSuccessChance(item, prevLevel, prevFS);
                        const levelExpectedAttempts = 100 / levelSuccessChance;
                        
                        // Use a simpler recovery multiplier that doesn't grow exponentially
                        // Only apply the expected downgrades for the immediate previous level
                        const currentRecoveryMultiplier = (prevIdx === previousLevels.length - 1) ? recoveryCostMultiplier : recoveryCostMultiplier * 0.5;
                        
                        // Total cost at this level considering how many times we need to go through it
                        const levelTotalCost = levelCostDetails.totalCost * levelExpectedAttempts * currentRecoveryMultiplier;
                        downgradeCost += levelTotalCost;
                        
                        // If we're calculating memory fragment costs
                        if (useMemFrags) {
                            const levelMemCost = levelCostDetails.memFragsCost * (levelExpectedAttempts - 1) * currentRecoveryMultiplier; // -1 for successful attempt
                            const levelMemCount = levelCostDetails.memFragsCount * (levelExpectedAttempts - 1) * currentRecoveryMultiplier;
                            downgradedMemFragsCost += levelMemCost;
                            downgradedMemFragsCount += levelMemCount;
                        }
                        
                        // Track cron stone usage in recovery attempts
                        if (useCronForRecovery) {
                            const cronStoneCount = enhancementItemRequirements[item]?.[prevLevel]?.cronStones || 0;
                            const levelCronCount = cronStoneCount * levelExpectedAttempts * currentRecoveryMultiplier;
                            
                            // Check which type of cron stones we're using for this recovery level
                            let cronPrice;
                            if (isUsingCostumeCronForRecovery) {
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
                        
                        // Track failstack costs for recovery attempts if enabled
                        if (includeFailstackCosts && prevFS > 0) {
                            const recoveryFailstackCostData = await calculateFailstackBuildCost(prevFS);
                            const recoveryFailstackCost = recoveryFailstackCostData.totalCost * levelExpectedAttempts * currentRecoveryMultiplier;
                            
                            // Add to recovery failstack cost for this level
                            levelRecoveryFailstackCost += recoveryFailstackCost;
                            
                            console.log(`Adding recovery failstack costs for ${prevLevel} (FS ${prevFS}): ${Math.round(recoveryFailstackCost).toLocaleString()} Silver`);
                        }
                        
                        // Don't exponentially increase the multiplier - use a more conservative approach
                        // This prevents unrealistic explosion of recovery costs
                    }
                    
                    // Store recovery cost separately for display purposes
                    levelRecoveryCost = downgradeCost;
                    
                    // Calculate memory fragment costs for failures
                    if (useMemFrags) {
                        // Memory fragments needed for current level failures
                        const currentLevelMemFragsCost = costDetails.memFragsCost * (expectedAttempts - 1); // -1 because we succeed once
                        const currentLevelMemFragsCount = costDetails.memFragsCount * (expectedAttempts - 1);
                        
                        levelMemFragsCost = currentLevelMemFragsCost + downgradedMemFragsCost;
                        levelMemFragsCount = currentLevelMemFragsCount + downgradedMemFragsCount;
                    }
                    
                    // Total cost is current level attempts + downgrade recovery + memory fragments
                    levelCost = currentLevelAttemptCost + downgradeCost + levelMemFragsCost;
                    
                    console.log(`Including complete downgrade recovery cost for ${currentLevel}: ${downgradeCost.toLocaleString()}`);
                    console.log(`  - ${expectedDowngrades.toFixed(2)} expected initial downgrades`);
                } else {
                    // First level enhancement can't be downgraded below start level
                    levelCost = costDetails.totalCost * expectedAttempts;
                    
                    // Calculate memory fragment costs for failures at this level
                    if (useMemFrags) {
                        levelMemFragsCost = costDetails.memFragsCost * (expectedAttempts - 1); // -1 because we succeed once
                        levelMemFragsCount = costDetails.memFragsCount * (expectedAttempts - 1);
                        levelCost += levelMemFragsCost; // Add memory fragment costs to level cost
                    }
                    
                    // No recovery cost for first level
                    levelRecoveryCost = 0;
                }
            } else {
                // With cron stones, no downgrades occur but durability is still lost
                levelCost = costDetails.totalCost * expectedAttempts;
                
                // Store cron stone details
                const cronCost = costDetails.cronCost * expectedAttempts;
                const cronStoneCount = enhancementItemRequirements[item]?.[currentLevel]?.cronStones || 0;
                
                // Memory fragment costs still apply as durability is lost with each failed attempt
                if (useMemFrags) {
                    levelMemFragsCost = costDetails.memFragsCost * (expectedAttempts - 1); // -1 because successful attempt doesn't lose durability
                    levelMemFragsCount = costDetails.memFragsCount * (expectedAttempts - 1);
                    levelCost += levelMemFragsCost; // Add memory fragment costs to level cost
                } else {
                    levelMemFragsCost = 0;
                    levelMemFragsCount = 0;
                }
                
                // No recovery cost when using cron stones
                levelRecoveryCost = 0;
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
            if (!useCronForThisLevel && currentLevel !== 'BASE' && index > 0) {
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
            memFragsCountArray.push(Math.round(levelMemFragsCount)); // Round for consistency with totals
            
            // Store recovery cost for this level
            recoveryCostArray.push(levelRecoveryCost);
            totalRecoveryCost += levelRecoveryCost;
            
            // Store recovery failstack cost for this level
            recoveryFailstackCostArray.push(levelRecoveryFailstackCost);
            totalRecoveryFailstackCost += levelRecoveryFailstackCost;
            
            // Track the original memory fragment count (without Artisan's effect)
            // Always use the originalFragCount from costDetails, which is calculated correctly
            // regardless of whether Artisan's Memory is used
            // Only count failed attempts since successful attempts don't lose durability
            let levelOriginalMemFragsCount = costDetails.originalFragCount * (expectedAttempts - 1);
            originalMemFragsCountArray.push(Math.round(levelOriginalMemFragsCount)); // Round for consistency with totals
            
            totalMemFragsCost += levelMemFragsCost;
            totalMemFragsCount += Math.round(levelMemFragsCount); // Round individual levels to avoid cumulative rounding errors
            totalOriginalMemFragsCount += Math.round(levelOriginalMemFragsCount); // Round individual levels to avoid cumulative rounding errors
            
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

        // Calculate failstack costs if checkbox is enabled
        let totalFailstackCost = 0;
        let failstackCostBreakdown = null;
        const failstackCostPerLevel = [];
        const failstackCostBreakdownPerLevel = [];
        
        if (includeFailstackCosts) {
            // Calculate the cost for each individual failstack level used
            // This represents the actual cost since you need to build failstacks for each enhancement level
            for (let i = 0; i < failstacks.length; i++) {
                const fs = failstacks[i];
                
                if (fs > 0) {
                    const failstackCostData = await calculateFailstackBuildCost(fs);
                    failstackCostPerLevel.push(failstackCostData.totalCost);
                    failstackCostBreakdownPerLevel.push(failstackCostData.breakdown);
                    totalFailstackCost += failstackCostData.totalCost; // Sum all individual costs
                } else {
                    failstackCostPerLevel.push(0);
                    failstackCostBreakdownPerLevel.push(null);
                }
            }
            
            // For the overall breakdown display, use the maximum failstack data
            const maxFailstack = Math.max(...failstacks);
            if (maxFailstack > 0) {
                const maxFailstackCostData = await calculateFailstackBuildCost(maxFailstack);
                failstackCostBreakdown = maxFailstackCostData.breakdown;
            }
            
            // Add recovery failstack cost to total failstack cost
            totalFailstackCost += totalRecoveryFailstackCost;
            
            // Add failstack cost to final total
            finalTotalCost += totalFailstackCost;
            
            // Add failstack costs to individual level costs for display purposes
            for (let i = 0; i < costPerLevelArray.length; i++) {
                if (failstackCostPerLevel[i] > 0) {
                    costPerLevelArray[i] += failstackCostPerLevel[i];
                }
            }
        } else {
            // Fill arrays with zeros if not including failstack costs
            for (let i = 0; i < failstacks.length; i++) {
                failstackCostPerLevel.push(0);
                failstackCostBreakdownPerLevel.push(null);
            }
        }

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
            totalMemFragsCount: totalMemFragsCount, // Already rounded at individual level
            originalMemFragsCount: originalMemFragsCountArray,
            totalOriginalMemFragsCount: totalOriginalMemFragsCount, // Already rounded at individual level
            recoveryCost: recoveryCostArray, // Recovery costs per level
            totalRecoveryCost: Math.round(totalRecoveryCost), // Total recovery cost
            recoveryFailstackCost: recoveryFailstackCostArray, // Recovery failstack costs per level
            totalRecoveryFailstackCost: Math.round(totalRecoveryFailstackCost), // Total recovery failstack cost
            cronCost: cronCostArray,
            cronStoneCount: cronStoneCountArray,
            totalCronCost: Math.round(totalCronCost),
            totalCronCount: Math.round(totalCronCount),
            includeMemFrags: useMemFrags,
            useCronStones: useCronPerLevelArray.some(value => value), // Check if any level uses cron stones
            useArtisanMemory: useArtisan,
            useCronPerLevel: useCronPerLevelArray, // Track which levels used cron stones
            includeFailstackCosts: includeFailstackCosts,
            totalFailstackCost: Math.round(totalFailstackCost),
            failstackCostBreakdown: failstackCostBreakdown,
            failstackCostPerLevel: failstackCostPerLevel.map(cost => Math.round(cost)),
            failstackCostBreakdownPerLevel: failstackCostBreakdownPerLevel
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
        costInfo.innerHTML = `<strong>Estimated Total Cost:</strong> ${results.totalCost.toLocaleString()} Silver`;
        
        // Always add cost breakdown section
        const costBreakdown = createElement('div', { className: 'cost-breakdown' });
        costBreakdown.style.marginLeft = '20px';
        costBreakdown.style.fontSize = '0.9em';
        costBreakdown.style.marginTop = '5px';
        
        // Start with material cost
        costBreakdown.innerHTML = `• <strong>Material Cost:</strong> ${Math.round(results.totalMaterialCost).toLocaleString()} Silver`;
        
        // Add recovery cost if any levels have recovery costs
        if (results.totalRecoveryCost && results.totalRecoveryCost > 0) {
            costBreakdown.innerHTML += `<br>• <strong>Recovery Cost:</strong> ${Math.round(results.totalRecoveryCost).toLocaleString()} Silver`;
        }
        
        // Check if any cron stones were used
        if (results.totalCronCount > 0) {
            // Calculate cron stones from direct enhancement and from recovery attempts
            const directEnhancementCronCount = results.cronStoneCount[0] > 0 ? Math.round(results.cronStoneCount[0]) : 0;
            const directEnhancementCronCost = results.cronCost[0] > 0 ? Math.round(results.cronCost[0]) : 0;
            
            // Calculate total cron cost from recovery attempts (difference between total and direct)
            const recoveryCronCount = Math.max(0, Math.round(results.totalCronCount - directEnhancementCronCount));
            const recoveryCronCost = Math.max(0, Math.round(results.totalCronCost - directEnhancementCronCost));
            
            // Show cron costs
            costBreakdown.innerHTML += `<br>• <strong>Total Cron Stone Usage:</strong> ${Math.round(results.totalCronCount).toLocaleString()} stones (${Math.round(results.totalCronCost).toLocaleString()} Silver)`;
        }
        
        // Add memory fragment information if included
        if (results.includeMemFrags) {
            if (useArtisanMemoryCheckbox && useArtisanMemoryCheckbox.checked) {
                // Use the total original fragments count that we now track separately
                // Display with proper rounding
                const originalFragCount = results.totalOriginalMemFragsCount;
                const memFragPrice = marketPrices[currentRegion][44195] || 0;
                
                // Recalculate the actual fragment count with Artisan's Memory using the proper formula
                // Integer division (whole part)
                const wholePart = Math.floor(originalFragCount / 5);
                // Remainder calculation
                const remainder = originalFragCount % 5;
                // Add the whole part plus the actual remainder value
                const artisanFragCount = wholePart + remainder;
                
                // Calculate costs based on the recalculated fragment count
                const artisanCost = artisanFragCount * memFragPrice;
                const originalCost = originalFragCount * memFragPrice;
                const savings = originalCost - artisanCost;
                
                costBreakdown.innerHTML += `<br>• <strong>Memory Fragments:</strong> ${artisanFragCount.toLocaleString()} fragments with Artisan's Memory (${Math.round(artisanCost).toLocaleString()} Silver)`;
                costBreakdown.innerHTML += `<br><span style="margin-left: 15px; font-size: 0.9em; color: #27ae60;">✓ Saved ~${Math.round(savings).toLocaleString()} Silver by using Artisan's Memory (reduced from ${originalFragCount.toLocaleString()} fragments)</span>`;
            } else {
                costBreakdown.innerHTML += `<br>• <strong>Memory Fragments:</strong> ${results.totalMemFragsCount.toLocaleString()} fragments (${Math.round(results.totalMemFragsCost).toLocaleString()} Silver)`;
            }
        }

        // Add failstack cost information if included
        if (results.includeFailstackCosts && results.totalFailstackCost > 0) {
            const directFailstackCost = results.totalFailstackCost - (results.totalRecoveryFailstackCost || 0);
            
            if (results.totalRecoveryFailstackCost && results.totalRecoveryFailstackCost > 0) {
                costBreakdown.innerHTML += `<br>• <strong>Failstack Building Cost:</strong> ${Math.round(directFailstackCost).toLocaleString()} Silver`;
                costBreakdown.innerHTML += `<br>• <strong>Recovery Failstack Building Cost:</strong> ${Math.round(results.totalRecoveryFailstackCost).toLocaleString()} Silver`;
            } else {
                costBreakdown.innerHTML += `<br>• <strong>Failstack Building Cost:</strong> ${Math.round(results.totalFailstackCost).toLocaleString()} Silver`;
            }
            // Note: Detailed breakdown is shown per enhancement level below
        }
        
        // Always add the cost breakdown to the cost info
        costInfo.appendChild(costBreakdown);
        
        const attemptsInfo = createElement('p', {}, '');
        
        // Always show the total attempts
        attemptsInfo.innerHTML = `<strong>Estimated Total Attempts:</strong> ${results.attemptsPrediction}`;
        
        // Show additional breakdown for recovery attempts if not using cron for any level
        if (!results.useCronStones) {
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
            if (results.useCronPerLevel[i]) {
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
            
            // Check if cron stones are used for this level
            const usingCron = results.useCronPerLevel[i];
            
            // Display direct attempts
            if (usingCron) {
                // When using cron stones, show exact calculation with failstack increments
                detailContent += `<span style="font-weight: bold;">Direct Attempts: ${results.expectedAttempts[i]}</span> <span style="color: #3498db;">(with +FS increments)</span> <span style="color: #777;">(${rawAttempts} raw)</span>`;
            } else {
                // When not using cron stones, just show standard calculation
                detailContent += `<span style="font-weight: bold;">Direct Attempts: ${results.expectedAttempts[i]}</span>`;
            }
            
            // Add recovery attempts if not using cron and recovery attempts exist
            if (!results.useCronPerLevel[i] && results.recoveryAttempts && results.recoveryAttempts[i] > 0) {
                detailContent += `, <span style="color: #e74c3c;">Recovery Attempts: ${results.recoveryAttempts[i].toFixed(2)}</span>`;
                
                // Calculate total attempts for this level
                const totalForLevel = parseFloat(results.expectedAttempts[i]) + parseFloat(results.recoveryAttempts[i]);
                detailContent += `, <span style="font-weight: bold;">Total: ${totalForLevel.toFixed(2)}</span>`;
            }
            
            detailContent += `, Total Cost: ${Math.round(results.costPerLevel[i]).toLocaleString()} Silver`;
            
            // Show the material cost
            detailContent += `<br><span style="margin-left: 15px; color: #2980b9;">• Material Cost: ${Math.round(results.materialsCost[i]).toLocaleString()} Silver</span>`;
            
            // Add memory fragment info if included
            if (results.includeMemFrags) {
                if (useArtisanMemoryCheckbox && useArtisanMemoryCheckbox.checked) {
                    // Get the original fragment count and recalculate with Artisan's Memory
                    const originalFragCount = Math.round(results.originalMemFragsCount[i]);
                    const memFragPrice = marketPrices[currentRegion][44195] || 0;
                    
                    // Recalculate the actual fragment count with Artisan's Memory
                    // Integer division (whole part)
                    const wholePart = Math.floor(originalFragCount / 5);
                    // Remainder calculation
                    const remainder = originalFragCount % 5;
                    // Add the whole part plus the actual remainder value
                    const artisanFragCount = wholePart + remainder;
                    
                    // Calculate cost based on the recalculated fragment count
                    const artisanCost = artisanFragCount * memFragPrice;
                    
                    detailContent += `<br><span style="margin-left: 15px; color: #9b59b6;">• Memory Fragments: ${artisanFragCount.toLocaleString()} fragments (${Math.round(artisanCost).toLocaleString()} Silver)</span>`;
                    detailContent += `<br><span style="margin-left: 30px; font-size: 0.85em; color: #9b59b6;">Would need ${originalFragCount.toLocaleString()} fragments without Artisan's Memory</span>`;
                } else {
                    detailContent += `<br><span style="margin-left: 15px; color: #9b59b6;">• Memory Fragments: ${Math.round(results.memFragsCount[i]).toLocaleString()} fragments (${Math.round(results.memFragsCost[i]).toLocaleString()} Silver)</span>`;
                }
            }

            // Add cron stone cost details if cron stones are used for this level
            if (results.useCronPerLevel && results.useCronPerLevel[i] && results.cronCost && results.cronCost[i] > 0) {
                // Special message for first level cron when not using cron for all levels
                if (i === 0 && !results.useCronStones) {
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

            // Add failstack cost info if included (moved to bottom section)
            if (results.includeFailstackCosts && results.failstackCostPerLevel && results.failstackCostPerLevel[i] > 0) {
                detailContent += `<br><span style="margin-left: 15px; color: #e67e22;">• Failstack Building Cost: ${results.failstackCostPerLevel[i].toLocaleString()} Silver</span>`;
                
                // Add detailed breakdown if available for this level
                if (results.failstackCostBreakdownPerLevel && results.failstackCostBreakdownPerLevel[i]) {
                    const breakdown = results.failstackCostBreakdownPerLevel[i];
                    let detailText = '<br><span style="margin-left: 30px; font-size: 0.8em; color: #e67e22;">';
                    
                    if (breakdown.freeFailstacks > 0) {
                        detailText += `${breakdown.freeFailstacks} free permanent FS`;
                    }
                    
                    if (breakdown.paidFailstacks > 0) {
                        if (breakdown.freeFailstacks > 0) detailText += ', ';
                        detailText += `${breakdown.paidFailstacks} paid permanent FS (${Math.round(breakdown.paidFailstackCost).toLocaleString()} Silver)`;
                    }
                    
                    if (breakdown.blackStoneCount > 0) {
                        if (breakdown.freeFailstacks > 0 || breakdown.paidFailstacks > 0) detailText += ', ';
                        detailText += `${breakdown.blackStoneCount} Black Stone (${Math.round(breakdown.blackStoneCost).toLocaleString()} Silver)`;
                    }
                    
                    if (breakdown.crystallizedDespairCount > 0) {
                        if (breakdown.freeFailstacks > 0 || breakdown.paidFailstacks > 0 || breakdown.blackStoneCount > 0) detailText += ', ';
                        detailText += `${breakdown.crystallizedDespairCount} Crystallized Despair (${Math.round(breakdown.crystallizedDespairCost).toLocaleString()} Silver)`;
                    }
                    
                    if (breakdown.originOfDarkHungerCount > 0) {
                        if (breakdown.freeFailstacks > 0 || breakdown.paidFailstacks > 0 || breakdown.blackStoneCount > 0 || breakdown.crystallizedDespairCount > 0) detailText += ', ';
                        detailText += `${breakdown.originOfDarkHungerCount} Origin of Dark Hunger (${Math.round(breakdown.originOfDarkHungerCost).toLocaleString()} Silver)`;
                    }
                    
                    detailText += '</span>';
                    detailContent += detailText;
                }
            }
            
            // Add recovery cost if this level has recovery costs (moved to bottom)
            if (results.recoveryCost && results.recoveryCost[i] > 0) {
                detailContent += `<br><span style="margin-left: 15px; color: #e74c3c;">• Recovery Cost: ${Math.round(results.recoveryCost[i]).toLocaleString()} Silver</span>`;
                detailContent += `<br><span style="margin-left: 30px; font-size: 0.85em; color: #e74c3c;">Cost to re-enhance after expected downgrades</span>`;
            }
            
            // Add recovery failstack cost if this level has recovery failstack costs (moved to bottom)
            if (results.includeFailstackCosts && results.recoveryFailstackCost && results.recoveryFailstackCost[i] > 0) {
                detailContent += `<br><span style="margin-left: 15px; color: #e74c3c;">• Recovery Failstack Building Cost: ${Math.round(results.recoveryFailstackCost[i]).toLocaleString()} Silver</span>`;
                detailContent += `<br><span style="margin-left: 30px; font-size: 0.85em; color: #e74c3c;">Cost to rebuild failstacks for recovery attempts</span>`;
            }
                                
            // Add note about downgrades if not using cron and not enhancing from BASE level
            if (!results.useCronPerLevel[i] && currentLevel !== 'BASE') {
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
        if (results.useCronStones) {
            // Determine the cron type based on the per-level settings
            // Since we can have mixed types (some levels using vendor, some using costume),
            // we'll just use generic language
            let cronType = "Cron Stones";
            note.innerHTML = `<strong>Note:</strong> These calculations include ${cronType} costs. Cron Stones prevent item downgrades but durability is still lost.<br>` +
                           '<strong>Failstack Increments:</strong> When using cron stones, the calculator simulates automatic failstack increments that would naturally occur from failed attempts.<br>' +
                           '<strong>• Direct Attempts:</strong> The expected number of attempts needed at each level (calculated using precise mathematical formulas).<br>' +
                           '<strong>• Recovery Attempts:</strong> Additional attempts needed to recover from downgrades after failures (with conservative cost modeling).<br>' +
                           '<strong>• Failstack Building Costs:</strong> Includes the cost of building required failstacks using Black Stones, Crystallized Despair, and Origin of Dark Hunger.<br>' +
                           '<strong>• Memory Fragment Costs:</strong> Durability repair costs with optional Artisan\'s Memory efficiency (when enabled).<br>' +
                           '<strong>• Total Per Level:</strong> Combined direct enhancement, recovery, and failstack building costs for each level.<br>' +
                           '<strong>• Overall Total:</strong> Comprehensive cost including all materials, failstacks, memory fragments, and recovery attempts across all levels.<br>' +
                           '<span style="color: #ff0000; font-weight: bold; font-size: 1.1em;">Important: Failstack building costs are included up to 316 FS. Higher failstacks may require additional cost calculations.</span>';
        } else {
            note.innerHTML = '<strong>Note:</strong> These calculations include comprehensive cost analysis for enhancement without Cron stones.<br>' +
                           '<strong>• Direct Attempts:</strong> The expected number of attempts needed at each level (calculated using precise mathematical formulas).<br>' +
                           '<strong>• Recovery Attempts:</strong> Additional attempts needed to recover from downgrades after failures (with conservative cost modeling).<br>' +
                           '<strong>• Failstack Building Costs:</strong> Includes the cost of building required failstacks using Black Stones, Crystallized Despair, and Origin of Dark Hunger.<br>' +
                           '<strong>• Memory Fragment Costs:</strong> Durability repair costs with optional Artisan\'s Memory efficiency (when enabled).<br>' +
                           '<strong>• Total Per Level:</strong> Combined direct enhancement, recovery, and failstack building costs for each level.<br>' +
                           '<strong>• Overall Total:</strong> Comprehensive cost including all materials, failstacks, memory fragments, and recovery attempts across all levels.<br>' +
                           '<span style="color: #ff0000; font-weight: bold; font-size: 1.1em;">Important: Failstack building costs are included up to 316 FS. Higher failstacks may require additional cost calculations.</span>';
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
            
            // For Preonne, we don't need failstack inputs
            let isValid = true;
            let failstackValues = [];
            
            if (selectedItem !== 'Preonne') {
                // Get all failstack inputs
                const failstackInputs = failstackContainer.querySelectorAll('input[type="number"]');
                
                // Validate inputs
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
                        failstackValues.push(parseInt(input.value));
                    }
                });
                
                if (!isValid) {
                    alert('Please enter a valid number for all failstack fields.');
                    resultsDiv.innerHTML = '';
                    return;
                }
            } else {
                // For Preonne, we'll use dummy failstack values (they won't be used)
                const levels = enhancementLevels[selectedItem];
                const startIndex = levels.indexOf(selectedStartLevel);
                const targetIndex = levels.indexOf(selectedTargetLevel);
                const enhancementCount = targetIndex - startIndex;
                
                // Fill with zeros since failstacks don't matter for Preonne
                failstackValues = new Array(enhancementCount).fill(0);
            }
            
            try {
                // Perform calculation (asynchronously)
                const results = await calculateEnhancement(selectedItem, selectedStartLevel, selectedTargetLevel, failstackValues);
                
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
            
            // For Preonne, we need to handle the failstack field specially
            if (selectedItem === 'Preonne') {
                // Show a message about Preonne having fixed success rates
                if (simFailstack) {
                    simFailstack.disabled = true;
                    simFailstack.value = '';
                    simFailstack.placeholder = 'Not used for Preonne';
                }
                
                if (simUseRecommendedFS) {
                    simUseRecommendedFS.disabled = true;
                    simUseRecommendedFS.checked = false;
                }
                
                // Show informational message
                const fsContainer = document.getElementById('sim-failstack-container');
                if (fsContainer) {
                    const infoElement = document.getElementById('preonne-sim-info');
                    if (!infoElement) {
                        const infoMessage = createElement('div', {
                            id: 'preonne-sim-info',
                            style: {
                                padding: '8px',
                                margin: '8px 0',
                                backgroundColor: '#222',
                                color: '#ff5555',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                border: '1px solid #444'
                            }
                        }, 'Preonne has fixed enhancement chances regardless of failstacks.');
                        
                        fsContainer.appendChild(infoMessage);
                    }
                }
            } else {
                // For other items, enable failstack fields
                if (simFailstack) {
                    simFailstack.disabled = false;
                    simFailstack.placeholder = 'Enter failstack value';
                }
                
                if (simUseRecommendedFS) {
                    simUseRecommendedFS.disabled = false;
                }
                
                // Remove any Preonne info message if it exists
                const infoElement = document.getElementById('preonne-sim-info');
                if (infoElement) {
                    infoElement.remove();
                }
            }
            
            if (selectedItem) {
                // Enable and populate target level dropdown
                simTargetLevel.disabled = false;
                const levels = enhancementLevels[selectedItem];
                
                // Skip BASE level as it can't be a target
                for (let i = 1; i < levels.length; i++) {
                    simTargetLevel.appendChild(createOption(levels[i], levels[i]));
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
        const isPreonne = simItemSelect.value === 'Preonne';
        
        // For Preonne, we don't need to validate the failstack field
        const failstackEntered = isPreonne ? true : (simFailstack.value !== '' && !isNaN(parseInt(simFailstack.value)));
        
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
                4987,  // Concentrated Magical Black Gem
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
    async function runSimulation(item, startLevel, targetLevel, startingFS, attempts, useCron, useMemFrags, praygeOption, isUsingCostumeCron = false, useArtisan = false, includeFailstackCosts = false) {
        // Check if per-level cron settings are available for this item
        const useCronPerLevel = [];
        const cronTypePerLevel = [];
        const levels = enhancementLevels[item];
        const startIndex = levels.indexOf(startLevel);
        const targetIndex = levels.indexOf(targetLevel);
        
        // If we have per-level cron checkboxes, use those settings instead of global useCron
        let hasPerLevelCron = false;
        for (let i = 0; i < (targetIndex - startIndex); i++) {
            const perLevelCronCheckbox = document.getElementById(`use-cron-level-${i}`);
            if (perLevelCronCheckbox) {
                hasPerLevelCron = true;
                useCronPerLevel.push(perLevelCronCheckbox.checked);
                cronTypePerLevel.push(perLevelCronCheckbox.dataset.cronType === 'costume');
            } else {
                // If no per-level checkbox, use the global setting
                useCronPerLevel.push(useCron);
                cronTypePerLevel.push(isUsingCostumeCron);
            }
        }
        
        // If we don't have any per-level settings, just use the global setting
        const usePerLevelSettings = hasPerLevelCron;
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
            memFragsCount: 0,  // Track actual memory fragment count
            failstackCost: 0,  // Track failstack building cost
            attemptLog: [],
            praygeOption: praygeOption, // Track which streamer the user prayed to
            isUsingCostumeCron: isUsingCostumeCron, // Track if using costume cron stones
            useArtisan: useArtisan, // Track if using Artisan's Memory
            includeFailstackCosts: includeFailstackCosts // Track if including failstack costs
        };
        
        // Run the simulation for the specified number of attempts
        let currentFS = startingFS;
        let currentEnhancementIndex = 0; // Track which level we're currently enhancing
        
        // Store the durability loss per attempt and mem frags per durability for later calculations
        results.durabilityLossPerAttempt = enhancementItemRequirements[item]?.durabilityLoss || 0;
        results.memFragPerDurability = enhancementItemRequirements[item]?.memFragPerDurability || 1;
        
        // Calculate the cost once for all attempts since they're all for the same level transition
        // Use per-level cron settings if available, otherwise use the global settings
        let currentUseCron = usePerLevelSettings && useCronPerLevel.length > 0 ? useCronPerLevel[0] : useCron;
        let currentCronType = usePerLevelSettings && cronTypePerLevel.length > 0 ? cronTypePerLevel[0] : isUsingCostumeCron;
        
        // For simulation, calculate base cost WITHOUT memory fragments (since they're only used on failure)
        const baseAttemptCost = await calculateAttemptCost(item, startLevel, currentUseCron, false, currentCronType, useArtisan);
        
        // Calculate memory fragment cost separately (only used on failure)
        let memFragCostPerFailure = 0;
        let memFragCountPerFailure = 0;
        if (useMemFrags) {
            const memFragOnlyData = await calculateAttemptCost(item, startLevel, false, true, false, useArtisan);
            memFragCostPerFailure = memFragOnlyData.memFragsCost;
            memFragCountPerFailure = memFragOnlyData.memFragsCount;
        }
        
        // Calculate failstack cost per attempt if enabled (before the simulation loop)
        let failstackCostPerAttempt = 0;
        if (includeFailstackCosts && startingFS > 0) {
            const failstackCostData = await calculateFailstackBuildCost(startingFS);
            results.failstackCost = failstackCostData.totalCost;
            results.totalCost += results.failstackCost;
            
            // Calculate failstack cost per attempt for individual attempt cost display
            failstackCostPerAttempt = results.failstackCost / attempts;
        }
        
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
            } else if (praygeOption === 'blue') {
                // Blue's Pay2Win enhancement blessing - modifier based on payment amount
                const paymentAmount = window.bluePaymentAmount || 0;
                let modifier = 1.0; // Default multiplier
                
                if (paymentAmount < 100) {
                    // Less than $100: Very low success chance
                    modifier = 0.1;
                    streamEffect = '-Blue (Broke)';
                } else if (paymentAmount >= 100 && paymentAmount <= 150) {
                    // $100-$150: Reduced success chance
                    modifier = 0.7;
                    streamEffect = '-Blue (Poor)';
                } else if (paymentAmount >= 151 && paymentAmount <= 200) {
                    // $151-$200: Normal success chance
                    modifier = 1.0;
                    streamEffect = '=Blue (Balanced)';
                } else if (paymentAmount >= 201 && paymentAmount <= 400) {
                    // $201-$400: Enhanced success chance
                    modifier = 1.3;
                    streamEffect = '+Blue (Lucky)';
                } else if (paymentAmount > 400) {
                    // $401+: Greatly enhanced success chance
                    modifier = 1.6;
                    streamEffect = '+Blue (WHALE)';
                }
                
                successChance = Math.min(Math.max(successChance * modifier, 0.01), 90);
            }
            
            // Use the pre-calculated cost (materials + cron stones, but NOT memory fragments)
            const totalAttemptCost = baseAttemptCost.totalCost;
            results.totalCost += totalAttemptCost;
            results.materialsCost += baseAttemptCost.materialsCost;
            results.cronCost += baseAttemptCost.cronCost;
            // Note: Memory fragment costs are only added on failure (below)
            
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
                    cost: totalAttemptCost + failstackCostPerAttempt // Add proportional failstack cost
                });
                
                // Reset failstack after successful attempt to simulate starting a new enhancement
                currentFS = startingFS;
                
                // Move to the next enhancement level
                currentEnhancementIndex++;
                
                // Update the cron settings for the next level if we're using per-level settings
                if (usePerLevelSettings && currentEnhancementIndex < useCronPerLevel.length) {
                    currentUseCron = useCronPerLevel[currentEnhancementIndex];
                    currentCronType = cronTypePerLevel[currentEnhancementIndex];
                }
            } else {
                results.failures++;
                
                // Memory fragments are only consumed on failure (when durability is lost)
                results.memFragsCost += memFragCostPerFailure;
                results.memFragsCount += memFragCountPerFailure;
                
                // Total cost for this failed attempt includes memory fragments
                const failedAttemptCost = totalAttemptCost + memFragCostPerFailure;
                results.totalCost += memFragCostPerFailure; // Add memory fragment cost to total
                
                results.attemptLog.push({
                    attempt: i + 1,
                    failstack: currentFS,
                    successChance: successChance.toFixed(3),
                    originalChance: originalChance.toFixed(3),
                    streamEffect: streamEffect,
                    result: 'FAIL',
                    cost: failedAttemptCost + failstackCostPerAttempt // Includes memory fragments and proportional failstack cost
                });
                
                // Increase failstack automatically when cron stones are used
                let useCronForThisAttempt = useCron;
                if (usePerLevelSettings && currentEnhancementIndex < useCronPerLevel.length) {
                    useCronForThisAttempt = useCronPerLevel[currentEnhancementIndex];
                }
                
                if (useCronForThisAttempt) {
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
            } else if (results.praygeOption === "blue") {
                const paymentAmount = window.bluePaymentAmount || 0;
                let bannerText = '';
                let bannerColor = '';
                let textColor = '#fff';
                
                if (paymentAmount < 100) {
                    bannerColor = "#ff4757"; // Red
                    bannerText = `💸 Blue says: "You're broke! ($${paymentAmount})" 💸`;
                } else if (paymentAmount <= 150) {
                    bannerColor = "#ffa502"; // Orange
                    bannerText = `💰 Blue says: "Getting there... ($${paymentAmount})" 💰`;
                } else if (paymentAmount <= 200) {
                    bannerColor = "#2ed573"; // Green
                    bannerText = `💎 Blue says: "Balanced payment! ($${paymentAmount})" 💎`;
                } else if (paymentAmount <= 400) {
                    bannerColor = "#3742fa"; // Blue
                    bannerText = `🚀 Blue says: "Lucky spender! ($${paymentAmount})" 🚀`;
                } else {
                    bannerColor = "#a55eea"; // Purple
                    textColor = "#fff";
                    bannerText = `👑 Blue says: "WHALE DETECTED! ($${paymentAmount})" 👑`;
                }
                
                banner.style.backgroundColor = bannerColor;
                banner.style.color = textColor;
                banner.style.boxShadow = `0 0 10px ${bannerColor}`;
                banner.innerHTML = bannerText;
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
        
        // Check if Artisan's Memory was used in the simulation (get it from the results)
        const isUsingArtisan = results.useArtisan;
        
        if (isUsingArtisan && results.memFragsCost > 0) {
            // Calculate what memory fragments would have cost without Artisan's Memory
            const memFragPrice = marketPrices[currentRegion][44195] || 0;
            // For the items in the simulation, we need to calculate total durability loss
            // and directly calculate what it would have cost without Artisan's Memory
            const durabilityPerAttempt = results.durabilityLossPerAttempt || enhancementItemRequirements[results.item]?.durabilityLoss || 0;
            const memFragPerDurability = results.memFragPerDurability || enhancementItemRequirements[results.item]?.memFragPerDurability || 1;
            // Total durability loss across all failures
            const totalDurabilityLoss = durabilityPerAttempt * results.failures;
            // Calculate fragments needed without Artisan's Memory (directly using the durability formula)
            const originalFragCount = Math.ceil(totalDurabilityLoss / memFragPerDurability);
            
            // Recalculate the actual fragment count with Artisan's Memory
            // Integer division (whole part)
            const wholePart = Math.floor(originalFragCount / 5);
            // Remainder calculation
            const remainder = originalFragCount % 5;
            // Add the whole part plus the actual remainder value
            const artisanFragCount = wholePart + remainder;
            
            // Calculate costs based on the recalculated fragment count
            const artisanCost = artisanFragCount * memFragPrice;
            const originalCost = originalFragCount * memFragPrice;
            const savings = originalCost - artisanCost;
            
            let breakdownHTML = `
                <div><strong>Materials:</strong> ${results.materialsCost.toLocaleString()} Silver</div>
                <div><strong>Cron Stones:</strong> ${results.cronCost.toLocaleString()} Silver ${results.cronCost > 0 ? `<span style="color: #888; font-style: italic; font-size: 0.9em;">(${cronTypeText})</span>` : ''}</div>
                <div><strong>Memory Fragments:</strong> ${artisanFragCount.toLocaleString()} fragments with Artisan's Memory (${artisanCost.toLocaleString()} Silver)</div>
                <div style="margin-left: 20px; color: #27ae60; font-size: 0.9em;">✓ Saved ~${savings.toLocaleString()} Silver (reduced from ${originalFragCount} fragments)</div>`;
            
            // Add failstack cost if included
            if (results.includeFailstackCosts && results.failstackCost > 0) {
                breakdownHTML += `<div><strong>Failstack Building:</strong> ${results.failstackCost.toLocaleString()} Silver</div>`;
            }
            
            breakdownHTML += `<div><em>Average Cost Per Attempt:</em> ${Math.round(results.totalCost / results.attempts).toLocaleString()} Silver</div>`;
            
            elements[4].innerHTML = breakdownHTML;
        } else {
            let breakdownHTML = `
                <div><strong>Materials:</strong> ${results.materialsCost.toLocaleString()} Silver</div>
                <div><strong>Cron Stones:</strong> ${results.cronCost.toLocaleString()} Silver ${results.cronCost > 0 ? `<span style="color: #888; font-style: italic; font-size: 0.9em;">(${cronTypeText})</span>` : ''}</div>
                <div><strong>Memory Fragments:</strong> ${results.memFragsCost.toLocaleString()} Silver</div>`;
            
            // Add failstack cost if included
            if (results.includeFailstackCosts && results.failstackCost > 0) {
                breakdownHTML += `<div><strong>Failstack Building:</strong> ${results.failstackCost.toLocaleString()} Silver</div>`;
            }
            
            breakdownHTML += `<div><em>Average Cost Per Attempt:</em> ${Math.round(results.totalCost / results.attempts).toLocaleString()} Silver</div>`;
            
            elements[4].innerHTML = breakdownHTML;
        }
        
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
                    // Handle different streamer effects
                    if (log.streamEffect.includes('MrRapolas')) {
                        effectCell.style.color = '#2ecc71';
                        effectCell.style.fontWeight = 'bold';
                        effectCell.textContent = 'MrRapolas';
                    } else if (log.streamEffect.includes('BiceptimusPrime')) {
                        effectCell.style.color = '#e74c3c';
                        effectCell.style.fontWeight = 'bold';
                        effectCell.textContent = 'BiceptimusPrime';
                    } else if (log.streamEffect.includes('Blue')) {
                        // Handle Blue's different payment tiers
                        effectCell.style.fontWeight = 'bold';
                        if (log.streamEffect.includes('Broke')) {
                            effectCell.style.color = '#ff4757';
                            effectCell.textContent = 'Blue (Broke)';
                        } else if (log.streamEffect.includes('Poor')) {
                            effectCell.style.color = '#ffa502';
                            effectCell.textContent = 'Blue (Poor)';
                        } else if (log.streamEffect.includes('Balanced')) {
                            effectCell.style.color = '#2ed573';
                            effectCell.textContent = 'Blue (Balanced)';
                        } else if (log.streamEffect.includes('Lucky')) {
                            effectCell.style.color = '#3742fa';
                            effectCell.textContent = 'Blue (Lucky)';
                        } else if (log.streamEffect.includes('WHALE')) {
                            effectCell.style.color = '#a55eea';
                            effectCell.textContent = 'Blue (WHALE)';
                        } else {
                            effectCell.style.color = '#4ecdc4';
                            effectCell.textContent = 'Blue';
                        }
                    } else {
                        // Fallback for any other effects
                        const isPositive = log.streamEffect.includes('+');
                        effectCell.style.color = isPositive ? '#2ecc71' : '#e74c3c';
                        effectCell.style.fontWeight = 'bold';
                        effectCell.textContent = log.streamEffect;
                    }
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
    
    // Payment Modal Functions for Blue's Pay2Win Prayge
    function showPaymentModal(onPaymentComplete) {
        const modal = document.getElementById('payment-modal');
        const closeBtn = document.getElementById('payment-modal-close');
        const processBtn = document.getElementById('process-payment-btn');
        const cancelBtn = document.getElementById('cancel-payment-btn');
        const paymentAmount = document.getElementById('payment-amount');
        const cardNumber = document.getElementById('card-number');
        const expiryDate = document.getElementById('expiry-date');
        const cvcCode = document.getElementById('cvc-code');
        const cardholderName = document.getElementById('cardholder-name');
        
        // Reset form
        paymentAmount.value = '';
        cardNumber.value = '';
        expiryDate.value = '';
        cvcCode.value = '';
        cardholderName.value = '';
        processBtn.disabled = true;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add input formatting
        cardNumber.addEventListener('input', function() {
            let value = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedInputValue = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formattedInputValue;
            validatePaymentForm();
        });
        
        expiryDate.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
            validatePaymentForm();
        });
        
        cvcCode.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            validatePaymentForm();
        });
        
        paymentAmount.addEventListener('input', validatePaymentForm);
        cardholderName.addEventListener('input', validatePaymentForm);
        
        function validatePaymentForm() {
            const isValid = 
                paymentAmount.value && parseFloat(paymentAmount.value) >= 1 &&
                cardNumber.value.replace(/\s/g, '').length >= 13 &&
                expiryDate.value.length === 5 &&
                cvcCode.value.length >= 3 &&
                cardholderName.value.trim().length > 0;
            
            processBtn.disabled = !isValid;
        }
        
        // Process payment button
        processBtn.onclick = function() {
            const amount = parseFloat(paymentAmount.value);
            window.bluePaymentAmount = amount; // Store globally for enhancement calculation
            
            // Show fake processing animation
            processBtn.textContent = '💳 Processing...';
            processBtn.disabled = true;
            
            setTimeout(() => {
                modal.style.display = 'none';
                
                // Show success message
                let tierMessage = '';
                if (amount < 100) {
                    tierMessage = 'You\'re broke! Blue is not impressed! 💸';
                } else if (amount <= 150) {
                    tierMessage = 'Getting there... Blue shows mild approval! 💰';
                } else if (amount <= 200) {
                    tierMessage = 'Balanced! Blue nods with respect! 💎';
                } else if (amount <= 400) {
                    tierMessage = 'Lucky! Blue smiles upon you! 🚀';
                } else {
                    tierMessage = 'WHALE STATUS! Blue bows before your generosity! 👑';
                }
                
                alert(`💳 Payment of $${amount} processed successfully!\n\n${tierMessage}\n\n(This is just for fun - no real payment was processed!)`);
                
                // Reset button
                processBtn.textContent = '💳 Process Payment';
                
                // Run simulation
                onPaymentComplete();
            }, 2000);
        };
        
        // Close button and cancel button
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
        
        cancelBtn.onclick = function() {
            modal.style.display = 'none';
        };
        
        // Close when clicking outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
    
    // Helper function to run simulation after payment
    async function runSimulationAfterPayment(item, startLevel, targetLevel, startingFS, attempts, useCron, useMemFrags, praygeOption, isUsingCostumeCron, useArtisan, includeFailstackCosts) {
        try {
            // Show a loading message
            simResultsDiv.innerHTML = '<p>Running enhanced simulation with Blue\'s blessing...</p>';
            simResultsDiv.className = 'results-container show';
            
            const simulationResults = await runSimulation(item, startLevel, targetLevel, startingFS, attempts, useCron, useMemFrags, praygeOption, isUsingCostumeCron, useArtisan, includeFailstackCosts);
            displaySimulationResults(simulationResults);
        } catch (error) {
            console.error('Error in simulation:', error);
            simResultsDiv.innerHTML = `<div class="error">Error running simulation: ${error.message}</div>`;
            simResultsDiv.className = 'results-container show';
        }
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
            const useArtisan = simUseArtisanMemory && simUseArtisanMemory.checked;
            const includeFailstackCosts = simIncludeFailstackCost && simIncludeFailstackCost.checked;
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
                
                // If Blue prayge is selected, show payment modal first
                if (praygeOption === 'blue') {
                    showPaymentModal(() => {
                        // Run simulation after payment is "processed"
                        runSimulationAfterPayment(item, startLevel, targetLevel, startingFS, attempts, useCron, useMemFrags, praygeOption, isUsingCostumeCron, useArtisan, includeFailstackCosts);
                    });
                    return; // Exit early to wait for payment modal
                }
                
                // Use the isUsingCostumeCron variable we defined earlier
                const simulationResults = await runSimulation(item, startLevel, targetLevel, startingFS, attempts, useCron, useMemFrags, praygeOption, isUsingCostumeCron, useArtisan, includeFailstackCosts);
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
        
        // For Preonne, failstacks are not used so this function should do nothing
        if (selectedItem === 'Preonne') {
            simFailstack.disabled = true;
            simFailstack.value = '';
            simFailstack.placeholder = 'Not used for Preonne';
            return;
        }
        
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
