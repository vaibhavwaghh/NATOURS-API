const mongoose = require('mongoose');
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION ! SHUTTING DOWN ');
  server.close(() => {
    process.exit(1);
  });
});
dotenv.config({ path: `${__dirname}/config.env` });
console.log(process.env.PASSWORD);
const app = require('./app');

/**ENVIRONMENT VARIABLES*/

/**USING MONGOOSE LIBRARY */

const DBurl = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose
  .connect(DBurl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  });

const port = process.env.PORT || 3000;
/**START THE SERVER */
const server = app.listen(port, '127.0.0.1', () => {
  console.log('Listening buddy');
});
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION ! SHUTTING DOWN ');
  server.close(() => {
    process.exit(1);
  });
});
