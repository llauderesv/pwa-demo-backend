const express = require('express');
const debug = require('debug')('app:userRoutes');
const authMiddleWare = require('../middleware/authMiddleware');

function router() {
  const userRoutes = express.Router();

  // Authentication Middleware...
  userRoutes.use(authMiddleWare());

  // Get
  userRoutes.route('/').get((req, res) => {
    res.send('Hello World');
  });

  return userRoutes;
}

module.exports = router;
