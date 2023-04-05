const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const directors = require('./directors'); // assuming you have a file with the director data
const app = express();
const bodyParser = require('body-parser');
const logStream = fs.createWriteStream('requests.log', { flags: 'a' });
// Import the database module and connect to the database
const db = require('./db');
db.connect();

// Define an array of genre objects
const genres = [
  {
    name: 'Thriller',
    description: 'Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety.'
  },
  {
    name: 'Comedy',
    description: 'Comedy is a genre of fiction characterized by humor and wit. It often takes a lighthearted and humorous approach to serious subjects and events, and may include satire, parody, farce, or other comedic devices.'
  },
  {
    name: 'Drama',
    description: 'Drama is a genre of fiction characterized by serious or significant events or conflicts, often involving characters who face difficult or challenging circumstances. It may include tragic or uplifting themes, and may be presented in a variety of formats, including stage plays, films, television shows, or novels.'
  }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// registration endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // validate user input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // TODO: perform additional validation and save the user to the database

  res.status(201).json({ message: 'User registered successfully.' });
});

// example user data
let users = [
  { id: 1, username: 'user1' },
  { id: 2, username: 'user2' },
  { id: 3, username: 'user3' }
];

// GET request to get user data
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  res.send(user);
});

// PUT request to update user data
app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  user.username = req.body.username;
  res.send(user);
});

// Initialize an empty list of favorite movies
let favoriteMovies = [];

// Parse JSON request bodies
app.use(express.json());

// Endpoint for adding a movie to favorites
app.post('/favorites', (req, res) => {
  const { title } = req.body;

  // Add the movie title to the list of favorites
  favoriteMovies.push(title);

  // Send a response indicating that the movie has been added
  res.send(`Movie "${title}" has been added to favorites!`);
});

// Define a route for removing a movie from a user's list of favorites
app.delete('/favorites/:userId/:movieId', (req, res) => {
  const { userId, movieId } = req.params;
  
  // Find the user in the database
  const user = db.findUserById(userId);
  if (!user) {
    return res.status(404).send('User not found');
  }
  
  // Remove the movie from the user's list of favorites
  const index = user.favorites.indexOf(movieId);
  if (index === -1) {
    return res.status(404).send('Movie not found in user favorites');
  }
  user.favorites.splice(index, 1);
  
  // Update the user in the database
  db.updateUser(user);
  
  // Send a response indicating that the movie has been removed
  res.send('Movie removed from favorites');
});

// handle POST request to delete a user by email
app.post('/deregister', async (req, res) => {
  try {
    // connect to database
    await client.connect();
    const database = client.db('myapp');
    const users = database.collection('users');

    // get email from request body
    const email = req.body.email;

    // find user by email and delete
    const result = await users.deleteOne({ email });
    if (result.deletedCount === 1) {
      res.send(`User with email ${email} has been removed`);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  } finally {
    // close database connection
    await client.close();
  }
});

app.use(morgan('combined', { stream: logStream }));

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


// Define a route to get all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Define a route for getting movie data by title
app.get('/movies/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const movie = await db.getMovieByTitle(title);
    if (!movie) {
      // If no movie is found with the given title, return a 404 error
      return res.status(404).send('Movie not found');
    }
    // Otherwise, return the movie data to the user
    res.send({
      description: movie.description,
      genre: movie.genre,
      director: movie.director,
      imageURL: movie.imageURL,
      featured: movie.featured
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Define a route that accepts a genre name/title as a parameter
app.get('/genre/:name', (req, res) => {
  // Find the genre in the array that matches the name parameter
  const genre = genres.find(g => g.name.toLowerCase() === req.params.name.toLowerCase());
  
  // If the genre is not found, return a 404 status code and an error message
  if (!genre) {
    return res.status(404).send('Genre not found');
  }
  
  // If the genre is found, return its description
  res.send(genre.description);
});

app.get('/director/:name', (req, res) => {
  const name = req.params.name;
  const director = directors.find(d => d.name.toLowerCase() === name.toLowerCase());

  if (!director) {
    res.status(404).send(`Director ${name} not found`);
  } else {
    const { bio, birthYear, deathYear } = director;
    res.send({ bio, birthYear, deathYear });
  }
});





// define a route that returns a default textual response
app.get('/', (req, res) => {
  res.send('Hello, There!');
});

app.get('/failure', (req, res, next) => {
  const error = new Error('Failure loading');
  next(error);
});

// error-handling middleware function that logs all application-level errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

// serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));


// Start the server
const PORT = process.env.PORT || 8080;
// start the server
app.listen(8080, () => {
  console.log('Server listens on port 8080');
});
