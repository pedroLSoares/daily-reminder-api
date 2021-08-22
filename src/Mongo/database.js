const mongoose = require('mongoose');

const connect = async () =>
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

const close = () => mongoose.connection.close();

module.exports = { connect, close };
