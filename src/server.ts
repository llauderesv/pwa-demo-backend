import http from 'http';
import https from 'https';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import morgan from 'morgan';

import app from './app';

app.disable('x-powered-by');

app.use(morgan('tiny'));
app.set('port', process.env.PORT);

// Certificate options
const options = {
  key: fs.readFileSync(path.join('./certs', 'key.pem'), 'utf8'),
  cert: fs.readFileSync(path.join('./certs', 'server.crt'), 'utf8'),
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

// Listen to http
httpServer.listen(8080, function() {
  console.log(`Server listening on port ${chalk.blue()}`);
});

// Listen to https
httpsServer.listen(app.get('port'), function() {
  console.log(`Server listening on port ${chalk.blue(app.get('port'))}`);
});
