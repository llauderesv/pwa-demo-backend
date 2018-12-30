import passport from 'passport';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import { mongoDBConfig } from '../config/index';
import { MongoClient } from 'mongodb';
const debug = require('debug')('app:auth');

import User from '../models/user';

const signIn = [
  passport.authenticate('local', { session: false }),
  (req: Request, res: Response) => {
    res.json({
      data: <User>req.user,
      message: 'Successfully Logged In.',
      status: res.statusCode,
    });
  },
];

const signUp = (req: Request, res: Response) => {
  const { email_address, name, password } = <User>req.body;
  const { url, database } = mongoDBConfig;

  if (!email_address && !name && !password) return;

  // Save to mongodb
  (async function signUpUserHandler() {
    let client;

    try {
      // Generate Salt key..
      bcrypt.genSalt(10, (error, salt) => {
        if (error) throw error;

        // Hash password
        bcrypt.hash(password, salt, () => {}, async function(error, hash) {
          if (error) return;

          client = await MongoClient.connect(
            url,
            { useNewUrlParser: true }
          );
          debug('Successfully connected to MongoDB Client');

          const db = client.db(database);
          const col = db.collection('users');

          // Check if email address is already used.
          const userWithSameEmailAddress = await col.findOne({
            email_address,
          });

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
};

export { signIn, signUp };
