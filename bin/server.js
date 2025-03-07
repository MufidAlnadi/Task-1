const http = require('http');
const app = require('../src/app');
const logger = require('../src/config/logger');
const config = require('../src/config/config');
const port = config.port;
const baseURL = config.api.baseURL;
const server = http.createServer(app);
server.listen(port, () => {
  logger.info(`Server is running on ${baseURL + port}}`);
});

// Handle server errors
server.on('error', (error) => {
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      logger.error(`Server error: ${error.message}`);
      throw error;
  }
});
