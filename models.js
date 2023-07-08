const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
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

const Movie = mongoose.model('Movie', movieSchema); // Initialize Movie variable here

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthaDte: Date,
});

userSchema.statics.hashPassword = function (password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

const User = mongoose.model('User', userSchema);
