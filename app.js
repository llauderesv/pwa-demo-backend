const express = require('express');
const path = require('path');
const chalk = require('chalk');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();
const port = process.env.PORT || 3001;

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

// Certificate options
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.crt'), 'utf8'),
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

// Listen to http
httpServer.listen(3002, function() {
  console.log(`Server listening on port ${chalk.blue(3002)}`);
});

// Listen to https
httpsServer.listen(port, function() {
  console.log(`Server listening on port ${chalk.blue(port)}`);
});
