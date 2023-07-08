// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
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

// Connect to MongoDB
const uri = 'mongodb+srv://jula:Myaccount1@moviecluster.1wliibn.mongodb.net/mymoviesDB?retryWrites=true&w=majority'; // Replaced with my MongoDB connection string
mongoose.connect(process.env.MOVIES_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

  /*mongoose.connect( process.env.movies_uri, { useNewUrlParser: true, useUnifiedTopology: true });*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
const jwtSecret = process.env.JWT_SECRET || 'my_secret_access_key';

// Logger Initiated
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// Middleware
app.use(express.static('public'));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(passport.initialize());

// Configure passport for JWT authentication
/*LocalStrategy = require('passport-local').Strategy;
JWTStrategy = passportJWT.Strategy;
ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, (username, password, callback) => {
  Users.findOne({ username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, { message: 'Incorrect username or password.' });
    }

    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        console.log('finished');
        return callback(null, user);
      } else {
        console.log('incorrect password');
        return callback(null, false, { message: 'Incorrect username or password.' });
      }
    });
  });
}));*/

// This sets up a message once the user goes to the home page of the website.
app.get('/', (_request, response) => {
  response.send('Welcome to mymoviesDB Operating under the brand name MOVIENOSTALGIE!');
});

// GET requests
// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (_req, res) => {
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
        return res.status(404).send('Error: ' + req.params.name + ' was not found');
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
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Searches for movies by their genre and returns a JSON object
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// diplaying movies by genre 
app.get('/movies/genre/:genre', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'genre.name': req.params.genre })
    .then((movies) => {
      if (movies.length == 0) {
        return res.status(404).send('Error: no movies found with the ' + req.params.genre + ' genre type.');
      } else {
        res.status(200).json(movies);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// displaying movies by director
app.get('/movies/directors/:director', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'director.name': req.params.director })
    .then((movies) => {
      if (movies.length == 0) {
        return res.status(404).send('Error: no movies found with the director ' + req.params.director + ' name');
      } else {
        res.status(200).json(movies);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Searches for movies by the director's name and returns the movies with that director's name
app.get('/movies/directors/:directorsName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find({ 'Director.Name': req.params.directorsName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Endpoint for user login
app.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Authentication failed',
        user: user
      });
    }

    // Generate JWT token
    const token = jwt.sign(user.toJSON(), jwtSecret);

    return res.json({ user, token });
  })(req, res, next);
});

//creating a new user
app.post('/users', [
  body('username', 'Username is required').isLength({ min: 5 }),
  body('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  body('password', 'Password is required').not().isEmpty(),
  body('email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + ' already exists');
      } else {
        Users
          .create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthDate: req.body.birthdate
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
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


//updating a user's information
/*const { check, validationResult } = require('express-validator');*/

app.put('/users/:username', passport.authenticate('jwt', { session: false }),
  [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required').notEmpty(),
    check('email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);
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
          return res.status(404).send('Error: No user was found');
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



//removing an existing user
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(404).send('User ' + req.params.username + ' was not found');
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
  res.status(500).send('Something is not right, Please cross check and retest!');
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port);
});



