const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// NAME EMAIL PHOTO PASSWORD CONFIRM PASSWORD
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, ' A user must have an email'],
    validate: [validator.isEmail, 'Provide a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'admin', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  passwordGivenByUser,
  correctPasswordInDB,
) {
  return await bcrypt.compare(passwordGivenByUser, correctPasswordInDB);
};
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimeStamp);
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  /**IF THE PASSWORD WAS NOT CHANGED */
  return false;
};

userSchema.methods.passReset = function () {
  /**1) GENERATE A RANDOM STRING IT SHOULD NOT BE AS STRONG AS PASSWORD HASH WE CREATED BEFORE  */
  /**2) SEND THIS TOKEN TO USER--> ONLY THAT USER  HAVING THIS TOKEN WILL HAVE ACCESS TO RESET A PASSWORD  */
  /**3) DO NOT STORE RESET TOKEN IN MY DATABASE SEND IT TO USER --> SO NO NEED TO ENCRPYT IT MORE */
  const resetToken = crypto
    .randomBytes(32)
    .toString('hex'); /**CONVERT TO HEXADECIMAL */

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
