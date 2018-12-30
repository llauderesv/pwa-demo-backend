import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import localStrategy from './config/strategies/local.strategy';
const debug = require('debug')('app');

const app = express();

// User Body Parser for submitting form...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({ secret: 'pwa-demo' }));

localStrategy();
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  debug('serializeUser', user);
  done(undefined, user);
});

passport.deserializeUser((user, done) => {
  debug('deserializeUser', user);
  done(undefined, user);
});

// Use to load static files in your app...
app.use(express.static('./public'));
// Load external library files from node_modules...
app.use('/css', express.static('./node_modules/bootstrap/dist/css/'));
app.set('views', path.join('./views'));
app.set('view engine', 'ejs');
app.use('/auth', authRouter());
app.use('/v1/user', userRouter());

// Custom Error handler...
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json(err);
  }
);

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
  });
});

export default app;
