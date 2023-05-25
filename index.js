const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const jwtSecret = 'your_jwt_secret';
const passport = require('passport');
const path = require('path');
const bcrypt = require('bcrypt');
const uuid = require('uuid');


const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
});

const saltRounds = 10; // Number of salt rounds for bcrypt hashing



//Middleware
app.use(express.static('public'));
app.use(morgan('combined', {
  stream: accessLogStream
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());



let auth = require('./auth')(app);
require('./passport.js');

mongoose.connect('mongodb://localhost:27017/mymoviesDB',  
{ useNewUrlParser: true, 
  useUnifiedTopology: true 
});


// GET requests

//this setups a message once the user goes to the home page of the website.
app.get('/', (request, response) => {
  response.send('Welcome to mymoviesDB!');
});


// Get all users
app.get('/users', passport.authenticate('jwt', { session: false }),(req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//get a user by username
app.get('/users/:userName', (req, res) => {
  Users.findOne({ username: req.body.userName })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//gets a JSON object of all the current movies on the server
app.get('/movies', passport.authenticate('jwt', { session: false }),
 (req, res) => {
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

/*// Create a new user
app.post('/users', (req, res) => {
  // Hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(req.body.Password, saltRounds);

  // Create a new User object
  const newUser = new Users({
    username: req.body.Username,
    password: hashedPassword,
    email: req.body.Email,
    birthday: req.body.Birthday
  });

  // Save the new user to the database
  newUser.save()
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});*/

// Create a new user
app.post('/users', (req, res) => {
  // Hash the password using bcrypt
  const hashedPassword = bcrypt.hashSync(req.body.Password, saltRounds);

  // Create a new User object
  const newUser = new Users({
    username: req.body.Username,
    password: hashedPassword,
    email: req.body.Email,
    birthday: req.body.Birthday
  });

  // Save the new user to the database
  newUser.save()
    .then((user) => {
      // Generate a JWT
      const token = jwt.sign({ username: user.username }, 'your_secret_key');

      // Send the JWT as a response
      res.status(201).json({
        token: token,
        user: user
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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




// Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned//
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
  });
    
   //this is a error code to dectect erros in the code above.
  app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There was an error. Please try again later.');
  });


//if everything functions correctly this message is logged from port 8080 thats listening.
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});