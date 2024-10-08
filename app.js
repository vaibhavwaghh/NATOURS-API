const express = require('express');
const path = require('path');
const morgan = require('morgan');
var xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
var hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');
const { application } = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cors({
    origin: 'http://localhost:5173', // Allow only this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

// // // Set Security HTTP headers
// // // set the Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      // connectSrc: ["'self'", 'https://natours-api-z82r.onrender.com'],
    },
  }),
);

// // Parse JSON request body and limit its size to 10KB
app.use(express.json({ limit: '10kb' }));

// // Configure the app to use URL-encoded request bodies
app.use(
  express.urlencoded({
    // Allow the middleware to parse complex objects and arrays
    extended: true,
    // Set a limit of 10 kilobytes for the incoming request body
    limit: '10kb',
  }),
);

// // The cookieParser() middleware is being used to parse cookies from incoming requests.
app.use(cookieParser());


// // //Limit requests from the same API to prevent abuse
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per window (per IP)
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', apiLimiter); // apply the rate limiter to API routes only

// // Sanitize request data to prevent NoSQL injection attacks
app.use(mongoSanitize());

// // Sanitize request data to prevent cross-site scripting (XSS) attacks
app.use(xss());

// // Prevent parameter pollution by whitelisting certain query parameters
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// // // Log HTTP requests in the console in the "dev" format

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(compression());


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);


app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server.`, 404),
  );
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
