class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperation = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new AppError(400, message);
  }
}


module.exports = AppError;
