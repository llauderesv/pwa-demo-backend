const express = require('express');
const path = require('path');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { mssqlConfig } = require('./src/config/index');

const app = express();
const port = process.env.PORT || 3001;

// sql
//   .connect(mssqlConfig)
//   .then(_ => debug('Successfully connected to the server!'))
//   .catch(error => debug(error));

app.use(morgan('tiny'));

// User Body Parser for submitting form...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({ secret: 'pwa-demo-2' }));

// Include passport js
require('./src/config/passport.js')(app);

// Use to load static files in your app...
app.use(express.static(path.join(__dirname, 'public')));

// Load external library files from node_modules...
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css/')));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

const authRouter = require('./src/routes/authRoutes');

app.use('/auth', authRouter);
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
  });
});

app.listen(port, () => {
  // Callback function when port is already opened.
  debug(`Listening on port ${chalk.blue(port)}`);
});
