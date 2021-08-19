const { Router } = require('express');
const UserController = require('../controllers/user.controllers');
const AuthController = require('../controllers/auth.controllers');
const UserValidationSchemas = require('../validationSchemas/userValidationSchemas');
const validateRequestBody = require('../middlewares/validateRequestBody');
const { uploadUserPhoto } = require('../middlewares/uploadImage');

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Auth:
 *      properties:
 *        name:
 *          type: string
 *          description: The full name of the user.
 *        email:
 *          type: string
 *          description: The email address of the user.
 *        password:
 *          type: string
 *          description: The password of the user.
 *        passwordConfirm:
 *          type: string
 *          description: The password confirm of the user.
 *        photo:
 *          type: string
 *          description: The profile photo of the user.
 */

/**
 * @swagger
 * tags:
 *    name: Auth
 *    description: Tha Auth Routes
 */

//Profile Routes

/**
 * @swagger
 * /api/v1/users/me:
 *  get:
 *    summary: Get all information about logged in user
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: The information of the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Auth'
 *      401:
 *        description: Unauthorized, you must login.
 *  patch:
 *    summary: Update information of logged in user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Auth'
 *        multipart/form-data:
 *          schema:
 *            type: string
 *            format: binary
 *            $ref: '#/components/schemas/Image'
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: The updated information of the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Auth'
 *      401:
 *        description: Unauthorized, you must login.
 *  delete:
 *    summary: Delete the logged in user.
 *    tags: [Auth]
 *    responses:
 *      204:
 *        description: the user deleted.
 *      401:
 *        description: Unauthorized, you must login.
 */

router
  .route('/me')
  .get(AuthController.protect, UserController.getMe, UserController.getUser)
  .patch(
    AuthController.protect,
    uploadUserPhoto.single('photo'),
    UserController.updateMe
  )
  .delete(
    AuthController.protect,
    UserController.deleteMe,
    UserController.deleteUser
  );

/**
 * @swagger
 * /api/v1/users/updateMyPassword:
 *  patch:
 *    summary: Update password of logged in user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Auth'
 *          example:
 *            currentPassword: 'ABCD1234'
 *            passwordConfirm: 'ABCD1234'
 *            newPassword: 'ABCDefjk'
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: The updated information of the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Auth'
 *      401:
 *        description: Unauthorized, you must login.
 *      400:
 *        description: fail, you can try agein later.
 */

router
  .route('/updateMyPassword')
  .patch(AuthController.protect, AuthController.updatePassword);

//Authentication Routes

/**
 * @swagger
 * /api/v1/users/login:
 *  post:
 *    summary: Login user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Auth'
 *          example:
 *            email: "ahmed@keep.com"
 *            password: 'ABCD1234'
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: The information of the logged in user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Auth'
 *      400:
 *        description: fail, you can try agein later.
 *      500:
 *        description: error, incorrect email or password.
 */

/**
 * @swagger
 * /api/v1/users/signup:
 *  post:
 *    summary: Sign Up user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Auth'
 *          example:
 *            name: "Thomas Muller"
 *            email: "muller@mail.com"
 *            password: 'ABCD1234'
 *            passwordConfirm: 'ABCD1234'
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: The information of the signed up user.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Auth'
 *      400:
 *        description: fail, you can try agein later.
 */

/**
 * @swagger
 * /api/v1/users/logout:
 *  post:
 *    summary: Log Out user
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: logged out successfully.
 *      400:
 *        description: fail, you can try again later.
 *      403:
 *        description: forbidden, You do not have permission to perform this action.
 */

router
  .route('/login')
  .post(
    validateRequestBody(UserValidationSchemas.loginSchema()),
    AuthController.login
  );
router
  .route('/signup')
  .post(
    validateRequestBody(UserValidationSchemas.signupSchema()),
    AuthController.signUp
  );

router.route('/logout').get(AuthController.protect, AuthController.logout);

/**
 * @swagger
 * /api/v1/users/forgetPassword:
 *  post:
 *    summary: Forget Password, by sending reset token to given email.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Auth'
 *          example:
 *            email: "muller@mail.com"
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: reset token sent to you email, send a request with it to /resetPassword/{resetToken}
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Auth'
 *      400:
 *        description: fail, you can try agein later.
 */

/**
 * @swagger
 * /api/v1/users/resetPassword/{resetToken}:
 *  post:
 *    summary: Reset Password.
 *    parameters:
 *      - in: path
 *        required: true
 *        name: resetToken
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Auth'
 *          example:
 *            password: "abcd1234"
 *            passwordConfirm: "abcd1234"
 *    tags: [Auth]
 *    responses:
 *      200:
 *        description: Password reset successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/Auth'
 *      400:
 *        description: fail, you can try agein later.
 */

router
  .route('/forgotPassword')
  .post(
    validateRequestBody(UserValidationSchemas.forgetPassword()),
    AuthController.forgetPassword
  );

router
  .route('/resetPassword/:resetToken')
  .patch(
    validateRequestBody(UserValidationSchemas.resetPassword()),
    AuthController.resetPassword
  );

//Routes Restricted to Admins Only
router.use(AuthController.protect, AuthController.restrictTo(['admin']));
router
  .route('/')
  .get(UserController.getAllUsers)
  .post(
    validateRequestBody(UserValidationSchemas.createUserSchema()),
    UserController.createUser
  );

router
  .route('/:id')
  .get(UserController.getUser)
  .patch(
    validateRequestBody(UserValidationSchemas.updateUserSchema()),
    UserController.updateUser
  )
  .delete(UserController.deleteUser);

module.exports = router;
