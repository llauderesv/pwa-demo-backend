const passport = require('passport');
const debug = require('debug')('app:passport');
require('./strategies/local.strategy')();

function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Stores User in the session...
  passport.serializeUser((user, done) => {
    debug('serializeUser', user);
    done(null, user);
  });

  // Retrieves User from the session
  passport.deserializeUser((user, done) => {
    debug('deserializeUser', user);
    done(null, user);
  });

  // TODO: Implement Local Strategy
}

module.exports = passportConfig;
