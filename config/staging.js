const fs = require("fs");
module.exports = {
  services: {
    chat: "https://chat-service.staging.carrott.com/",
  },
  jwt: {
    privateKey: process.env.JWT_PRIVATE,
    publicKey: process.env.JWT_PUBLIC,
    server: process.env.JWT_SERVER,
  },
  db: {
    uri:
      "mariadb://admin:1qaz2wsx@carrott-node.cmoyikxbbpvu.eu-west-2.rds.amazonaws.com/carrott",
  },
  s3: {
    id: process.env.S3_ID,
    secret: process.env.S3_SECRET,
    bucket: process.env.S3_BUCKET,
  },
  auth: {
    apple: {
      client_id: process.env.AUTH_APPLE_CLIENT,
      team_id: process.env.AUTH_APPLE_TEAM,
      callback_uri: process.env.AUTH_APPLE_CALLBACK,
      key_id: process.env.AUTH_APPLE_KEY_ID,
      key: process.env.AUTH_APPLE_KEY,
      scope: "email name",
    },
    facebook: {
      id: process.env.AUTH_FB_ID,
      secret: process.env.AUTH_FB_SECRET,
      callback: process.env.AUTH_FB_CALLBACK,
    },
    google: {
      id: process.env.AUTH_GOOG_ID,
      secret: process.env.AUTH_GOOG_SECRET,
      callback: process.env.AUTH_GOOG_CALLBACK,
    },
  },
};
