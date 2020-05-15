const express = require('express');
const bodyParser = require('body-parser');
const { version } = require('../package.json');
const api = express();
const swaggerUi = require('swagger-ui-express');
const jsYaml = require('js-yaml');
const fs = require('fs');
const swaggerDocument = jsYaml.safeLoad(
  fs.readFileSync('api/openapi.yaml', 'utf-8')
);
const handleRegister = require('./handlers/auth/register')
const handleLogin = require('./handlers/auth/login');

api.use(bodyParser.json());
api.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

api.post('/register', handleRegister);
api.post('/login', handleLogin);

// convert validation error to json
api.use((err, req, res, next) => {
  const status = err.statusCode;
  /* istanbul ignore next */
  if (status) {
    res.status(status).json({
      error: {
        name: err.name,
        message: err.message,
        data: err.data,
      },
    });
  } else next(err);
});

// npm version
/* istanbul ignore next */
api.get('/version', (req, res) => {
  res.send(version);
});

// global error handlers for APIs to serving 500
api.use((e, req, res, next) => {
  // https://github.com/axios/axios#handling-errors
  const status = e.response ? e.response.status : 500;
  res.status(status).json({ message: e.message });
  next(e);
});

module.exports = api;