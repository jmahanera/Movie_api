const express = require('express');
fs = require('fs');
path = require('path');
bodyParser = require('body-parser');
uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/mymoviesDB', 
{ useNewUrlParser: true, 
  useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.get('/movies', (req, res) => {
  Movies.find()
    .then(movies => {
      res.status(200).json(movies);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Read Get Movies by title
app.get('/movies/:title', (req, res) => {
  const {title} = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).json({message: 'Movie not found'});
  }
})

//Get Movies by GenreName
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).json({message: 'Genre not found'});
  }
})

//Get Movies by DirectorName
app.get('/movies/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).json({message: 'Director not found'});
  }
})

//Get data about a director by name
app.get('/movies/director_description/:Director', (req, res) => {
  movies.findOne({'Director.Name': req.params.Director})
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

app.get('/movies/director_description/:Director', (req, res) => {
  movies.findOne({'Director.Name': req.params.Director})
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


const Genres = Models.Genre;
const Directors = Models.Director;

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Biography: String,
    Birthyear: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

const users = [
  {
    _id: uuid.v4(),
    name: 'Dave',
    FavoriteMovies: [],
  },

  {
    _id: uuid.v4(),
    name: 'Annabel',
    FavoriteMovies: ['The Godfather'],
  },

  {
    _id: uuid.v4(),
    name: "Margot",
    FavoriteMovies: ["The Dark Knight", "Pulp Fiction"],
  }

];

let movies = [

  {
    "Title": "The Shawshank Redemption",
    "Genre": {
    "Name": "Drama",
    "Description":  "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
    "Director": {
    "Name": "Frank Darabont",
    "Biography": 'Frank Darabont is a Hungarian-American film director, screenwriter, and producer who has directed some of the most acclaimed films of the last three decades.',
    "Birthyear": 'January 28, 1959',
    },
    "ImageUrl": 'https://www.alamy.com/the-shawshank-redemption-image388458995.html'
  },

  {
    "Title": "The Godfather",
    "Genre": {
    "Name": "Crime",
    "Description": 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    },
    "Director": {
    "Name": "Francis Ford Coppola",
    "Biography": 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is widely regarded as one of the greatest filmmakers of all time.',
    "Birthyear": "April 7, 1939",
    },
    "ImageUrl": 'https://www.imdb.com/title/tt0068646/companycredits/'
  },

  {
    "Title": "The Dark Knight",
    "Genre": {
    "Name": "Action",
    "Description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    },
    "Director": {
    "Name": "Christopher Nolan",
    "Biography": "Christopher Nolan is a British-American film director, producer, and screenwriter. He is one of the most acclaimed and commercially successful filmmakers of the 21st century.",
    "Birthyear": "July 30, 1970",
    },
    "ImageUrl": 'https://www.alamy.com/stock-photo/the-dark-knight-2008.html?sortBy=relevant'
  },

  {
    "Title": "Pulp Fiction",
    "Genre": { 
    "Name": "Crime",
    "Description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    },
    "Director": {
    "Name": "Quentin Tarantino",
    "Biography": "Quentin Tarantino is an American film director, screenwriter, and producer. He is one of the most influential and iconic filmmakers of the last few decades.",
    "Birthyear": "March 27, 1963",
    },
    "ImageUrl": 'https://www.alamy.com/stock-photo/pulp-fiction.html?sortBy=relevant'
  },

  {
    "Title": "The Lord of the Rings: The Fellowship of the Ring",
    "Genre": {
    "Name": "Adventure",
    "Description": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    },
    "Director": { 
    "Name": "Peter Jackson",
    "Biography": "Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his adaptations of J.R.R. Tolkien\'s novels, including The Lord of the Rings trilogy and The Hobbit  trilogy.",
    "Birthyear": "October 31, 1961",
    },
    "ImageUrl": 'https://www.alamy.com/stock-photo-1970s-usa-lord-of-the-rings-film-poster-85316212.html?imageid=4E37C6C1-E8A1-4BDE-8636-EA9720202CD0&p=1337086&pn=1&searchId=7ca789875afa74b8ad1a6cbcdc6beb77&searchtype=0'
  },

  {
    "Title": "John Wick",
    "Genre": {
    "Name": "Action",
    "Description": "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    },
    "Director": {
    "Name": "Charles F. Stahelski",
    "Biography": "He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan.",
    "Birthyear": "20 September 1968",
    },
    "ImageUrl": 'https://www.alamy.com/stock-photo/john-wick.html?sortBy=relevant'
  },

  {
    "Title": "Citadel",
    "Genre": {
    "Name": "Drama",
    "Description": "Global spy agency Citadel has fallen, and its agents memories were wiped clean. Now the powerful syndicate, Manticore, is rising in the void. Can the Citadel agents recollect their past and summon the strength to fight back?",
    },
    "Director": {
    "Name": "Ciaran Foy",
    "Biography": "Ciarán Foy (born 1979) is an Irish film director and screenwriter, best known for directing and writing Citadel and directing Sinister 2. Foy was born in Northside Dublin in October 1979 and graduated from the National Film School",
    "Birthyear": "October 1979",
    },
    "ImageUrl": 'https://collider.com/citadel-images-priyanka-chopra-jonas-richard-madden/'
  },

];

//Update

app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }

})

//Create

app.post('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id}'s array.`);
  } else {
    res.status(400).send({message: 'no such user'});
  }

})

//Delete

app.delete('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send('${movieTitle} has been removed from user $(id) `s array');;
  } else {
    res.status(400).send('no such user');
  }

});

//Delete

app.delete('/users/:id', (req, res) => {
  const {id} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send('user ${id} has been deleted');
  } else {
    res.status(400).send({message: 'no such user'});
  }

})


app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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


app.listen(8080, () => console.log ('Listening on port 8080'))