const yup = require('yup');

class UserValidationSchemas {
  createUserSchema() {
    return yup.object().shape({
      name: yup.string().trim().required('User must have a name'),
      email: yup
        .string()
        .trim()
        .lowercase()
        .required('User must have an email')
        .email('Please enter a valid email'),
      password: yup.string().required('User must have a password').min(8),
      passwordConfirm: yup.ref('password'),
      photo: yup.string(),
    });
  }

  updateUserSchema() {
    return yup.object().shape({
      name: yup.string().trim().optional(),
      email: yup
        .string()
        .trim()
        .lowercase()
        .email('Please enter a valid email')
        .optional(),
      photo: yup.string().optional(),
    });
  }

  loginSchema() {
    return yup.object().shape({
      email: yup
        .string()
        .trim()
        .lowercase()
        .required('User must have an email')
        .email('Please enter a valid email'),
      password: yup.string().required('User must have a password').min(8),
    });
  }

  signupSchema() {
    return yup.object().shape({
      name: yup.string().trim().required('User must have a name'),
      email: yup
        .string()
        .trim()
        .lowercase()
        .required('User must have an email')
        .email('Please enter a valid email'),
      password: yup.string().required('User must have a password').min(8),
      passwordConfirm: yup.ref('password'),
    });
  }

  forgetPassword() {
    return yup.object().shape({
      email: yup
        .string()
        .trim()
        .lowercase()
        .required('User must have an email')
        .email('Please enter a valid email'),
    });
  }

  resetPassword() {
    return yup.object().shape({
      password: yup.string().required('User must have a password').min(8),
      passwordConfirm: yup.ref('password'),
    });
  }
}

module.exports = new UserValidationSchemas();
