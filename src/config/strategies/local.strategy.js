const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:localStrategy');
const { mongoDBConfig } = require('../index');
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
            const { name, email_address } = user;
            generateAccessToken({ name, email_address });
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

function generateAccessToken(payload) {
  const options = { expiresIn: '1h', algorithm: 'RS256' };
  // Require the certificate
  const cert = fs.readFileSync(path.join('./', 'certs', 'key.pem'));
  
  jwt.sign(payload, cert, options, (error, token) => {
    debug(error);
    // if (error) throw new Error(error);

    debug(`Access Token: ${token}`);
  });
}

module.exports = localStrategy;
