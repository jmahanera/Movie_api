const mongoose = Require('mongoose');

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

let userSchema = mongoose.schema({
    username:{type: string, require: true},
    password:{type: string, require: true},
    email:{type: string, require: true},
    birthday: Date,
    favoriteMovies: [{type: mongoose.schema.types.objectID, ref: 'movie'}]

});
 let Movie = mongoose.model('movie', movieSchema);
 let user = mongoose.model('user', user.userSchema);

 Module.exports.Movie = Movie;
 Module.exports.user = user;

