const csurf = require('csurf');
const env = require('../config/env');

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.nodeEnv === 'production',
  },
});

const csrfTokenHandler = (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
};

module.exports = {
  csrfProtection,
  csrfTokenHandler,
};
