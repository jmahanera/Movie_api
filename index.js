// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const uuid = require('uuid');

// Import Mongoose and models
const mongoose = require('mongoose');  
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//Middleware
//

// Connect to MongoDB
const uri = 'mongodb+srv://julayamu:Myproject23@moviecluster.uviwjhs.mongodb.net/mymoviesDB?retryWrites=true&w=majority'; // Replaced with my MongoDB connecmongoose.connect(process.env.MOVIES_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(process.env.MOVIES_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.connect( "mongodb://127.0.0.1:27017/mymoviesDB",{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

  
  //mongoose.connect( process.env.movies_uri, { useNewUrlParser: true, useUnifiedTopology: true });*/


/*const uri = process.env.MOVIES_URI || 'mongodb+srv://julayamu:Myproject23@moviecluster.uviwjhs.mongodb.net/mymoviesDB?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });*/



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('common'));



// Function to hash a password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};


const cors = require('cors');
let allowedOrigins = [ '*', 'http://localhost:1234', 'http://localhost:8080',
  'https://primemovies-39075872fbeb.herokuapp.com/login', 'http://localhost:4200'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application does not allow access from unverified origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);    
  }
}));

require('./auth')(app);
require('./passport');
//const jwtSecret = "jwtSecret";


// Logger Initiated
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware
app.use(express.static('public'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(passport.initialize());    

// Configure passport for JWT authentication
JWTStrategy = passportJWT.Strategy;
ExtractJWT = passportJWT.ExtractJwt;

// Passport configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    Users.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password' });
        }
        
        user.validatePassword(password, (err, result) => {
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect username or password' });
          }
        });
      })
      .catch((err) => done(err));
  })
);



// This sets up a message once the user goes to the home page of the website.
app.get('/', (_request, response) => {
  response.send('Welcome to mymoviesDB Operating under the brand name PRIMEMOVIES!!!');
});


// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (_request, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
     
