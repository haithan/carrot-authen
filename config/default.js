const fs = require('fs');

module.exports = {
  jwt: {
    privateKey: fs.readFileSync('./config/certs/private.key'),
    publicKey: fs.readFileSync('./config/certs/public.key'),
    secret: 'opensesame',
  },
};
