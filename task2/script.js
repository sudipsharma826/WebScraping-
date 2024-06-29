// Web Scraping
const axios = require('axios'); // to get the HTTP request to extract the data
const cheerio = require('cheerio'); // to fetch the data
const fs = require('fs'); // import the built-in module ('fs' (File System)), to access the system files

// Extract the necessary packages and the function
const website = 'https://quotes.toscrape.com/'; // the website to extract the data
const pages = 10; // total number of pages to extract the data
const result = []; // to store the data

const scrapePage = async (page) => {
  try {
    const { data } = await axios.get(`${website}page/${page}/`);
    /* This makes the program await until axios.get fetches the data from the site with the page number.
    After the data is extracted, it is in a JSON object with different properties e.g., data, status.
    We need only the data, so we use {data}; this has another benefit that it not only specifies
    the properties of data to extract but also saves the extracted data in the variable.
    Summarized: data works as a property selector and a variable too. */

    const $ = cheerio.load(data); // here $ is simply a variable name
    // when cheerio.load(data) is run, $ gets the data from the content in another format.
    // when $ is used, it refers to the cheerio-loaded data

    $('.quote').each((i, element) => {
      // here from the data, the data with class quote is selected 
      // each is used to iterate over each element with class quote and 
      // i refers to the index (auto-generated, not needing to be passed as parameters or arguments)
      // element refers to the data from each element with class quotes (auto-assigned by each)
      const quote = $(element).find('.text').text().trim();
      // this indicates that from the class quotes, find the class text
      // in the class text, get the textual data and save it to the variable quote.
      // trim() is used to remove the whitespace from the data if it exists.
      // (this is found from the website inspecting)
      const author = $(element).find('.author').text().trim();
      const tags = [];//tags array to store more then one tags
      $(element).find('.tag').each((i,tag) =>{//each use to iterate over all the element with class name tag.
        //and push then one by one ,so sapce problem can be sort out
        tags.push($(tag).text());//we use $(tag) becasue $ denoted the cheeio and tag is the pratment in the each ,where tag value is auto genertated.
        //.text() extract test contain only

      });

      result.push({ quote, author, tags });//to psuh in array the name of quote ,author and tags
    });
  } catch (error) { // catch the error if any occurs
    console.error(`Error fetching data from ${website}page/${page}/`, error);
    // here console.error is used to display the message in red color as an error message display
    // syntax of console.error(message to display, error_msg)
    // error_msg is auto-generated and stored in catch as the argument
  }
};

const showResult = async () => {
  for (let i = 1; i <= pages; i++) { // loop to execute for the 10 pages
    // here the pages is not passed in the async function because it is a global variable and can be used anywhere
    // but in the above async function, we passed page as an argument because it frequently changes.
    await scrapePage(i); // wait for the function to complete completely then only go for another iteration
  }
  fs.writeFileSync('result.txt', JSON.stringify(result, null, 2), 'utf-8');
  // fs.writeFileSync is the syntax to copy the data into a file, and if the file is not created, it creates the file
  // if the file is created, it adds the data by erasing the previous data
  // fs.writeFileSync accepts three parameters: 1. file name 2. data to be stored 3. encoding the data in a readable format
  // JSON.stringify converts the data into the JSON format to store the data
  // it gets three parameters: 1. Value: which data to convert into JSON  
  // 2. Replacer: manipulate the data (which one to store); if it's null, then it includes all the JSON objects
  // 3. Space: to get space in the data (we used 2 to get 2 spaces in the data)
  // utf-8 is for decoding the data in a readable format.
  console.log("Data is extracted and saved successfully in result.txt file"); // message to print
};

showResult(); // function call
