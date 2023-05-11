// Importing the Mongoose library to connect with the MongoDB database.
const mongoose = require('mongoose');

// Defining a schema for users that includes their personal details and favorite movies.
let userSchema = new mongoose.Schema({
    username:{type: 'String', required: true, unique: true},
    password:{type: 'String', required: true},
    email:{type: 'String', required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'movie'}]
});


// Defining a schema for movies that includes various details about a movie.
let movieSchema = mongoose.Schema({
    title:{type: 'String', required: true},
    description: {type: 'String', required: true},
    genre: {
        name: 'String',
        description: 'String',
    },
    director: {
        name: 'String',
        bio: 'String',
    },

    imageUrl: {type: 'String', required: true},
    actors: ['String'],
   
});

let Movie = mongoose.model('movie', movieSchema);// Creating a Movie model using the movieSchema.let Movie = mongoose.model('movie', movieSchema);// Creating a Movie model using the movieSchema.
let User = mongoose.model('user', userSchema);// Creating a User model using the userSchema.

// Exporting the Movie models so that they can be accessed by other modules.
module.exports.Movie = Movie;

// Exporting the User models so that they can be accessed by other modules.
module.exports.User = User;

