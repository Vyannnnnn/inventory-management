const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validasi gagal',
      errors: errors.array(),
    });
  }
  return next();
};

module.exports = validateRequest;
