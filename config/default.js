const fs = require("fs");
module.exports = {
  services: {
    chat:
      "http://chatservice-dev-env.eba-nhnapdm2.eu-west-2.elasticbeanstalk.com/",
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
  auth: {
    google: {
      id:
        "1008336361012-lc78mn7v1ji3dg7m9dj66u5ihgh4sjiu.apps.googleusercontent.com",
      secret: "t7VQr_vD2-39tZlluwkyR0Xp",
    },
  },
};
