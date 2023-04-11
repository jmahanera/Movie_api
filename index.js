
const express = require('express');
bodyParser = require('body-parser');
uuid = require('node-uuid');

const app = express();
const port = 8080;

app.use(bodyParser.json());

let users = [
  {
    id: 1,
    name: "Dave",
    favoriteMovies: [],
    
  },

  {
    id: 2,
    name: "Annabel",
    favoriteMovies: ["Citadel", "The God Father"],
    
  },

  {
    id: 3,
    name: "Margot",
    favoriteMovies: ["The Dark Knight", "Pulp Fiction"],
    
  }

];

// add more empty objects for more users
users.push({
  id: uuid.v4(),
  name: '',
  email: '',
  age: '',
  gender: ''
});

let movies = [

  {
    "Title": "The Shawshank Redemption",
    "Description": 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    "Genre": "Drama",
    "DirectorName": "Frank Darabont",
    "DirectorBio": 'Frank Darabont is a Hungarian-American film director, screenwriter, and producer who has directed some of the most acclaimed films of the last three decades.',
    "dDirectorDOB": 'January 28, 1959',
    "ImageUrl": 'https://www.imdb.com/title/tt0111161/mediaviewer/rm1125988352/'
  },
  {
    "Title": "The Godfather",
    "Description": 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    "Genre": "Crime",
    "DirectorName": "Francis Ford Coppola",
    "DirectorBio": 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is widely regarded as one of the greatest filmmakers of all time.',
    "DirectorDOB": "April 7, 1939",
    "ImageUrl": "https://www.imdb.com/title/tt0068646/mediaviewer/rm2576136960/"
  },
  {
    "Title": "The Dark Knight",
    "Description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "Genre": "Action",
    "DirectorName": "Christopher Nolan",
    "DirectorBio": "Christopher Nolan is a British-American film director, producer, and screenwriter. He is one of the most acclaimed and commercially successful filmmakers of the 21st century.",
    "DirectorDOB": "July 30, 1970",
    "ImageUrl": "https://www.imdb.com/title/tt0468569/mediaviewer/rm4134867200/"
  },
  {
    "Title": "Pulp Fiction",
    "Description": "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    "Genre": "Crime",
    "DirectorName": "Quentin Tarantino",
    "DirectorBio": "Quentin Tarantino is an American film director, screenwriter, and producer. He is one of the most influential and iconic filmmakers of the last few decades.",
    "DirectorDOB": "March 27, 1963",
    "ImageUrl": "https://www.imdb.com/title/tt0110912/mediaviewer/rm1226096128/"
  },
  {
    "Title": "The Lord of the Rings: The Fellowship of the Ring",
    "Description": "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    "Genre": "Adventure",
    "DirectorName": "Peter Jackson",
    "DirectorBio": "Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his adaptations of J.R.R. Tolkien\'s novels, including The Lord of the Rings trilogy and The Hobbit  trilogy.",
    "DirectorDOB": "October 31, 1961",
    "ImageUrl": "https://www.imdb.com/title/tt0120737/mediaviewer/rm1432670976/"
  },
  {
    "Title": "John Wick",
    "Description": "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.",
    "Genre": "Action",
    "DirectorName": "Charles F. Stahelski",
    "DirectorBio": "He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan.",
    "DirectorDOB": "20 September 1968",
    "ImageUrl": "https://www.themoviedb.org/collection/404609-john-wick-collection/images/posters"
  },
  {
    "Title": "Citadel",
    "Description": "Global spy agency Citadel has fallen, and its agents memories were wiped clean. Now the powerful syndicate, Manticore, is rising in the void. Can the Citadel agents recollect their past and summon the strength to fight back?",
    "Genre": "Drama",
    "DirectorName": "Ciaran Foy",
    "DirectorBio": "Ciarán Foy (born 1979) is an Irish film director and screenwriter, best known for directing and writing Citadel and directing Sinister 2. Foy was born in Northside Dublin in October 1979 and graduated from the National Film School",
    "DirectorDOB": "October 1979",
    "ImageUrl": "https://www.imdb.com/title/tt9794044/mediaviewer/rm1456023553/?ref_=tt_ov_i"
  },

   

];

//Create users

app.post('/users', (req, res) => {
  const newUser = req.body;

  if (!newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else { 
    res.status(400).send({message: 'users need Names'});
  }
});

//Update

app.put('/users/:id', (req, res) => {
  const {id} = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send({message: 'no such user'});
  }

});

//Create

app.post('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send('$(MovieTitles) has been added to user $(id) s array.');;
  } else {
    res.status(400).send({message: 'no such user'});
  }

});

//Delete

app.delete('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send('${MovieTitle} has been removed from user $(id) `s array');;
  } else {
    res.status(400).send({message: 'no such user'});
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

});




//Read 
app.get('/Movies', (req, res) => {
  res.status(200).json(movies);
});

//Read 
app.get('/movies/:title', (req, res) => {
  const {title} = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).json({message: 'Movie not found'});
  }
});

//Read the
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find(movie => movie.genreName === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).json({message: 'Genre not found'});
  }
})


//Read the
app.get('/movies/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = movies.find(movie => movie.DirectorName === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(404).json({message: 'Director not found'});
  }
})



app.listen(8080, () => console.log ('Listening on port 8080'));