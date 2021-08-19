const yup = require('yup');
const AppError = require('../error/AppError');

const validateRequestBody = function (schema) {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.validate(req.body);

      req.body = validatedBody;

      console.log('validated body: ', validatedBody);

      next();
    } catch (err) {
      console.log('error', err);
      return next(new AppError(400, 'Invalid input'));
    }
  };
};

module.exports = validateRequestBody;
