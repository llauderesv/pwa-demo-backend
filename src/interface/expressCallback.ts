import * as express from 'express';

interface ExpressParameter {
  err: Error;
  req: express.Request;
  res: express.Response;
  next?: express.NextFunction;
}

export default ExpressParameter;
