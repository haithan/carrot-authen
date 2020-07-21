const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const { version } = require("../package.json");

const api = express();

api.use(passport.initialize());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes");
Object.values(routes).forEach(({ name, router }) => {
  if (!name || !router) return;
  api.use(`/api/v1/${name}`, router);
});

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

/* istanbul ignore next */
api.get("/version", (req, res) => {
  res.send(version);
});

api.use((e, req, res, next) => {
  const status = e.response ? e.response.status : 500;
  res.status(status).json({ message: e.message });
  next(e);
});

module.exports = api;
