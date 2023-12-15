const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsyncError(async (req, res, next) => {
  /**1) GET TOUR DATA FROM COLLECTION */
  const tours = await Tour.find();

  /**2) BUILD TEMPLATE */
  /**3) RENDER THE TEMPLATE  */
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});
exports.getTour = catchAsyncError(async (req, res, next) => {
  /**1) GET DATA FOR REQUESTED TOUR (INCLUDE REVIEWS AND GUIDES) */
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('THERE IS NO TOUR WITH THAT NAME', 404));
  }
  /**2) BUILD TEMPLATE  */

  /**3) RENDER THE TEMPLATE */
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  // Render the login template and send it to the client with a title of "Log into your account"
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.updateUserData = catchAsyncError(async (req, res, next) => {
  console.log(req.user);
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updateUser,
  });
});
