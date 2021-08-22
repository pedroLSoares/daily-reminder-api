const Tasks = require('./Model');

const TaskService = ({ task = Tasks }) => {
  async function registerTask(taskData) {
    try {
      const { name, description } = taskData;
      const createdTask = await task.create({
        name,
        description,
      });

      return [createdTask, undefined];
    } catch (error) {
      console.log('Unable to connect to the database:', error);
      return [undefined, error];
    }
  }

  async function getAll() {
    const tasks = await task.find({});

    return tasks;
  }

  return { registerTask, getAll };
};

module.exports = {
  TaskService,
};
