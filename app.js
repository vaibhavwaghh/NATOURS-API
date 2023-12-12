const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const app = express();
/**INITIALIZING PUG */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
/**SERVING STATIC FILES -->ACCESS */
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest hiker',
    user: 'Vaibhav',
  });
});
/**SET SECURITY HTTP HEADERS */
app.use(helmet());
/**USING MORGAN LIBRARY --> DEVELOPMENT LOGGING*/
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**LIMIT NUMBER OF USER REQUEST FROM SAME API */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many req from this IP . Try again in 1hr',
});
app.use('/api', limiter);

/**BODY PARSER --> READING DATA FROM BODY INTO REQ.BODY */
app.use(express.json({ limit: '10kb' }));

/**DATA SANITIZATION --> AGAINST NOSQL QUERY INJECTIONS */
app.use(mongoSanitize());
/**DATA SANITIZATION --> AGAINST XSS */
app.use(xss());
/**PREVENT PARAMETER POLLUTION */
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

/**ROUTER USAGE */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
/**UNHANDLED ROUTES */
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Cant find ${req.originalUrl} on this request`,
  // });
  // const err = new Error(`Cant find ${req.originalUrl} on this request`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // // console.log(err);

  next(new AppError(`Cant find ${req.originalUrl} on this request`, 404));
});

/**ERROR HANDLING MIDDLEWARE --> 4 PARAMETERS */
app.use(globalErrorHandler);
module.exports = app;
