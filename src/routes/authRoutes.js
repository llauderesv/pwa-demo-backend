const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const { mongoDBConfig } = require('../config/index');

const authRouter = express.Router();

// Sign In Route...
authRouter
  .route('/signin')
  .post(passport.authenticate('local', { session: false }), (req, res) => {
    res.json({
      data: req.user,
      message: 'Successfully Logged In.',
      status: res.statusCode,
    });
  });

// Sign Up Route...
authRouter.route('/signup').post((req, res) => {
  const { email_address, name, password } = req.body;
  const { url, database } = mongoDBConfig;

  if (!email_address && !name && !password) return;

  // Save to mongodb
  (async function signUpUserHandler() {
    let client;

    try {
      // Generate Salt key..
      bcrypt.genSalt(10, (error, salt) => {
        if (error) {
          throw new Error(error);
        }

        // Hash password
        bcrypt.hash(password, salt, null, async function(error, hash) {
          if (error) return;

          client = await MongoClient.connect(
            url,
            { useNewUrlParser: true }
          );
          debug('Successfully connected to MongoDB Client');

          const db = client.db(database);
          const col = db.collection('users');

          // Check if email address is already used.
          const userWithSameEmailAddress = await col.findOne({ email_address });

          if (
            userWithSameEmailAddress &&
            userWithSameEmailAddress.email_address
          ) {
            res.json({
              message:
                'Email address is already used. Please specify another one.',
            });
          } else {
            const result = await col.insertOne({
              email_address,
              name,
              password: hash,
            });

            res.json({ message: 'Successfully Registered.', result });
          }
          client.close();
        });
      });
    } catch (error) {
      debug(`Error: ${error}`);
      res.json({ message: error.stack });
    }
  })();
});

module.exports = authRouter;
