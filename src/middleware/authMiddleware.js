const debug = require('debug')('authMiddleware');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

function authMiddleware() {
  function validateToken(req, res, next) {
    const { authorization } = req.headers;

    const regEx = /(^\bBearer\s\b)/;
    const token = authorization.replace(regEx, '');

    if (token) {
      // Validate access token
      const cert = fs.readFileSync(path.join('./', 'certs', 'publickey.cer'));
      jwt.verify(token, cert, { algorithms: 'RS256' }, (error, decode) => {
        if (error) {
          next(error);
        }

        debug(decode);
      });
    }

    next();
  }

  return validateToken;
}

module.exports = authMiddleware;
