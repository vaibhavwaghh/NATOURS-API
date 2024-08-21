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

const sendErrorDev = (err, req, res) => {
  /**1) FOR API */
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    /**2) FOR RENDERED WEBSITE */
    res
      .status(err.statusCode)
      .render('error', { title: 'Something went wrong!', msg: err.message });
  }
};
const sendErrorProd = (err, req, res) => {
  /**OPERATIONAL (TRUSTED ) ERRORS SEND MESSAGE TO CLIENT */
  if (req.originalUrl.startsWith('/api')) {
    /**1) FOR API */
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      /**PROGRAMMING OR OTHER UNKNOWN (NOT TRUSTED)ERRRORS : DO NOT LEAK DETAILS TO CLIENT */
      /**LOG ERROR */
      console.error('ERROR', err);
      return res.status(500).json({
        status: 'ERROR',
        message: 'Something went wrong',
      });
    }
  } else {
    /**2) FOR RENDERED WEBSITE */
    if (err.isOperational) {
      return res
        .status(err.statusCode)
        .render('error', { title: 'Something went wrong!', msg: err.message });
    } else {
      console.log(err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
    }
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
  console.log('THIS IS ERROR THROWN', err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
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
    sendErrorProd(err, req, res);
  }
};
