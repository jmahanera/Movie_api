const mongoose = require('mongoose');
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
    Featured: Boolean
});

let userSchema = mongoose.schema({
    Username:{type: string, require: true},
    Password:{type: string, require: true},
    Email:{type: string, require: true},
    Birthday: Date
    favoriteMovies: [{type: mongoose.schema.types.objectID, ref: 'Movie'}]

});
 let movie = mongoose.model('movie', movieSchema);
 let user = mongoose.model('user', user.userSchema);

 module.exports.movie = movie;
 module.exports.user = user;