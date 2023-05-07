// Importing the Mongoose library to connect with the MongoDB database.
const mongoose = require('mongoose');


// Creating a User model using the userSchema.
let user = mongoose.model('user', userSchema);

// Creating a Movie model using the movieSchema.
let Movie = mongoose.model('movie', movieSchema);

// Defining a schema for users that includes their personal details and favorite movies.
let userSchema = new mongoose.Schema({
    username:{type: 'string', required: true, unique: true},
    password:{type: 'string', required: true},
    email:{type: 'string', required: true},
    birthday: Date,
    favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'movie'}]
});

// Defining a schema for movies that includes various details about a movie.
let movieSchema = mongoose.Schema({
    title:{type: 'string', required: true},
    description: {type: 'string', required: true},
    genre: {
        name: 'string',
        description: 'string',
    },
    director: {
        name: 'string',
        bio: 'string',
    },
    actors: ['string'],
    ImagePath: 'string',
    Featured: Boolean
});

const User = mongoose.model('User', userSchema);

// Exporting the User models so that they can be accessed by other modules.
module.exports = user;

// Exporting the Movie models so that they can be accessed by other modules.
module.exports.Movie = Movie;
