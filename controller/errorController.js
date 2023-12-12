const AppError = require('./../utils/appError');

const handleJWTError = (err) =>
  new AppError('Invalid token . Please login again!!', 401);

const handleTokenExpiredError = (err) =>
  new AppError('Your token has expired', 401);

const handleCastErrorDB = (err) => {
  const message = `INVALID ERROR ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldErrorDB = (err) => {
  const value = err.errmsg.match(/"([^"]*)"/g)[0].replace(/"/g, '');
  console.log(value);
  const message = `Duplicate field value : ${value} . Please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  /**OPERATIONAL (TRUSTED ) ERRORS SEND MESSAGE TO CLIENT */
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    /**PROGRAMMING OR OTHER UNKNOWN (NOT TRUSTED)ERRRORS : DO NOT LEAK DETAILS TO CLIENT */
    /**LOG ERROR */
    console.error('ERROR', err);
    /**SEND A MESSAGE */
    res.status(500).json({
      status: 'ERROR',
      message: 'Something went wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // res.status(err.statusCode).json({
  //   status: err.status,
  //   error: err,
  //   message: err.message,
  //   stack: err.stack,
  // });
  console.log('VAIBHAV');
  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
    /**BUG */
  } else {
    if (err.name === 'CastError') {
      console.log('cjsd');
      err = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      err = handleDuplicateFieldErrorDB(err);
    }
    if (err.name === 'ValidationError') {
      err = handleValidationError(err);
    }
    if (err.name === 'JsonWebTokenError') {
      err = handleJWTError(err);
    }
    if (err.name === 'TokenExpiredError') {
      err = handleTokenExpiredError(err);
    }
    sendErrorProd(err, res);
  }
};
