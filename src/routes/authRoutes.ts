import express from 'express';
import { signIn, signUp } from '../controllers/auth';

function router() {
  const authRouter = express.Router();

  authRouter.route('/sign-in').post(signIn);
  authRouter.route('/sign-up').post(signUp);

  return authRouter;
}

export default router;
