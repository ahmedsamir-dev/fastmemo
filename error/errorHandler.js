const AppError = require('./AppError');

function handleCastErrorDB(err) {
  return new AppError(400, `Invalid ${err.path}: ${err.value}`);
}

function handleDuplicateKey() {
  return new AppError(400, 'Duplicate field, please use another value');
}

function sendErrorProd(err, res) {
  if (err.isOperation)
    return res
      .status(err.statusCode)
      .json({ status: err.status, message: err.message });
  else
    res.status(500).json({ status: 'error', message: 'Something went wrong' });
}

function sendErrorDev(err, res) {
  return res
    .status(err.statusCode)
    .json({ status: err.status, message: err.message, stack: err.stack });
}

function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else {
    let error = err;
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    else if (err.code === 11000) error = handleDuplicateKey(error);

    sendErrorProd(error, res);
  }
}

module.exports = errorHandler;
