const scraper = require('@bochilteam/scraper');

console.log("Available exports from @bochilteam/scraper:", Object.keys(scraper));

const scrapeDanceUS = async (url) => {
  try {
    // Check if 'scrape' is actually available
    if (typeof scraper.scrape !== "function") {
      throw new Error("'scrape' is not a function. Check module exports.");
    }

    const result = await scraper.scrape(url);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error scraping DanceUS.org:", error);
  }
};

const targetUrl = process.argv[2];
scrapeDanceUS(targetUrl);
