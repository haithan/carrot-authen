const fs = require("fs");
module.exports = {
  jwt: {
    privateKey: fs.readFileSync("./config/certs/private.key", "utf8"),
    publicKey: fs.readFileSync("./config/certs/public.key", "utf8"),
  },
  db: {
    uri:
      "mariadb://admin:1qaz2wsx@carrott-node.cmoyikxbbpvu.eu-west-2.rds.amazonaws.com/carrott",
  },
  mailer: {
    password: "18260432Slk!",
  },
};
