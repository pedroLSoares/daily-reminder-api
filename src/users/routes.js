const express = require('express');
const UserService = require('./Service');
const userRouter = express.Router();
const {
  authMiddleware,
  bearerMiddleware,
} = require('../middlewares/auth-middleware');

const userService = UserService();
userRouter.get('/users', bearerMiddleware, (req, res) => {
  res.send('Birds home page');
});

userRouter.post('/user/register', async (req, res) => {
  const [result, error] = await userService.register(req.body);

  if (result) {
    res.status(201).json();
  }
  if (error) {
    res.status(500).json(error);
  }
});

userRouter.post('/user/login', authMiddleware, async (req, res) => {
  await userService.login(req, res);
});

userRouter.get('/user/verify-email/:token', async (req, res) => {
  try {
    await userService.verifyEmail(req.params.token);

    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

module.exports = userRouter;
