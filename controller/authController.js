const { promisify } = require('util');
const crypto = require('crypto');
const User = require('./../models/userModel');
const catchAsyncErrors = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const Email = require('./../utils/email');
const catchAsyncError = require('../utils/catchAsyncError');
const createToken = (id) => {
  /**jwt.sign(payload, secretOrPrivateKey, [options, callback]) */
  return jwt.sign({ id }, process.env.jwt_secret_private_key, {
    expiresIn: process.env.jwt_expires_in,
  });
};
const createSendToken = (user, statusCode, res) => {
  // console.log('SEND TOKEN CHYA AAT MADHE', user);

  const token = createToken(user._id);
  const cookieOptions = {
    // expires: new Date(
    //   Date.now() + process.env.jwt_cookie_expire * 24 * 60 * 60 * 1000,
    // ),
    httpOnly: true,
    secure: true, // Ensures the browser only sends the cookie over HTTPS
    sameSite: 'None',
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  console.log('HA AHE FRESH USER', user);
  console.log('HA AHE NAVIN USER WITH CHANGED PASSWORD', user, token);

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user,
      token,
    },
  });
};
exports.signup = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.body);
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}/me`;
  // console.log(url);
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = async (req, res, next) => {
  console.log(req.body);
  // if (!req.body.email.email) {

  const { email, password } = req.body;
  // }
  // } else {
  //   const email = req.body.email.email;
  //   const password = req.body.email.password;
  // }

  /**1) CHECK IF BOTH EMAIL AND PASSWORD WAS ENTERED BY USER AND GENERATE AN ERROR MESSAGE IF NOT ENTERED  */
  if (!email || !password) {
    return next(
      new AppError(`Please provide email id and password!!  ${req.body}`),
      401,
    );
  }
  /**2) VERIFY WHETHER THE USER ENTERED EMAIL AND PASSWORD ARE ALREADY PRESENT IN MY DATABASE  */
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  /**3) IF VERIFICATION IS SUCCESSFUL THEN SEND A TOKEN TO THE USER  */
  createSendToken(user, 200, res);
};

exports.protect = catchAsyncErrors(async (req, res, next) => {
  /**1) Get the token and check if it is present or not */
  console.log('HA AHE protect REQ CHA COOKIE', req?.cookies?.jwt);

  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Otherwise, check for a cookie named "jwt" and use its value as the token

  if (!token) {
    return next(
      new AppError(
        'You are currently not logged in . Please login to get access MADARCHOD HAI TU',
        401,
      ),
    );
  }
  /**2) Verify whether it is correct token or not */

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.jwt_secret_private_key,
  );

  /**3) Check if user still exists (IF I HAVE DELETED USER FROM DATABASE AFTER I SIGNUP THE USER)*/
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('User belonging to this token no longer exists', 401),
    );
  }
  /**4) Check if user changed password after token was issued */
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User has recently changed the password!! Please login again',
      ),
      401,
    );
  }
  /**5) GRANT ACCESS TO PROTECTED ROUTES-->IMP IN RESTRICT-TO */

  req.user = freshUser;

  res.locals.user = freshUser;

  next();
});

// exports.isLoggedIn = catchAsyncError(async (req, res, next) => {
//   console.log('HA AHE ISLOGGED IN');

//   /**1) Get the token and check if it is present or not */
//   if (req.cookies.jwt) {
//     try {
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.jwt_secret_private_key,
//       );
//       /**2) Check if user still exists (IF I HAVE DELETED USER FROM DATABASE AFTER I SIGNUP THE USER)*/
//       const freshUser = await User.findById(decoded.id);

//       if (!freshUser) {
//         return next();
//       }
//       /**3) Check if user changed password after token was issued */
//       if (freshUser.changePasswordAfter(decoded.iat)) {
//         return next();
//       }
//       /**4) GRANT ACCESS TO PROTECTED ROUTES-->IMP IN RESTRICT-TO */
//       res.locals.user = freshUser;

//       // res.status(200).json({
//       //   status: 'success',
//       //   user: freshUser,
//       // });
//       return next();
//     } catch (err) {
//       // res.status(200).json({
//       //   status: 'unknown',
//       //   message: 'No fresh user',
//       // });
//       return next();
//     }
//   } else {
//     // res.status(200).json({
//     //   status: 'unknown',
//     //   message: 'No fresh user',
//     // });
//     next();
//   }
// });

exports.isLoggedIn = catchAsyncError(async (req, res, next) => {
  /**1) Get the token and check if it is present or not */
  console.log('HA AHE ISLOGGEDIN REQ CHA COOKIE', req?.cookies?.jwt);

  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.jwt_secret_private_key,
      );
      /**2) Check if user still exists (IF I HAVE DELETED USER FROM DATABASE AFTER I SIGNUP THE USER)*/
      const freshUser = await User.findById(decoded.id);
      console.log('HA AHE RE FRESH USER');

      if (!freshUser) {
        return next();
      }
      /**3) Check if user changed password after token was issued */
      if (freshUser.changePasswordAfter(decoded.iat)) {
        return next();
      }
      /**4) GRANT ACCESS TO PROTECTED ROUTES-->IMP IN RESTRICT-TO */
      res.locals.user = freshUser;

      return next();
    } catch (err) {
      return next();
    }
  } else {
    next();
  }
});

exports.logOut = (req, res) => {
  // console.log('LOGOUT CALL HUA ');

  res.cookie('jwt', 'loggedOut', {
    httpOnly: true,
    secure: true, // Ensures the browser only sends the cookie over HTTPS
    sameSite: 'None', // If the original cookie has 'secure', this should too
    expires: new Date(Date.now() + 10 * 1000), // Set the expiry time as needed
    path: '/', // Ensure the path is the same as the original cookie
  });

  res.status(200).json({
    status: 'success',
  });
};
exports.restrictTo = (...roles) => {
  /**WE CANNOT PASS PARAMETER TO MIDDLE-WARE FUNCTION SO WE HAVE CREATED A WRAPPER FUNCTION WHICH WILL RETURN MIDDLE-WARE FUNCTION */
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  /**1) GET USER BASED ON POSTAL EMAIL */
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  /**2) GENERATE A RANDOM TOKEN */
  const resetToken = user.passReset();

  await user.save({ validateBeforeSave: false });
  try {
    /**3) SEND IT TO USER'S EMAIL */
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token has been send to email !',
    });
  } catch (err) {
    console.log(err);
    (user.passwordResetExpires = undefined),
      (user.passwordResetToken = undefined),
      await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'THERE WAS AN ERROR SENDING EMAIL!!  PLEASE TRY AGAIN LATER',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  /**1) GET USER BASED ON TOKEN --> TOKEN SEND IN USER URL SHOULD MAP WITH TOKEN PRESENT IN DATABASE */

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  /**2) IF TOKEN IS NOT EXPIRED AND THERE IS A USER SET HIS NEW PASSWORD   */

  if (!user) {
    return next(new AppError('Token has expired !!', 400));
  }
  user.password = req.password;
  user.passwordConfirm = req.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  /**3) UPDATE changePasswordAt property for user  */

  /**4) LOG the user in send JWT*/

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  /**1) GET THE USER FROM THE COLLECTION*/
  const user = await User.findById(req.user.id).select('+password');
  console.log('ALA RE ALA UPDATE PASSWORD ALA', req.body, user.password);

  /**2) CHECK IF POSTED CURRENT PASSWORD IS CORRECT OR NOT*/

  if (!user.correctPassword(req.body.passwordCurrent, user.password))
    return next(new AppError('You have entered incorrect Password ', 401));

  /**3) IF SO THEN UPDATE PASSWORD --> we cannot user findByIdAndUpdate*/

  // console.log(req.body, req.body.data.password, req.body.passwordConfirm);
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  /**4) LOG USER IN SEND A JWT*/

  createSendToken(user, 200, res);
});
