const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const { mongoDBConfig } = require('../index');
const debug = require('debug')('app:localStrategy');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

function localStrategy() {
  const userFields = {
    usernameField: 'email_address',
    passwordField: 'password',
  };

  passport.use(new Strategy(userFields, authenticate));
}

function authenticate(email_address, password, done) {
  const { url, database } = mongoDBConfig;

  // Authentication Handler
  (async function authenticateUser() {
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
            const { _id, name, email_address } = user;
            const options = { expiresIn: '1h', algorithm: 'RS256' };
            const cert = fs.readFileSync(path.join('./', 'certs', 'key.pem'));
            // Generate access token
            const token = jwt.sign({ _id, name, email_address }, cert, options);
            done(null, { token });
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
