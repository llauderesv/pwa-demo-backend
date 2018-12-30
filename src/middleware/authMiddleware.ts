import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
const debug = require('debug')('app:authMiddleware');

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers;
  const regEx = /(^\bBearer\s\b)/;
  let token;
  if (authorization) {
    token = authorization.replace(regEx, '');
  }

  if (token) {
    // Validate access token
    const cert = fs.readFileSync(path.join('./', 'certs', 'publickey.cer'));
    jwt.verify(
      token,
      cert,
      { algorithms: ['RS256'] },
      (error: jwt.VerifyErrors, decode) => {
        if (error) {
          next(error);
        }

        debug(decode);
      }
    );
  }

  next();
}

export default authMiddleware;
