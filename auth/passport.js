const passport      = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel      = require('../models/userModel');

passport.use(new GoogleStrategy({
  clientID:     process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL:  '/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    const newUser = {
      googleId:    profile.id,
      displayName: profile.displayName,
      firstName:   profile.name.givenName,
      lastName:    profile.name.familyName,
      email:       profile.emails[0].value,
    };

    let user = await userModel.getUserById(profile.id);
    if (!user) {
      user = await userModel.createNewUser(Object.values(newUser));
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
