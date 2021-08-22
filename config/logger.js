const path    = require('path')
const winston = require('winston')

const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)({
      json: false,
      timestamp: true
    }),
    new winston.transports.File({ filename: path.join(__dirname, '..', 'logs/debug.log'), json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: path.join(__dirname, '..', 'logs/exceptions.log'), json: false })
  ],
  exitOnError: false,
  format: winston.format.combine(
    winston.format.align(),
    winston.format.colorize({ all:true }),
    winston.format.timestamp({
       format: 'MMM-DD-YYYY HH:mm:ss'
   }),
    winston.format.printf(info => `[${[info.timestamp]}][${info.level}]: ${info.message}`),
)
});

module.exports = logger;
