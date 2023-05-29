// Importing required modules
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

// Accessing the User model from the Models module
let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// Configuring Passport with LocalStrategy for username/password authentication
passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  // Finding a user with the given username in the database
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }
     // If no user found with the given username
    if (!user) {
      console.log('incorrect username');
      return callback(null, false, { message: 'Incorrect username or password.' });
    }

    console.log('finished');
    return callback(null, user);
  });
}));

// Configuring Passport with JWTStrategy for JSON Web Token authentication
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  /* Finding a user with the provided JWT Payload's _id in the database*/
  return Users.findById(jwtPayload._id)
    .then((user) => {
      // User found, return the user object
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error);
    });
}));
