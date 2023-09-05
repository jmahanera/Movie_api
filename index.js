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
const uri = 'mongodb+srv://jula:Myaccount1@moviecluster.1wliibn.mongodb.net/mymoviesDB?retryWrites=true&w=majority'; // Replaced with my MongoDB connecmongoose.connect(process.env.MOVIES_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(process.env.MOVIES_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.connect( "mongodb://127.0.0.1:27017/mymoviesDB",{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

  
  /*mongoose.connect( process.env.movies_uri, { useNewUrlParser: true, useUnifiedTopology: true });*/

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
let allowedOrigins = ['https://movienostalgie.herokuapp.com', 'http://localhost:8080'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application does not allow access from origin ' + origin;
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
  response.send('Welcome to mymoviesDB Operating under the brand name MOVIENOSTALGIE!');
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


/*app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'genre.name': req.params.genreName })
    .then((movies) => {
      if (movies.length === 0) {
        return res.status(404).send('Error: no movies found with this genre ' + req.params.genreName + ' genre type.');
      } else {
        return res.status(200).json(movies);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});*/



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


// Add or update movie image URL
app.put('/movies/:movieId/imageurl', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { movieId } = req.params;
    const { imageUrl } = req.body;

    // Check if the movie with the given ID exists
    const movie = await movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Validate that imageUrl is provided
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    // Update the imageUrl property
    movie.imageUrl = imageUrl;

    // Save the updated movie
    const updatedMovie = await movie.save();

    return res.status(200).json({ message: 'ImageUrl added/updated successfully', movie: updatedMovie });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



/*app.put('/movies/:movieId/updateImageUrl', async (req, res) => {
  try {
    const { movieId } = req.params;
    const { imageUrl } = req.body;

    // Check if the movie with the given ID exists
    const movie = await movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Update the imageUrl property
    movie.imageUrl = imageUrl;

    // Save the updated movie
    await movie.save();

    return res.status(200).json({ message: 'ImageUrl updated successfully', movie });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});*/



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


//error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is not right, Please verify and retest!');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});



