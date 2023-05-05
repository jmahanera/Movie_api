// Importing the Mongoose library to connect with the MongoDB database.
const mongoose = Require('mongoose');

// Defining a schema for movies that includes various details about a movie.
let movieSchema = mongoose.schema({
    title:{type: string, require: true},
    description: {type: string, require: true},
    genre: {
        name: string,
        description: string,
    },
    director: {
        name: string,
        bio: string,
    },
    actors: [string],
    ImagePath: string,
    Featured: true
});

// Defining a schema for users that includes their personal details and favorite movies.
let userSchema = mongoose.schema({
    username:{type: string, require: true},
    password:{type: string, require: true},
    email:{type: string, require: true},
    birthday: Date,
    favoriteMovies: [{type: mongoose.schema.types.objectID, ref: 'movie'}]

});

// Creating a Movie model using the movieSchema
 let Movie = mongoose.model('movie', movieSchema);

 // Creating a User model using the userSchema.
 let user = mongoose.model('user', user.userSchema);


// Exporting the Movie and User models so that they can be accessed by other modules.
 Module.exports.Movie = Movie;
 Module.exports.user = user;

