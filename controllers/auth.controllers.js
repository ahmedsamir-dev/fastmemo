const User = require('../models/User');
const AppError = require('../error/AppError');
const sendPasswordResetMail = require('../utils/email');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

function createAndSendJWT(user, res, statusCode) {
  const id = user._id;
  const token = jwt.sign({ id }, process.env.JWT_SECRECT_KEY, {
    expiresIn: process.env.JWT_EXP_IN,
  });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXP_IN * 24 * 60 * 60 * 1000
    ), //converting to milliseconds
    secure: true ? process.env.NODE_ENV === 'production' : false,
    httpOnly: true,
  });

  console.log(user);

  const exclude = ['password', 'passwordConfirm', '__v'];
  exclude.forEach((attribute) => {
    user[attribute] = undefined;
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
}

const extractJWToken = (req) => {
  console.log(111111111);
  const authorizationHeader = req.headers.authorization;
  let token;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    token = authorizationHeader.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  console.log(222222222222);
  return token;
};

const verifyToken = async (token) => {
  const verify = promisify(jwt.verify);
  const decodedToken = await verify(token, process.env.JWT_SECRECT_KEY);

  return decodedToken;
};

class AuthController {
  async login(req, res, next) {
    try {
      const user = await User.login(req.body);
      createAndSendJWT(user, res, 200);
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  async signUp(req, res, next) {
    try {
      const newUser = await User.create(req.body);
      newUser['password'] = undefined;

      createAndSendJWT(newUser, res, 201);
    } catch (err) {
      console.log(err);

      return next(err);
    }
  }

  logout(req, res, next) {
    res.cookie('jwt', '', { maxAge: 100, httpOnly: true });

    console.log('Loged Out now');

    res.status(200).json({
      status: 'success',
      message: 'You Succesfuly loged out',
    });
  }

  async protect(req, res, next) {
    const token = extractJWToken(req);
    if (!token) {
      return next(new AppError(401, 'Your are not logged in'));
    }

    console.log(33333333);

    const decodedToken = await verifyToken(token);
    const user = await User.findById(decodedToken.id);

    if (!user)
      return next(
        new AppError(401, 'The user belongs to this token does not exist')
      );

    req.user = user;

    console.log(44444444);
    next();
  }

  //Restrict Routers to Types of users , ex: some routes admins can access only
  restrictTo(authorized) {
    return (req, res, next) => {
      if (!authorized.includes(req.user.role))
        return next(
          new AppError(403, 'You do not have permission to perform this action') //forbbiden
        );

      next();
    };
  }

  async updatePassword(req, res, next) {
    try {
      const { currentPassword, newPassword, passwordConfirm } = req.body;

      const [done, user] = await User.changeMyPassword(req.user._id, {
        currentPassword,
        newPassword,
        passwordConfirm,
      });

      if (!done) return next(new AppError(401, 'Incorrect email or password'));

      console.log('The User is', user);

      createAndSendJWT(user, res, 200);
    } catch (err) {
      next(err);
    }
  }

  async forgetPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      console.log(user);

      if (!email) return next(new AppError(400, 'Incorrect email'));

      const resetToken = user.createPasswordReset();
      await user.save({ validateBeforeSave: false });

      const mail = await sendPasswordResetMail(user, resetToken);

      // console.log(mail);

      res.status(200).json({
        status: 'success',
      });
    } catch (err) {
      console.log(err);
      this.passwordResetToken = undefined;
      this.passwordResetTokenExpiration = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('There was an error sending email. try again later', 500)
      );
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { resetToken } = req.params;

      const hashedResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const user = await User.findOne({
        passwordResetToken: hashedResetToken,
        passwordResetTokenExpiration: { $gt: Date.now() },
      });

      if (!user) return next(new AppError(400, 'Token has invalid or expired'));

      const { password, passwordConfirm } = req.body;

      user.password = password;
      user.passwordConfirm = passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiration = undefined;

      await user.save();

      createAndSendJWT(user, res, 200);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
