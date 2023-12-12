const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  return newObject;
};
exports.createNewUser = (req, res) => {
  res.status(500).json({
    message: 'ROUTING NOT DEFINED FOR THIS ROUTE ! Please use /signup instead ',
  });
};

exports.updateMe = catchAsyncError(async (req, res, next) => {
  /**1) Create an error if user tells to update password*/
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for updating password . Please use /updateMyPassword',
        400,
      ),
    );
  }
  /**2) Filter out unwanted field names that are not allowed to be updated*/
  const filteredBody = filterObj(req.body, 'name', 'email');
  /**3) Update the user document*/
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = factory.getAll(User);
exports.getUserBasedOnId = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
