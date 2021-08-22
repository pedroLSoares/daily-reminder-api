const express = require('express');
const { login } = require('./Service');
const tasksRouter = express.Router();
const {
  authMiddleware,
  bearerMiddleware,
} = require('../middlewares/auth-middleware');
const { TaskService } = require('./Service');
const taskService = TaskService({});

tasksRouter.get('/tasks', bearerMiddleware, async (req, res) => {
  const tasks = await taskService.getAll();

  if (tasks) {
    res.status(200).json(tasks);
  } else {
    res.status(500);
  }
});

tasksRouter.post('/task/register', bearerMiddleware, async (req, res) => {
  const [result, error] = await taskService.registerTask(req.body);

  if (result) {
    res.status(201).json();
  }
  if (error) {
    res.status(500).json(error);
  }
});

tasksRouter.post('/task/delete', authMiddleware, async (req, res) => {
  await login(req, res);
});

module.exports = tasksRouter;
