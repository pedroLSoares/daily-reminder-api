var express = require('express');
const tasksRouter = require('./src/tasks/Routes');
const userRouter = require('./src/users/routes');
const { connect } = require('./src/Mongo/database');
require('./src/strategies/authStrategies');
require('dotenv').config();
connect();
var app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(tasksRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
