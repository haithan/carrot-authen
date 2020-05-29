const fs = require("fs");

module.exports = {
  jwt: {
    privateKey: fs.readFileSync("./config/certs/private.key", "utf8"),
    publicKey: fs.readFileSync("./config/certs/public.key", "utf8"),
  },
  db: {
    uri: "sqlite::memory",
  },
  mailer: {
    address: "hello@carrott.com",
    password: "18260432Slk!",
  },
};
