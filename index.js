
const express = require('express');
app = express();
bodyParser = require('body-parser');
uuid = require('node-uuid');

app.use(bodyParser.json());

let users = [
  {
    id: uuid.v4(),
    name: '',
    email: '',
    age: '',
    gender:''
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
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: 'Drama',
    directorName: 'Frank Darabont',
    directorBio: 'Frank Darabont is a Hungarian-American film director, screenwriter, and producer who has directed some of the most acclaimed films of the last three decades.',
    directorDOB: 'January 28, 1959',
    imageUrl: 'https://www.imdb.com/title/tt0111161/mediaviewer/rm1125988352/'
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genre: 'Crime',
    directorName: 'Francis Ford Coppola',
    directorBio: 'Francis Ford Coppola is an American film director, producer, and screenwriter. He is widely regarded as one of the greatest filmmakers of all time.',
    directorDOB: 'April 7, 1939',
    imageUrl: 'https://www.imdb.com/title/tt0068646/mediaviewer/rm2576136960/'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: 'Action',
    directorName: 'Christopher Nolan',
    directorBio: 'Christopher Nolan is a British-American film director, producer, and screenwriter. He is one of the most acclaimed and commercially successful filmmakers of the 21st century.',
    directorDOB: 'July 30, 1970',
    imageUrl: 'https://www.imdb.com/title/tt0468569/mediaviewer/rm4134867200/'
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genre: 'Crime',
    directorName: 'Quentin Tarantino',
    directorBio: 'Quentin Tarantino is an American film director, screenwriter, and producer. He is one of the most influential and iconic filmmakers of the last few decades.',
    directorDOB: 'March 27, 1963',
    imageUrl: 'https://www.imdb.com/title/tt0110912/mediaviewer/rm1226096128/'
  },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    genre: 'Adventure',
    directorName: 'Peter Jackson',
    directorBio: 'Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his adaptations of J.R.R. Tolkien\'s novels, including "The Lord of the Rings" trilogy and "The Hobbit" trilogy.',
    directorDOB: 'October 31, 1961',
    imageUrl: 'https://www.imdb.com/title/tt0120737/mediaviewer/rm1432670976/'
  },
  {
    title: 'John Wick',
    description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.',
    genre: 'Action',
    directorName: 'Charles F. Stahelski',
    directorBio: 'He came from a kick-boxing background; he entered the film field as a stunt performer at the age of 24. Before that, he worked as an instructor at the Inosanto Martial Arts Academy in California, teaching Jeet Kune Do/Jun Fan.',
    directorDOB: '20 September 1968',
    imageUrl: 'https://www.themoviedb.org/collection/404609-john-wick-collection/images/posters'
  },
  {
    title: 'Citadel',
    description: 'Global spy agency Citadel has fallen, and its agents memories were wiped clean. Now the powerful syndicate, Manticore, is rising in the void. Can the Citadel agents recollect their past and summon the strength to fight back?',
    genre: 'Drama',
    directorName: 'Ciaran Foy',
    directorBio: 'Ciarán Foy (born 1979) is an Irish film director and screenwriter, best known for directing and writing Citadel and directing Sinister 2. Foy was born in Northside Dublin in October 1979 and graduated from the National Film School',
    directorDOB: 'October 1979',
    imageUrl: 'https://www.imdb.com/title/tt9794044/mediaviewer/rm1456023553/?ref_=tt_ov_i'
  },

   

];

//Read the
app.get('/Movies', (req, res) => {
  res.status(200).json(movies);
});

//Read the
app.get('/movies/:title', (req, res) => {
  const {title} = req.params;
  const movie = movies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).json({message: 'Movie not found'});
  }
});

//Read the
app.get('/movies/genre/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find(movie => movie.genreName === genreName);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(404).json({message: 'Genre not found'});
  }
})



app.Listen(8080, () => console.log ('Listening on port 8080'));