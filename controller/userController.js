const catchAsyncError = require('../utils/catchAsyncError');
// const sharp = require('sharp');
const multer = require('multer');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');
const { logOut } = require('./authController');
/**UPLOAD IMAGES INTO THIS FOLDER */

/**1) Directly storing the image into destination */
// const upload = multer({ dest: 'public/img/users' });

/**2) Adding options like filtering before storing the image into destination */
// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFiler,
// });

/**3) In multerStorage I have 2 methods
 * METHOD 1 : DIRECTLY STORE IT INTO DISK STORAGE WITHOUT RESIZING IMAGE
 * METHOD 2 : 1) STORE IAMGE IN BUFFER 2) RESIZE IMAGE 3) STORE IMAGE IN DISK
 */

/**METHOD 1 : */
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     //user-3244434.jpg
//     const extensionOfThefilename = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${extensionOfThefilename}`);
//   },
// });

/**METHOD 2: */
const multerStorage = multer.memoryStorage();

const multerFiler = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    /**If the file is not an image file, call the callback with an error object and `false`*/
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFiler,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  console.log(req.file.filename);
  // await sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat('jpeg')
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/users/${req.file.filename}`);
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  console.log('FILTER PARAMS --> ', obj, allowedFields);
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });
  console.log('FILTER GENERATED --> ', newObject);
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
  // console.log('This is req object -->', req);
  console.log('This is req body and file-->', req.body, req.file);

  const filteredBody = filterObj(req.body, 'name', 'email');

  /**UPDATE THE USER PHOTO IN DATABASE */
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }
  console.log('This is filteredBody-->', filteredBody);
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
