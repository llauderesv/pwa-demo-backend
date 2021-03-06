import passport from 'passport';
import { Strategy } from 'passport-local';
import { MongoClient } from 'mongodb';
import { mongoDBConfig } from '../index';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
const debug = require('debug')('app:localStrategy');

function localStrategy() {
  const userFields = {
    usernameField: 'email_address',
    passwordField: 'password',
  };

  passport.use(
    new Strategy(userFields, (email_address, password, done) => {
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
              if (err) return done(undefined, false);

              if (!res)
                return done(undefined, false, {
                  message: 'Invalid Email address or Password',
                });

              const { _id, name, email_address } = user;
              const options = { expiresIn: '1h', algorithm: 'RS256' };
              const cert = fs.readFileSync(path.join('./', 'certs', 'key.pem'));
              const token = jwt.sign(
                { _id, name, email_address },
                cert,
                options
              );

              return done(undefined, { token });
            });
          } else {
            return done(undefined, false, {
              message: 'Invalid Email address or Password',
            });
          }
        } catch (error) {
          debug(`Error: ${error.stack}`);
          return done(undefined, false);
        }
        client && client.close();
      })();
    })
  );
}

export default localStrategy;
