const winston = require('winston');
const {createLogger, format, transports} = winston;
const {combine, timestamp, printf, colorize} = format;

const logFormat = printf(({timestamp, level, message}) => {
  return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), colorize(), logFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
    new transports.File({
      filename: 'logs/app.log',
      level: 'info',
    }),
  ],
});

module.exports = logger;
