import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import { Request, Response, NextFunction } from 'express';
import { mongoDBConfig } from '../config/index';
import { MongoClient } from 'mongodb';
import User from '../models/user';

const debug = require('debug')('app:auth');

const signIn = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user: User, info) => {
    if (err) return next(err);

    if (!user) {
      res.status(401);
      return res.json({
        message: info.message,
        status: res.statusCode,
      });
    } else {
      return res.json({
        message: 'Successfully Sign In.',
        data: <User>user,
        status: res.statusCode,
      });
    }
  })(req, res, next);
};

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
