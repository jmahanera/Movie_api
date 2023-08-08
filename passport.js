// Importing required modules
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwtSecret = "jwtSecret";
const Models = require("./models.js");
const passportJWT = require("passport-jwt");

// Accessing the User model from the Models module
let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// Configuring Passport with LocalStrategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // Specify the field name for the username
      passwordField: "password", // Specify the field name for the password
    },
    (username, password, callback) => {
      console.log(username + "  " + password);
      // Finding a user with the given username in the database
      Users.findOne({ username: username })
        .then((user) => {
          if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username or password.",
            });
          }
          // Validating the password using the validatePassword method
          if (!user.validatePassword(password)) {
            console.log("incorrect password");
            return callback(null, false, { message: "Incorrect password." });
          }
          console.log("finished");
          // If username and password are correct, return the user object
          return callback(null, user);
        })
        .catch((error) => {
          console.log(error);
          callback(error);
        });
    }
  )
);

// Configuring Passport with JWTStrategy for JSON Web Token authentication
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      secretOrKey: jwtSecret, // Use the jwtSecret variable as the secret key
    },
    (jwtPayload, callback) => {
      // Finding a user with the provided JWT Payloads _id in the database
      return Users.findById(jwtPayload._id)
        .then((user) => {
          // User found, return the user object
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
