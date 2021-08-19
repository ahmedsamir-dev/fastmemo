const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email address is not valid',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: 'default.jpeg',
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpiration: {
    type: Date,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    this.passwordConfirm = '';
  }
  next();
});

userSchema.methods.createPasswordReset = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetTokenExpiration = Date.now() + 10000 * 60; // 10 minutes

  return resetToken;
};

userSchema.statics.login = async function ({ email, password }) {
  const user = await this.findOne({ email }).select('+password');
  console.log(user);
  if (user) {
    const isPasswordsEqual = await bcrypt.compare(password, user.password);
    if (isPasswordsEqual) return user;
    else throw Error('incorrect password');
  }

  throw Error('incorrect email');
};

userSchema.statics.changeMyPassword = async function (
  id,
  { currentPassword, newPassword, passwordConfirm }
) {
  const user = await this.findById(id).select('+password');

  console.log('The User is 2', user);

  const isPasswordsEqual = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordsEqual) return [false, null];

  console.log('Good, They are Same');
  console.log(newPassword, passwordConfirm);
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;

  await user.save();

  return [true, user];
};

const User = model('User', userSchema);

module.exports = User;
