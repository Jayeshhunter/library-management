const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "482235761346-ogs1sa14tdcpm6kccr85flbvomq126iq.apps.googleusercontent.com",
      clientSecret: "NvDBdDHC47EXeeZ7OyE3WvdV",
      callbackURL: "http://localhost:3000/oauth/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
