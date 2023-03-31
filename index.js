// import the required modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

// create an instance of express
const app = express();

// create a write stream to the log file
const logStream = fs.createWriteStream('requests.log', { flags: 'a' });

// use the "morgan" middleware function to log all requests to the console and the log file
app.use(morgan('combined'));

// create a middleware function to log requests
function requestLogger(req, res, next) {
  const { method, url, headers } = req;
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} ${method} ${url} ${JSON.stringify(headers)}\n`;

  // write the log line to the log file
  logStream.write(logLine);

  next();
}

// use the custom requestLogger middleware to log requests to the file
app.use(requestLogger);


// define a route that returns a JSON object containing data about your top 10 movies
app.get('/movies', (req, res) => {
    const movies = [
        {
          title: 'The Shawshank Redemption',
          director: 'Frank Darabont',
          year: 1994
        },
        {
          title: 'The Godfather',
          director: 'Francis Ford Coppola',
          year: 1972
        },
        {
          title: 'The Dark Knight',
          director: 'Christopher Nolan',
          year: 2008
        },
        {
          title: 'Schindler\'s List',
          director: 'Steven Spielberg',
          year: 1993
        },
        {
          title: 'The Lord of the Rings: The Return of the King',
          director: 'Peter Jackson',
          year: 2003
        },
        {
          title: 'Pulp Fiction',
          director: 'Quentin Tarantino',
          year: 1994
        },
        {
          title: 'Forrest Gump',
          director: 'Robert Zemeckis',
          year: 1994
        },
        {
          title: 'Inception',
          director: 'Christopher Nolan',
          year: 2010
        },
        {
          title: 'The Lord of the Rings: The Fellowship of the Ring',
          director: 'Peter Jackson',
          year: 2001
        },
        {
          title: 'The Matrix',
          director: 'Lana Wachowski, Lilly Wachowski',
          year: 1999
        }
      ];
    
      res.json(movies);
});

// define a route that returns a default textual response
app.get('/', (req, res) => {
  // ... the same as before
});

app.get('/error', (req, res, next) => {
  // ... the same as before
});

// error-handling middleware function that logs all application-level errors
app.use((err, req, res, next) => {
  // ... the same as before
});

// serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// start the server
app.listen(8080, () => {
  console.log('Server listens on port 8080');
});






