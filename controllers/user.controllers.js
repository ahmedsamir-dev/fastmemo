const User = require('../models/User');
const AppError = require('../error/AppError');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
      const users = await User.find();

      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (err) {
      console.log(err);
      return next(err);
    }
  }

  //Get One
  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) return next(new AppError(404, 'No user found with that ID'));

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const body = req.body;
      const newUser = await User.create(body);

      newUser['password'] = undefined;
      console.log('created user', newUser);
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const body = req.body;

      const user = await User.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!user) return next(new AppError(404, 'No user found with that ID'));

      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      console.log('here', err);
      return next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      if (!(await User.findByIdAndDelete(id)))
        return next(new AppError(404, 'No user found with that ID'));

      res.status(204).json({
        status: 'success',
      });
    } catch (err) {
      console.log('here', err);
      return next(err);
    }
  }

  getMe(req, res, next) {
    req.params.id = req.user._id;
  }

  async updateMe(req, res, next) {
    try {
      if (req.body.password || req.body.passwordConfirm)
        return next(
          new AppError(
            'This route is not for password updates please use /updateMyPassword',
            400
          )
        );

      const dataToUpdate = {};
      if (req.body.name) dataToUpdate['name'] = req.body.name;
      if (req.body.email) dataToUpdate['email'] = req.body.email;
      if (req.file) dataToUpdate['photo'] = req.file.filename;

      console.log(req.file);

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        dataToUpdate,
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser,
        },
      });
    } catch (err) {
      return next(err);
    }
  }

  async deleteMe(req, res, next) {
    try {
      await User.findByIdAndDelete(req.user._id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UserController();
