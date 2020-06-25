const express = require("express");
const bodyParser = require("body-parser");

const { version } = require("../package.json");
const api = express();
const swaggerUi = require("swagger-ui-express");
const jsYaml = require("js-yaml");
const passport = require("passport");
const fs = require("fs");
const swaggerDocument = jsYaml.safeLoad(
  fs.readFileSync("api/openapi.yaml", "utf-8")
);
const handleRegister = require("./handlers/auth/register");
const handleLogin = require("./handlers/auth/login");
const handlePasswordReset = require("./handlers/auth/password-reset");
const handleCompletePasswordReset = require("./handlers/auth/complete-password-reset");
const handleVerifyEmail = require("./handlers/auth/verify");
const handleFacebookLogin = require("./middleware/facebook.auth");
const handleGoogleLogin = require("./middleware/google.auth");
require("./service/notification");

api.use(passport.initialize());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

api.post("/register", handleRegister);
api.post("/login", handleLogin);
api.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
api.get("/login/facebook/callback", handleFacebookLogin);
api.post("/password-reset", handlePasswordReset);
api.post("/complete-password-reset", handleCompletePasswordReset);
api.get("/verify", handleVerifyEmail);
api.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["email", "https://www.googleapis.com/auth/plus.login"],
  })
);
api.get("/login/google/callback", handleGoogleLogin);

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
api.get("/version", (req, res) => {
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
