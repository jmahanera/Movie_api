// Import required modules
const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const passport = require('passport');
const bodyParser = require('body-parser');
const passportJWT = require('passport-jwt');
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');
const cors = require('cors');

// Import Mongoose and models
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;


// Logger Initiated
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(morgan('common'));


// Connect to MongoDB
const uri = 'mongodb+srv://jula:Myaccount1@moviecluster.1wliibn.mongodb.net/mymoviesDB?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    // Start your server or perform other operations
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

  /*mongoose.connect(process.env.movies_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });*/

// Middleware
app.use(express.static('public'));
app.use(morgan('combined', {
  stream: accessLogStream,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

// Configure passport for JWT authentication
LocalStrategy = require('passport-local').Strategy;

  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username or password.'});
    }

    console.log('finished');
    return callback(null, user);
  });
}));

/*passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));*/

let allowedOrigins = ['http://localhost:8080', 'https://movienostalgie.herokuapp.com'];
app.use(cors());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

require('./auth')(app);
const jwtSecret = 'jwtSecret';
require('./passport.js');

// GET requests

// This sets up a message once the user goes to the home page of the website.
app.get('/', (_request, response) => {
  response.send('Welcome to mymoviesDB Operating under the brand name MOVIENOSTALGIE!');
});

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


// Gets a JSON object of all the current movies on the server
app.get('/movies', passport.authenticate('jwt', { session: false }), (_req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//searches for movies by their title and returns a  single JSON object
app.get('/movies/:title', passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  
//searches for movies by their genre and returns a JSON object
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }),(req, res) => {
  Movies.find({ 'Genre.Name': req.params.genreName })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).send('Error: ' + err);
    });
});



  //searches for movies by the directors name and returns the movies with that directors name
  app.get('/movies/directors/:directorsName', passport.authenticate('jwt', { session: false }),(req, res) => {
    Movies.find({ 'Director.Name': req.params.directorsName })
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  });


//creating a new user
app.post('/users', [
  check('username', 'Username is required').isLength({ min: 5 }),
  check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
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
            birthDate: req.body.birthDate
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
    const token = jwt.sign(user.toJSON(), 'your_jwt_secret');

    return res.json({ user, token });
  })(req, res, next);
});


 //allows users to save movies to their favorites!
 app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $addToSet: { FavoriteMovies: req.params.MovieID }
    },
    { new: true } //This line makes sure the updated document is returned
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



//allows users to delete movies from their favorites
app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("Error: User doesn't exist");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//updates a account holders information
app.put('/users/:username', passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.Email,
        birthday: req.body.Birthday
     
        
      }
    },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("Error: User doesn't exist");
      } else {
        res.json(updatedUser);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


 //deletes a user by username
 app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Delete User by ID
app.delete('/users/:userId', (req, res) => {
  Users.findByIdAndRemove(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.userId + ' was not found');
      } else {
        res.status(200).send(req.params.userId + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Delete a movie by ID
app.delete('/movies/:movieId', (req, res) => {
  const movieId = req.params.movieId;

  Movies.findOneAndRemove({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        res.status(400).send(movieId + ' was not found');
      } else {
        res.status(200).send(movieId + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.get('/documentation', (_req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
  });
    
   //Error handling middleware
  app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('There was an error. Please try again later.');
  });


//if everything functions correctly this message is logged from port 8080 thats listening.
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});