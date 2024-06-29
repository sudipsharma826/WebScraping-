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
      const tags = [];//tags array to store more then one tags
      $(element).find('.tag').each((i,tag) =>{//each use to iterate over all the element with class name tag.
        //and push then one by one ,so sapce problem can be sort out
        tags.push($(tag).text());//we use $(tag) becasue $ denoted the cheeio and tag is the pratment in the each ,where tag value is auto genertated.
        //.text() extract test contain only

      });

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