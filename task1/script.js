//Web Scraping..
const axios = require('axios');
const cheerio = require('cheerio');

const website = 'http://quotes.toscrape.com';
const totalPosts = 10;

const scrapePage = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const quotes = [];

    for (let i = 0; i < totalPosts; i++) {
      const element = $('.quote')[i];
      const quoteText = $(element).find('.text').text().trim();
      const author = $(element).find('.author').text().trim();
      const tags = $(element).find('.tags .tag').map((i, el) => $(el).text().trim()).get();

      quotes.push({ quoteText, author, tags });
    }

    return quotes;
  } catch (error) {
    console.error('Error scraping page:', error);
    return [];
  }
};

const scrapeQuotes = async () => {
  const url = `${website}`;
  console.log(`Scraping ${url}...`);

  try {
    const quotes = await scrapePage(url);
    console.log('Scraped quotes:', quotes);
    return quotes;
  } catch (error) {
    console.error('Error scraping quotes:', error);
    return [];
  }
};

scrapeQuotes();