const path         = require('path')
const winston      = require('winston')

const PROJECT_ROOT = path.join(__dirname, "..")

function getStackInfo(stackIndex) {
  const stacklist = new Error().stack.split("\n").slice(3);
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  const s = stacklist[stackIndex] || stacklist[0]
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(PROJECT_ROOT, sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join("\n")
    };
  }
}

function formatLogArguments(args) {
  args = Array.prototype.slice.call(args);
  const stackInfo = getStackInfo(1);

  if (stackInfo) {
    const calleeStr = `[${stackInfo.relativePath}:${stackInfo.line}]`
    args[0] = calleeStr + ' ' + JSON.stringify(args[0])
    // if (typeof args[0] === "string") {
    // } else {
    //   args.unshift(calleeStr)
    // }
  }

  return args
}


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
    winston.format.colorize({ all:true }),
    winston.format.timestamp({
       format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    winston.format.prettyPrint(),
    winston.format.printf(info => `[${[info.timestamp]}][${info.level}]${info.message}`),
)
});


module.exports.info = function() {
  logger.info.apply(logger, formatLogArguments(arguments));
}

module.exports.log = function() {
  logger.log.apply(logger, formatLogArguments(arguments));
}

module.exports.warn = function() {
  logger.warn.apply(logger, formatLogArguments(arguments));
}

module.exports.error = function() {
  logger.error.apply(logger, formatLogArguments(arguments));
}
