const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

app.listen(env.port, () => {
  logger.info(`${env.appName} running`, { port: env.port, env: env.nodeEnv });
});
