const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/*const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  genre: {
    id: String,
    name: String
  },
  director: {
    id: String,
    name: String,
    birthyear: String,
  },
  Actors: [String],
  id: String,
  title: String,
  description: String,
  imageurl: String,
  Featured: Boolean
});*/

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Updated to 'title' and marked as required
  description: { type: String, required: true }, // Updated to 'description' and marked as required
  genre: {
    id: String,
    name: String
  },
  director: {
    id: String,
    name: String,
    birthyear: String,
  },
  actors: [String],
  imageurl: String,
  featured: Boolean
});


const Movie = mongoose.model('Movie', movieSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthDate: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],

});

userSchema.methods.validatePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (err, result) {
    if (err) {
      return callback(err);
    }
    callback(null, result);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = {
  Movie: Movie,
  User: User
};



module.exports.Movie = Movie;
module.exports.User = User;
