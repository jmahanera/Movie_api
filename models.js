const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const movieSchema = mongoose.Schema({
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

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
