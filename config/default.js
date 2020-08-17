const fs = require("fs");
module.exports = {
  services: {
    chat: "https://chat-service.staging.carrott.com/",
  },
  jwt: {
    privateKey: fs.readFileSync("./config/certs/private.key", "utf8"),
    publicKey: fs.readFileSync("./config/certs/public.key", "utf8"),
    server:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoIiwiaXNzIjoiQ2Fycm90dCBTZXJ2aWNlIiwiYXVkIjoiQ2Fycm90dCIsIm5iZiI6MTU5MjU3MjA3Mi4wMjEsImp0aSI6IjU3YWMzYTMwLTNiZDgtNGRjZC1iMzNhLTQ0ZDZmYTY2NGFlNCIsImlhdCI6MTU5MjU3MjA3M30.jevArNXVd6BfSV1DFPYPT1p2XcK3f9MNuzfJTaMC9RVj-i9aqRKxwCeirWpO_aei9lKKui47qkWzIQn7ZUim-Q",
  },
  db: {
    uri:
      "mariadb://admin:1qaz2wsx@carrott-node.cmoyikxbbpvu.eu-west-2.rds.amazonaws.com/carrott",
  },
  s3: {
    id: "AKIAX77KKAIZ7NJRB4FW",
    secret: "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",
    bucket: "carrott-image",
  },
  auth: {
    apple: {
      client_id: "com.carrott.authServ",
      team_id: "5SNT52N7HG",
      callback_uri:
        "https://auth-service.staging.carrott.com/api/v1/login/apple/callback",
      key_id: "U56V8L387N",
      key: fs.readFileSync("./config/certs/AuthKey_U56V8L387N.p8", "utf8"),
      scope: "email name",
    },
    facebook: {
      id: "1210809899251444",
      secret: "58b45616e2a0ce14d77790bb17361838",
      callback:
        "https://auth-service.staging.carrott.com/api/v1/login/facebook/callback",
    },
    google: {
      id:
        "1008336361012-lc78mn7v1ji3dg7m9dj66u5ihgh4sjiu.apps.googleusercontent.com",
      secret: "t7VQr_vD2-39tZlluwkyR0Xp",
      callback:
        "https://auth-service.staging.carrott.com/api/v1/login/google/callback",
    },
  },
};