// display a single user
app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ username: req.params.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('Error: ' + req.params.name + ' Username does not exist');
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user's favorite movies
app.get('/users/:username/favoriteMovies', passport.authenticate('jwt', { session: false }), (req, res) => {
  const username = req.params.username;

  Users.findOne({ username: username })
    .populate('favoriteMovies')
    .then((user) => {
      if (!user) {
        return res.status(404).send("Error: User doesn't exist");
      } else {
        // If the user is found, return the favorite movies
        res.json(user.favoriteMovies);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});





// Gets a JSON object of all the current movies on the server
app.get('/movies', passport.authenticate('jwt', { session: false }), (_req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Searches for movies by their title and returns a single JSON object
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ "title": req.params.title })
    .then((movie) => { 
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user's favorite movie by movie ID
app.get('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const username = req.params.username;
  const movieId = req.params.movieId;

  Users.findOne({ username: username, FavoriteMovies: movieId })
    .populate('FavoriteMovies')
    .then((user) => {
      if (!user) {
        return res.status(404).send("Error: User doesn't exist or movie not found in favorites");
      } else {
        res.json(user.FavoriteMovies);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


//Get a movie using genreName
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  const genreName = req.params.genreName;

  // Log the genreName you are searching for
  console.log(`Searching for genre: ${genreName}`);

  Movies.find({ 'genre.name': genreName })
    .then((movies) => {
      // Log the movies found (or not found)
      console.log('Movies found:', movies);

      if (movies.length === 0) {
        return res.status(404).json({ error: `No movies found with the ${genreName} genre` });
      }

      // Extract genre information from the first movie (assuming all movies have the same genre)
      const genreInfo = movies[0].genre;

      if (!genreInfo) {
        console.error('Genre information is missing in the movie:', movies[0]);
        return res.status(500).json({ error: 'Genre information missing in the movie' });
      }

      // Send the genre information back to Postman
      console.log('Sending genre information to Postman:', genreInfo);
      res.status(200).json(genreInfo);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});

//Get all movies with the sane genre
app.get('/movies/genre/:genreName/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  const genreName = req.params.genreName;
  // Log the genreName you are searching for
  console.log(`Searching for movies with genre: ${genreName}`);

  Movies.find({ 'genre.name': genreName })
    .then((movies) => {
      // Log the movies found (or not found)
      console.log('Movies found:', movies);

      if (movies.length === 0) {
        return res.status(404).json({ error: `No movies found with the ${genreName} genre` });
      }

      // Send the movies back to the client
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    });
});


 app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const directorName = req.params.directorName;
    
    // Log the directorName you are searching for
    console.log(`Searching for director: ${directorName}`);

    Movies.findOne({ 'director.name': directorName })
      .select('director') // Select only the director subdocument
      .then((movie) => {
        // Log the movie found (or not found)
        console.log('Movie found:', movie);

        if (!movie) {
          return res.status(404).json({ error: 'No director found with this name' });
        }

        if (!movie.director) {
          console.error('Director information is missing in the movie:', movie);
          return res.status(500).json({ error: 'Director information missing in the movie' });
        }

        // Send the director information back to Postman
        console.log('Sending director information to Postman:', movie.director);
        res.status(200).json(movie.director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
);


//creating a new user
app.post('/users', [
  body('username', 'Username is required').isLength({ min: 5 }),
  body('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
  body('password', 'Password is required').not().isEmpty(),
  body('password', 'Password must be at least 5 characters long').isLength({ min: 5 }),
  body('email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  // Validation code
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Password validation passed, continue with user creation
  try {
    const hashedPassword = await hashPassword(req.body.password);
    Users.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + ' UserName already exists in Database');
        } else {
          Users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthDate: req.body.birthdate
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: Password hashing failed');
  }
});




// Allows users to save movies to their favorites!
app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $addToSet: { FavoriteMovies: req.params.MovieID } },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("Error: User doesn't exist");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Create a new movie
app.post('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Extract movie data from the request body
    const { title, description, genre, director, actors, imageUrl, featured } = req.body;

    // Create a new movie object with the ID (assuming you're using MongoDB's default ObjectId)
    const newMovie = new Movies({
      title,
      description,
      genre,
      director,
      actors,
      imageUrl,
      featured,
    });

    // Save the movie to the database
    const savedMovie = await newMovie.save();

    // Send a response to the client
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Create a new director and associated movies
app.post('/directors/directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Extract director data from the request body
  const { name, birthYear, bio, movies } = req.body;

  // Create an array to store the movie IDs associated with the director
  const movieIds = [];

  // Loop through the list of movie titles and find or create them in the database
  Promise.all(
    movies.map(async (movieTitle) => {
      const existingMovie = await Movies.findOne({ title: movieTitle });

      if (existingMovie) {
        movieIds.push(existingMovie._id);
      } else {
        const newMovie = new Movies({ title: movieTitle });
        const savedMovie = await newMovie.save();
        movieIds.push(savedMovie._id);
      }
    })
  )
    .then(() => {
      // Create a new director object with the associated movie IDs
      const newDirector = new Directors({
        name,
        birthYear,
        bio,
        movies: movieIds,
      });

      // Save the director to the database
      return newDirector.save();
    })
    .then((director) => {
      // Log the newly created director to the console
      console.log('New Director Created:');
      console.log(JSON.stringify(director, null, 2)); // Pretty-print JSON

      // Send a response to the client
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



// Update movie title
app.put('/movies/:movieId/title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const newTitle = req.body.newTitle;

    // Check if the movie exists
    const existingMovie = await Movies.findById(movieId);

    if (!existingMovie) {
      return res.status(404).send('Error: Movie with ID ' + movieId + ' not found.');
    }

    // Update the movie's title
    existingMovie.title = newTitle;
    const updatedMovie = await existingMovie.save();

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});



// Update movie image URL
app.put('/movies/:movieId/image', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { movieId } = req.params;
  const { imageUrl } = req.body;

  try {
    const updatedMovie = await Movies.findByIdAndUpdate(movieId, { $set: { imageUrl } }, { new: true });

    if (!updatedMovie) {
      return res.status(404).send('Error: Movie with ID ' + movieId + ' not found.');
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});


// Delete movie image URL
app.delete('/movies/:movieId/imageurl', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movieId = req.params.movieId;

    // Find the movie by ID
    const movie = await Movies.findById(movieId);

    if (!movie) {
      return res.status(404).send('Error: Movie with ID ' + movieId + ' not found');
    }

    // Remove the ImageUrl field from the movie
    movie.imageUrl = undefined;
    await movie.save();

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});




//updating a user's information
/*const { check, validationResult } = require('express-validator');*/

app.put('/users/:username', passport.authenticate('jwt', { session: false }),
  [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').notEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
    
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let hashedPassword = await hashPassword(req.body.password);
    Users.findOneAndUpdate(
      { username: req.params.username },
      {
        $set: {
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          birthDate: req.body.birthDate
        },
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send('Error: Username does not exist in this database');
        } else {
          res.json(user);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Delete a movie's imageUrl
app.delete('/movies/:movieId/imageurl', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movieId = req.params.movieId;

    // Find the movie by ID and update the ImageUrl field to null
    const updatedMovie = await Movies.findByIdAndUpdate(
      movieId,
      { $unset: { ImageUrl: 1 } },
      { new: true }
    );

    if (!updatedMovie) {
      return res.status(404).send('Error: Movie with ID ' + movieId + ' not found');
    }

    res.json(updatedMovie);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

// Delete a movie by ID
app.delete('/movies/:movieId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const movieId = req.params.movieId;

    // Find the movie by ID and delete it
    const deletedMovie = await Movies.findByIdAndRemove(movieId);

    if (!deletedMovie) {
      return res.status(404).send('Error: Movie with ID ' + movieId + ' not found');
    }

    res.json({ message: 'Movie with ID ' + movieId + ' has been deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});


//removing an existing user
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(404).send('User ' + req.params.username + ' The requested username does not exist in this database');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Allow users to delete 
app.delete('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const username = req.params.username;
  const movieId = req.params.movieId;

  Users.findOneAndUpdate(
    { username: username },
    { $pull: { FavoriteMovies: movieId } },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("Error: User doesn't exist");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});



//error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not right, Please verify and retest!');
});

// Start the server
const port = process.env.PORT || 8080   
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
