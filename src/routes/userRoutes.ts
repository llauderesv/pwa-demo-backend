import express from 'express';
import authMiddleware from '../middleware/authMiddleware';

function router() {
  const userRoutes = express.Router();

  userRoutes.use(authMiddleware);
  userRoutes.route('/').get((req, res) => {
    res.send('Hello World');
  });

  return userRoutes;
}

export default router;
