const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/mymoviesDB',  
{ useNewUrlParser: true, 
  useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
});
app.use(morgan('combined', {
  stream: accessLogStream
}));

app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to mymoviesDB!');
  });



//Get all movies from DB
//Read 
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(200).json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Read Get Movies by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title }) // Fixed capitalization of "title"
    .then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).send('Movie not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err.message);
    });
});

  

//Get Movies by GenreName
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = Movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).json({message: 'Genre not found'});
  }
})

//Get Movies by DirectorName
app.get('/movies/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = Movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).json({message: 'Director not found'});
  }
})

//Get data about a director by name
app.get('/movies/director_description/:Director', (req, res) => {
  Movies.findOne({'Director.Name': req.params.Director})
  .then((movie) => {
    if (!movie) {
      return res.status(404).send('Error: ' + req.params.Director + ' was not found');
    } else {
      res.status(200).json(movie.Director);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// Allow User to Deregister
app.delete('/Users/:UserName', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.UserName })
    .then((User) => {
      if (!User) {
        res.status(400).send(req.params.UserName + ' was not found');
      } else {
        res.status(200).send(req.params.UserName + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//pdate users by ID
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.username,
        Password: req.body.password,
        Email: req.body.email,
        Birth: req.body.birth
      }
    },
    { new: true }
  )
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error: ' + err.message);
    });
});


//Delete a favorite movie from user ${id}

app.delete('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;

  let user = Users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send('${movieTitle} has been removed from user $(id) `s array');
  } else {
    res.status(400).send('no such user');
  }

});


// Delete User by ID
app.delete('/Users/:userId', (req, res) => {
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


app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then((createdUser) => {
            res.status(201).json(createdUser);
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
});


//Addd favorite movies to user 

app.post('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;

  let user = Users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array.`);
  } else {
    res.status(400).send({message: 'no such user'});
  }

})

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.put('/users/:Username', async (req, res) => {
  try {
    const { Username, Password, Email, Birthday } = req.body;

    // Validate input data
    // ...

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username,
          Password: hashedPassword,
          Email,
          Birthday
        }
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error.message);
  }
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
    
  // Error 
  app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There was an error. Please try again later.');
  });


app.listen(3000, () => console.log ('Listening on port 3000'))