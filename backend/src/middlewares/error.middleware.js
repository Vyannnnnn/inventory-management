const logger = require('../utils/logger');

const notFoundMiddleware = (req, res) => {
  res.status(404).json({ message: 'Route tidak ditemukan' });
};

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error('Unhandled error', {
    path: req.originalUrl,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });

  if (res.headersSent) {
    return next(err);
  }

  res.status(statusCode).json({
    message: err.message || 'Terjadi kesalahan server',
  });
};

module.exports = {
  notFoundMiddleware,
  errorMiddleware,
};
