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

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthdate: Date,
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
