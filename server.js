const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');
const port = process.env.PORT || 3000;
console.log('THIS IS PORT',port);
process.on('uncaughtException', (err) => {
  console.log(err , err.name, err.message);
  console.log('UNCAUGHT EXCEPTION ! SHUTTING DOWN ');
  server.close(() => {
    process.exit(1);
  });
});

/**ENVIRONMENT VARIABLES*/

/**USING MONGOOSE LIBRARY */

const DBurl = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
mongoose
  .connect(DBurl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  });



/**START THE SERVER */
const server = app.listen(port, '127.0.0.1', () => {
  console.log('Server is listening');
});
process.on('unhandledRejection', (err) => {
  console.log('HA RIYAL ERROR',err,err.name, err.message);
  console.log('UNHANDLED REJECTION ! SHUTTING DOWN ');
  server.close(() => {
    process.exit(1);
  });
});
