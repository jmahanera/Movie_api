const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;

  // Log the request to the log.txt file
  const logData = `${pathname} - ${new Date().toISOString()}\n`;
  fs.appendFile('log.txt', logData, (err) => {
    if (err) {
      console.error(err);
    }
  });

  if (pathname === '/documentation') {
    // Serve documentation.html file
    fs.readFile('documentation.html', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } else {
    // Serve index.html file
    fs.readFile('index.html', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  }
});

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
