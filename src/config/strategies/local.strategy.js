const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');
const { mongoDBConfig } = require('../index');
const bcrypt = require('bcrypt-nodejs');

function localStrategy() {
  const userFields = {
    usernameField: 'email_address',
    passwordField: 'password',
  };

  passport.use(new Strategy(userFields, authenticate));
}

function authenticate(email_address, password, done) {
  const { url, database } = mongoDBConfig;

  (async function mongo() {
    let client;

    try {
      client = await MongoClient.connect(
        url,
        { useNewUrlParser: true }
      );
      debug('Successfully connected to MongoDB Client');

      const db = client.db(database);
      const col = db.collection('users');
      const user = await col.findOne({ email_address });

      if (user && user.password) {
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) done(null, false);

          if (res === true) {
            const { name, email_address } = user;
            done(null, { name, email_address });
          }

          done(null, false);
        });
      } else {
        done(null, false);
      }
    } catch (error) {
      debug(`Error: ${error.stack}`);
      done(null, false);
    }

    client.close();
  })();
}

module.exports = localStrategy;
