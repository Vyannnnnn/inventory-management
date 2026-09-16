const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const apiRoutes = require('./routes');
const { csrfProtection, csrfTokenHandler } = require('./middlewares/csrf.middleware');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

if (env.enableCsrf) {
  app.get(`${env.apiPrefix}/security/csrf-token`, csrfProtection, csrfTokenHandler);
  app.use((req, res, next) => {
    if (req.path.endsWith('/auth/login') || req.method === 'GET') {
      return next();
    }
    return csrfProtection(req, res, next);
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: env.appName });
});

app.use(env.apiPrefix, apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
