const fs = require('fs');
const path = require('path');
const https = require('https');

// Market item IDs to fetch
const itemIds = {
    'Essence of Dawn': 820979,  // Essence of Dawn ID
    'DAWN': 820984,            // DAWN ID
    'Primordial Black Stone': 820934, // Primordial Black Stone ID
    'Memory Fragment': 44195,   // Memory Fragment ID
    'Caphras Stone': 721003,    // Caphras Stone ID
    'Sharp Black Crystal Shard': 4998,  // Sharp Black Crystal Shard ID
    'Concentrated Magical Black Gem': 4987, // Concentrated Magical Black Gem ID
    'Mass of Pure Magic': 752023, // Mass of Pure Magic ID
    'Crystallized Despair': 8411, // Crystallized Despair ID
    'Origin of Dark Hunger': 5998,  // Origin of Dark Hunger ID
    'Black Stone': 16001 // Black Stone ID
    // Add more items as needed
};

/**
 * Fetches price data from the BDO API for a specific region and item
 * @param {string} region - 'eu' or 'na'
 * @param {number} itemId - The item ID to fetch
 * @returns {Promise<number>} - The latest price
 */
async function fetchPriceData(region, itemId) {
    // Determine the correct endpoint based on region
    const host = region === 'eu' 
        ? 'eu-trade.naeu.playblackdesert.com'
        : 'na-trade.naeu.playblackdesert.com';
    
    // Request options
    const options = {
        hostname: host,
        path: '/Trademarket/GetMarketPriceInfo',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'BlackDesert'
        }
    };

    // Request body
    const data = JSON.stringify({
        keyType: 0,
        mainKey: itemId,
        subKey: 0
    });

    // Return a promise that resolves with the price data
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    
                    if (parsedData.resultCode !== 0) {
                        reject(new Error(`API Error: ${parsedData.resultMsg || 'Unknown error'}`));
                        return;
                    }

                    // Extract the last price from the price history string
                    const priceHistory = parsedData.resultMsg;
                    const lastPrice = priceHistory.split('-').pop();
                    
                    console.log(`Successfully fetched price for item ${itemId} from ${region}: ${lastPrice}`);
                    resolve(parseInt(lastPrice, 10));
                } catch (error) {
                    reject(new Error(`Failed to parse response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        // Write data to request body
        req.write(data);
        req.end();
    });
}

/**
 * Sleep function to add delay between requests
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Resolves after the specified time
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function to fetch all prices and save them to JSON files
 */
async function fetchAllPrices() {
    const regions = ['eu', 'na'];
    const results = {};

    // Initialize results object
    regions.forEach(region => {
        results[region] = {};
    });

    // Fetch prices for each item and region
    for (const [itemName, itemId] of Object.entries(itemIds)) {
        for (const region of regions) {
            try {
                console.log(`Fetching price for ${itemName} (ID: ${itemId}) in ${region.toUpperCase()}...`);
                const price = await fetchPriceData(region, itemId);
                
                // Add a small delay between requests to avoid rate limiting
                await sleep(1000);
                results[region][itemId] = {
                    name: itemName,
                    price: price,
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                console.error(`Failed to fetch price for ${itemName} (${itemId}) in ${region}:`, error.message);
                // Store the error but continue with other items
                results[region][itemId] = {
                    name: itemName,
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        }
    }

    // Save results to JSON files for each region
    for (const region of regions) {
        const filePath = path.join(process.cwd(), `bdo-prices-${region}.json`);
        fs.writeFileSync(filePath, JSON.stringify(results[region], null, 2));
        console.log(`Saved ${region.toUpperCase()} prices to ${filePath}`);
    }
}

// Execute the main function
fetchAllPrices().catch(error => {
    console.error('An error occurred:', error);
    process.exit(1);
});
