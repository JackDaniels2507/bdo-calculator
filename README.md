# BDO Enchantment Calculator

A web-based calculator for Black Desert Online enhancement costs and success probabilities.

## Features

- Calculate enhancement costs and probabilities for various items
- Simulate enhancement attempts to estimate success rates
- Fetches real-time market prices from GitHub-hosted data files
- Support for both EU and NA regions

## How Price Data Works

This application uses real-time market prices that are updated every 6 hours through a GitHub Actions workflow. The workflow:

1. Fetches current market prices from the BDO API for both EU and NA regions
2. Extracts the latest price for each item
3. Saves the data to JSON files in the repository
4. The web application loads these JSON files when calculating enhancement costs

If the application cannot access the price data (for example, when running locally without internet access), it will fall back to using default estimated prices.

## Setting Up GitHub Pages and GitHub Actions

To use the price fetching feature:

1. Push this repository to GitHub
2. Enable GitHub Pages (Settings > Pages > Source: select 'main' branch)
3. GitHub Actions will automatically run the price fetcher every 6 hours
4. Update the `jsonUrl` in `bdoEnchant.js` to point to your GitHub Pages URL

## Running Locally

Simply open `index.html` in a web browser. Note that when running locally, the application may use fallback prices if it cannot access the GitHub-hosted JSON files.

## Contributing

Feel free to contribute by adding more items, improving the UI, or enhancing the calculation formulas.
