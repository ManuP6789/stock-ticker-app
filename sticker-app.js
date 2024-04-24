var http = require('http');
var url = require('url');
const { connectToDB, searchCompany, closeConnection } = require('./search-company');
var port = process.env.PORT || 3000;
console.log("This goes to the console window");
http.createServer(async function (req, res) {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(`
      <h2>Enter Stock Ticker or Company Name</h2>
      <form action="/process" method="GET">
          <label for="searchTerm">Search Term:</label><br>
          <input type="text" id="searchTerm" name="searchTerm"><br>
          
          <input type="radio" id="ticker" name="searchType" value="ticker">
          <label for="ticker">Ticker Symbol</label><br>
          
          <input type="radio" id="company" name="searchType" value="company">
          <label for="company">Company Name</label><br><br>
          
          <input type="submit" value="Submit">
      </form>
    `);
    res.end();
  } else if(req.url.startsWith('/process') && req.method === 'GET') {
    console.log('parsing answer');
    const query = url.parse(req.url, true).query;
    const searchTerm = query.searchTerm;
    const searchType = query.searchType;

    const collection = await connectToDB();
    if (!collection) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
        return;
    }

    const companies = await searchCompany(searchTerm, searchType, collection);

    console.log('Search Term:', searchTerm);
    console.log('Search Type:', searchType);
    console.log('Matching Companies:', companies);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    let html = '<h2>Search Results:</h2>';
    companies.forEach(company => {
      html += `<p>Name: ${company.company_name}, Ticker: ${company.stock_ticker}, Price: ${company.stock_price}</p>`;
    });
    res.end(html);
    
    await closeConnection();

  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Not Found');
  }
}).listen(port, () => {
  console.log('Server running at http://localhost:3000/')
});
