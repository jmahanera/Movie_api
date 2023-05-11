const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: { type: 'String', required: true, unique: true },
    password: { type: 'String', required: true },
    email: { type: 'String', required: true },
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'movie' }]
});

let movieSchema = mongoose.Schema({
    title: { type: 'String', required: true },
    description: { type: 'String', required: true },
    genre: {
        name: 'String',
        description: 'String',
    },
    director: {
        name: 'String',
        bio: 'String',
    },
    imageUrl: { type: 'String', required: true },
    actors: ['String'],
});

let Movie = mongoose.model('movie', movieSchema);
let User = mongoose.model('user', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;