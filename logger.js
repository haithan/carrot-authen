const Pino = require('pino');
const PinoLogger = require('express-pino-logger');

const ignorePaths = ['/ping'];

const options = {
  customLevels: {
    trace: 10,
    debug: 20,
    info: 30,
    warning: 40,
    error: 50,
    fatal: 60,
  },
  redact: {
    paths: [
      'hostname',
      'res.raw',
      'req.raw',
      'req.remoteAddress',
      'req.remotePort',
      'req.headers.host',
      'req.headers.accept',
      'req.headers.connection',
      'req.headers["if-none-match"]',
      'req.headers["accept-language"]',
      'req.headers["accept-encoding"]',
      'req.headers["upgrade-insecure-requests"]',
      'req.headers["cache-control"]',
      'res.headers["x-dns-prefetch-control"]',
      'res.headers["strict-transport-security"]',
      'res.headers["x-download-options"]',
      'res.headers["x-content-type-options"]',
      'res.headers["referrer-policy"]',
      'res.headers["access-control-allow-origin"]',
      'res.headers["access-control-expose-headers"]',
      'res.headers["x-xss-protection"]',
      'res.headers["x-powered-by"]',
      'res.headers["x-robots-tag"]',
      'res.headers["cache-control"]',
      'res.headers["content-type"]',
    ],
    remove: true,
  },
  useOnlyCustomLevels: true,
  level: process.env.LOG_LEVEL || 'warning',
  prettyPrint: process.env.NODE_ENV !== 'production',
};

const logger = new Pino(options);

const customLogLevel = function(res, err) {
  if (res.statusCode >= 400 && res.statusCode < 500) {
    return 'warning';
  } else if (res.statusCode >= 500 || err) {
    return 'error';
  }
  return 'info';
};

const unless = function(middleware, paths) {
  return (req, res, next) => {
    const pathCheck = paths.some(path => req.path.startsWith(path));

    if (pathCheck) {
      return next();
    }

    return middleware(req, res, next);
  };
};

module.exports = unless(PinoLogger({ logger, customLogLevel }), ignorePaths);